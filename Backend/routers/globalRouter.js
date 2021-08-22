import express from "express";
import { routes } from "../routes";
import {
  postRegister,
  postLogin,
  getConfirmEmail,
} from "../controllers/golobalController";

export const globalRouter = express.Router();

// local register
globalRouter.post(routes.register, postRegister);
// local login
globalRouter.post(routes.login, postLogin);

// email 인증 검증
globalRouter.get(routes.emailConfirm, getConfirmEmail);
