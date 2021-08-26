/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import crypto from "crypto";
import fetch from "node-fetch";
import { generateHash } from "../nodemailer/generateHash";
import { User } from "../models/User";
import { Auth } from "../models/Auth";
import { nodemail } from "../nodemailer/nodemail";

const { hash, compare } = require("bcrypt");

const { KAKAO_CLIENT_ID, KAKAO_SECRET, KAKAO_REDIRECT_URL } = process.env;

export const getSetUser = async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      const user = await User.findById(req.session.user._id);
      res.status(200).json({
        suceess: true,
        data: user,
      });
    } else {
      res.status(200).json({ success: true, message: "권한이 없습니다." });
    }
  } catch (error) {
    next(error);
  }
};

export const getConfirmEmail = async (req, res, next) => {
  try {
    const { emailKey, ttl } = req.query;

    const isValid = await Auth.findOne({
      emailKey,
      emailCreatedAt: { $gte: new Date(Date.now() - ttl) },
    });

    if (!isValid)
      return res.status(400).json({
        success: false,
        messgae: "이메일 인증 유효시간이 지났습니다.",
      });

    const updateUser = await User.findByIdAndUpdate(
      isValid.userId,
      { emailVerified: true },
      { new: true }
    );

    res.status(200).json({ success: true, data: updateUser });
  } catch (error) {
    next(error);
  }
};

export const getLogout = (req, res, next) => {
  try {
    if (!req.session.loggedIn)
      return res
        .status(400)
        .json({ successs: false, message: "권한이 없습니다." });

    req.session.destroy();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const postRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 이메일 or 비밀번호 유무 체크
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "이메일 또는 비밀번호를 입력해주세요.",
      });

    // 이메일 중복 체크, 비밀번호 해쉬화
    const [emailExist, hashedPassword] = await Promise.all([
      User.exists({ email }),
      hash(password, 10),
    ]);

    if (emailExist)
      return res
        .status(400)
        .json({ success: false, message: "가입된 이메일입니다." });

    // 비밀번호 길이 체크
    if (password.length < 8)
      return res.status(400).json({
        success: false,
        message: "비밀번호를 8자 이상으로 설정해주세요.",
      });

    // 이메일 인증 키 발급
    const emailKey = generateHash();

    const newUser = new User({ email, password: hashedPassword });
    const [user, auth] = await Promise.all([
      newUser.save(),
      Auth.create({
        emailKey,
        emailCreatedAt: new Date(),
        userId: newUser.id,
      }),
    ]);

    nodemail(email, emailKey, auth.ttl);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const patchLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 이메일 or 비밀번호 유무 체크
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "이메일 또는 비밀번호를 입력해주세요.",
      });

    // kakao로 먼저 가입한 경우
    // 몇몇 유저들은 kakao로 로그인 했는지 password를 통해서 login 했는지 잊어버리기 때문이다.

    const user = await User.findOne({ email, socialOnly: false });
    if (!user)
      return res
        .status(400)
        .json({ success: false, messasge: "가입되지 않은 이메일입니다." });

    const isValid = await compare(password, user.password);
    if (!isValid)
      return res
        .status(400)
        .json({ success: false, messasge: "비밀번호를 확인해주세요." });

    if (!user.emailVerified) {
      const emailKey = generateHash();
      const auth = await Auth.findOneAndUpdate(
        { userId: user.id },
        { emailKey, emailCreatedAt: Date.now() },
        { new: true }
      );

      nodemail(email, emailKey, auth.ttl);
      return res
        .status(400)
        .json({ success: false, messasge: "이메일 인증을 완료해주세요." });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const patchResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetKey = crypto.randomBytes(5).toString("hex");

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "이메일을 입력해주세요." });

    const [user, hashedPassword] = await Promise.all([
      User.findOne({ email }),
      hash(resetKey, 10),
    ]);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "가입되지 않은 이메일입니다." });

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
      return res
        .status(400)
        .json({ success: false, message: "권한이 없습니다." });

    console.log(req.session);

    const { password } = req.body;
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "비밀번호를 입력해주세요." });

    if (password.length < 8)
      return res.status(400).json({
        success: false,
        message: "비밀번호를 8자 이상으로 설정해주세요.",
      });

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

export const startKakaoLogin = (req, res, next) => {
  try {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
      response_type: "code",
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URL,
      prompt: "login",
      score: "account_email",
    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
  } catch (error) {
    next(error);
  }
};

export const finishKakaoLogin = async (req, res, next) => {
  try {
    const { code } = req.query;

    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
      grant_type: "authorization_code",
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URL,
      code,
      client_secret: KAKAO_SECRET,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (
      await fetch(finalUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      })
    ).json();

    if (tokenRequest.access_token) {
      const { access_token } = tokenRequest;
      const apiUrl = `https://kapi.kakao.com/v2/user/me?property_keys=["kakao_account.email"]`;
      const userData = await (
        await fetch(apiUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${access_token}`,
          },
        })
      ).json();

      const { email } = userData.kakao_account;
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          socialOnly: true,
          emailVerified: true,
        });
      }

      req.session.loggedIn = true;
      req.session.user = user;
      return res.status(200).json({ success: true, data: user });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "토큰이 유효하지 않습니다." });
    }
  } catch (error) {
    next(error);
  }
};
