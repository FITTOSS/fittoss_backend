import crypto from "crypto";
import { generateHash } from "../nodemailer/generateHash";
import { User } from "../models/User";
import { Auth } from "../models/Auth";
import { nodemail } from "../nodemailer/nodemail";

const { hash, compare } = require("bcrypt");

export const getConfirmEmail = async (req, res, next) => {
  try {
    const { emailKey, ttl } = req.query;

    const isValid = await Auth.findOne({
      emailKey,
      emailCreatedAt: { $gte: new Date(Date.now() - ttl) },
    });

    if (!isValid)
      return res
        .status(400)
        .json({ messgae: "이메일 인증 유효시간이 지났습니다." });

    const updateUser = await User.findByIdAndUpdate(
      isValid.userId,
      { emailVerified: true },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

export const getLogout = (req, res, next) => {
  try {
    console.log(req.session);

    if (!req.session.loggedIn)
      return res.status(400).json({ message: "권한이 없습니다." });

    req.session.destroy();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const postRegister = async (req, res, next) => {
  // toDo
  // 이메일 인증

  try {
    const { email, password, role } = req.body;

    // 이메일 or 비밀번호 유무 체크
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호를 입력해주세요." });

    // 비밀번호 길이 체크
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "비밀번호를 8자 이상으로 설정해주세요." });

    // 이메일 중복 체크
    const emailExist = await User.exists({ email });
    if (emailExist)
      return res.status(400).json({ message: "가입된 이메일입니다." });

    // 비밀번호 해쉬화
    const hashedPassword = await hash(password, 10);
    // 이메일 인증 키 발급
    const emailKey = generateHash();

    const newUser = new User({ email, password: hashedPassword, role });
    const [user, auth] = await Promise.all([
      newUser.save(),
      Auth.create({
        emailKey,
        emailCreatedAt: new Date(),
        userId: newUser.id,
      }),
    ]);

    nodemail(email, emailKey, auth.ttl);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const patchLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 이메일 or 비밀번호 유무 체크
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "이메일 또는 비밀번호를 입력해주세요." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ messasge: "가입되지 않은 이메일입니다." });

    const isValid = await compare(password, user.password);
    if (!isValid)
      return res.status(400).json({ messasge: "비밀번호를 확인해주세요." });

    if (!user.emailVerified) {
      const emailKey = generateHash();
      const auth = await Auth.findOneAndUpdate(
        { userId: user.id },
        { emailKey, emailCreatedAt: Date.now() },
        { new: true }
      );

      nodemail(email, emailKey, auth.ttl);
      return res.status(400).json({ messasge: "이메일 인증을 완료해주세요." });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const patchResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetKey = crypto.randomBytes(5).toString("hex");

    if (!email)
      return res.status(400).json({ message: "이메일을 입력해주세요." });

    const [user, hashedPassword] = await Promise.all([
      User.findOne({ email }),
      hash(resetKey, 10),
    ]);
    if (!user)
      return res.status(400).json({ message: "가입되지 않은 이메일입니다." });

    user.password = hashedPassword;
    await user.save();
    nodemail(email, resetKey, 0, "password");

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const patchChangePassword = async (req, res, next) => {
  try {
    if (!req.session.loggedIn)
      return res.status(400).json({ message: "권한이 없습니다." });

    console.log(req.session);

    const { password } = req.body;
    if (!password)
      return res.status(400).json({ message: "비밀번호를 입력해주세요." });

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "비밀번호를 8자 이상으로 설정해주세요." });

    const hashedPassword = await hash(password, 10);
    await User.findOneAndUpdate(
      { email: req.session.user.email },
      { password: hashedPassword }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "7fc39f9d6a798fcc4ec4",
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const { code } = req.query;

  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: "7fc39f9d6a798fcc4ec4",
    client_secret: "79eb91f4cde53be4467f3d7085f643c2fd03c1d5",
    code,
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const data = await fetch(finalUrl, {
    method: "post",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  console.log(json);
};
