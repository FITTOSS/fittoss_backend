import express from "express";
import { routes } from "../routes";
import {
  postRegister,
  postLogin,
  getConfirmEmail,
  postRecallEmail,
} from "../controllers/golobalController";

export const globalRouter = express.Router();

// local register
globalRouter.post(routes.register, postRegister);
// local login
globalRouter.post(routes.login, postLogin);
// 새로운 이메일 인증 요청
globalRouter.post(routes.recallEmail, postRecallEmail);

// email 인증 검증
globalRouter.get(routes.emailConfirm, getConfirmEmail);
