import express from "express";
import { routes } from "../routes";
import {
  getSetUser,
  getConfirmEmail,
  getLogout,
  postRegister,
  patchLogin,
  patchResetPassword,
  patchChangePassword,
  startKakaoLogin,
  finishKakaoLogin,
} from "../controllers/golobalController";

export const globalRouter = express.Router();

/**
 * @swagger
 *  /user/set:
 *    get:
 *      tags:
 *      - global
 *      description: 유저 로그인 유무 검증
 *      produces:
 *      - application/json
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */

// 유저 로그인 유무 검증
globalRouter.get(routes.setUser, getSetUser);
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

// kakao
globalRouter.get(routes.kakaoStart, startKakaoLogin);
globalRouter.get(routes.kakaoFinish, finishKakaoLogin);
