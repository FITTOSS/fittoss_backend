import express from "express";
import { routes } from "../routes";
import {
  postRegister,
  postLogin,
  getConfirmEmail,
  postResetPassword,
} from "../controllers/golobalController";

export const globalRouter = express.Router();

// email 인증 검증
globalRouter.get(routes.emailConfirm, getConfirmEmail);
// local register
globalRouter.post(routes.register, postRegister);
// local login
globalRouter.post(routes.login, postLogin);
// 비밀번호 초기화
globalRouter.patch(routes.password, postResetPassword);
