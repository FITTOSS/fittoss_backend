// HOME
const HOME = "/api";

// set user
const SET_USER = "/user/set";

// local register
const REGISTER = "/register";

// local login
const LOGIN = "/login";

//logout
const LOGOUT = "/logout";

// email confirm
const EMAIL_CONFIRM = "/email";

// reset password
const PASSWORD_RESET = "/password/reset";

// change password
const PASSWORD_CAHNGE = "/password/change";

// kakao
const KAKAO_START = "/kakao/start";
const KAKAO_FINISH = "/kakao/finish";

export const routes = {
  home: HOME,
  setUser: SET_USER,
  register: REGISTER,
  login: LOGIN,
  emailConfirm: EMAIL_CONFIRM,
  passwordReset: PASSWORD_RESET,
  passwordChange: PASSWORD_CAHNGE,
  logout: LOGOUT,
  kakaoStart: KAKAO_START,
  kakaoFinish: KAKAO_FINISH,
};
