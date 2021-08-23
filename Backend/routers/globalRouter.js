import express from "express";
import { routes } from "../routes";
import {
  getConfirmEmail,
  getLogout,
  postRegister,
  patchLogin,
  patchResetPassword,
  patchChangePassword,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/golobalController";

export const globalRouter = express.Router();

// email 인증 검증
globalRouter.get(routes.emailConfirm, getConfirmEmail);
// logout
globalRouter.get(routes.logout, getLogout);
// local register
globalRouter.post(routes.register, postRegister);
// local login
globalRouter.patch(routes.login, patchLogin);
// 비밀번호 초기화
globalRouter.patch(routes.passwordReset, patchResetPassword);
// 비밀번호 변경
globalRouter.patch(routes.passwordChange, patchChangePassword);

// github
globalRouter.get("/github/start", startGithubLogin);
globalRouter.get("/github/finish", finishGithubLogin);
