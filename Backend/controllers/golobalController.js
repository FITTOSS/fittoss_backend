import { generateHash } from "../nodemailer/generateHash";
import { User } from "../models/User";
import { nodemail } from "../nodemailer/nodemail";

const { hash, compare } = require("bcrypt");

export const postRegister = async (req, res, next) => {
  // toDo
  // 이메일 인증

  try {
    const { email, password } = req.body;

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

    const user = await User.create({
      email,
      password: hashedPassword,
      emailKey,
      emailCreatedAt: new Date(),
    });

    nodemail(email, emailKey);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getConfirmEmail = async (req, res, next) => {
  try {
    const { emailKey } = req.query;

    const user = await User.findOne({ emailKey });

    const updateUser = await User.findOneAndUpdate(
      {
        emailKey,
        emailCreatedAt: { $gte: new Date(Date.now() - user.ttl) },
      },
      { emailVerified: true },
      { new: true }
    );

    if (!updateUser)
      return res
        .status(400)
        .json({ message: "이메일 인증 유효시간이 지났습니다." });

    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
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

    if (!user.emailVerified)
      return res.status(400).json({ messasge: "이메일 인증을 완료해주세요." });

    req.session.loggedIn = true;
    req.session.user = user;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
