import { User } from "../models/User";
const { hash, compare } = require("bcrypt");

export const postRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email or password를 입력해주세요." });

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "비밀번호를 8자 이상으로 설정해주세요." });

    const hashedPassword = await hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(200).json({ message: "회원가입을 완료하였습니다." });
  } catch (error) {
    next(error);
  }
};
