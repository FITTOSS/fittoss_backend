/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import expressRequestMock from "express-request-mock";
import httpMocks from "node-mocks-http";
import {
  getSetUser,
  getConfirmEmail,
  getLogout,
  postRegister,
  patchChangePassword,
  patchLogin,
  patchResetPassword,
} from "../../controllers/golobalController";
import { User } from "../../models/User";
import { Auth } from "../../models/Auth";
import permission from "../data/permission.json";
import confirmEmail from "../data/confirmEmail.json";
import createUser from "../data/createUser.json";
import success from "../data/success.json";
import userData from "../data/userData.json";
import invalidUserData from "../data/invalidUserData.json";

let { hash, compare } = require("bcrypt");

// mock 함수
Auth.findOne = jest.fn();
Auth.create = jest.fn();
User.findByIdAndUpdate = jest.fn();
User.exists = jest.fn();
hash = jest.fn();
compare = jest.fn();

let req;
let res;
let next;

const emailKey = "asdfgh";
const ttl = 100;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe("GET /api/user/set getSetUser", () => {
  it("should have a getSetUser function", async () => {
    expect(typeof getSetUser).toBe("function");
  });

  it("should return 200 response code", async () => {
    await getSetUser(req, res, next);

    expect(res.statusCode).toBe(200);
  });

  it("should return json body response", async () => {
    const option = {
      session: {
        loggedIn: false,
        user: {
          name: "wonjae",
        },
      },
    };

    const { res: setUser } = await expressRequestMock(getSetUser, option);
    expect(setUser._getJSONData()).toStrictEqual(permission);
  });
});

describe("GET /api/email getConfirmEmail", () => {
  req = httpMocks.createRequest({
    query: {
      emailKey,
      ttl,
    },
  });
  describe("성공 시", () => {
    it("should have a getSetUser function", async () => {
      expect(typeof getConfirmEmail).toBe("function");
    });
    it("should return json body and response code 200", async () => {
      Auth.findOne.mockReturnValue(true);
      User.findByIdAndUpdate.mockReturnValue({
        emailVerified: true,
      });
      await getConfirmEmail(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(confirmEmail);
      expect(res._isEndCalled).toBeTruthy();
    });
  });

  describe("실패 시", () => {
    it("이메일 인증이 안됬을 경우, 400으로 응답한다.", async () => {
      Auth.findOne.mockReturnValue(false);
      await getConfirmEmail(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._isEndCalled).toBeTruthy();
    });
  });
});

describe("GET /api/logout getLogout", () => {
  describe("성공 시", () => {
    req = httpMocks.createRequest({
      session: {
        loggedIn: true,
      },
    });

    it("should have a getSetUser function", async () => {
      expect(typeof getLogout).toBe("function");
    });

    it("should return json body and response code 200", async () => {
      const option = {
        session: {
          loggedIn: true,
          destroy: () => {},
        },
      };

      const { res: data } = await expressRequestMock(getLogout, option);
      expect(data._getJSONData()).toStrictEqual(success);
      expect(data.statusCode).toBe(200);
      expect(res._isEndCalled).toBeTruthy();
    });
  });

  describe("실패 시", () => {
    it("로그인 하지 않은 경우, 400으로 응답한다", async () => {
      const option = {
        session: {
          loggedIn: false,
        },
      };

      const { res: data } = await expressRequestMock(getLogout, option);
      expect(data.statusCode).toBe(400);
      expect(res._isEndCalled).toBeTruthy();
    });
  });
});

describe("POST /api/register", () => {
  describe("성공 시", () => {
    it("should have a postRegister function", () => {
      req.body = userData;
      expect(typeof postRegister).toBe("function");
    });
  });

  describe("실패 시", () => {
    it("res.body의 email or password 누락 시 400을 반환한다", async () => {
      req.body = {};
      await postRegister(req, res, next);
      expect(next).toBeCalledWith(
        new Error("이메일 또는 비밀번호를 입력해주세요.")
      );
    });

    beforeEach(() => {
      req.body = userData;
    });

    it("가입된 이메일인 경우 400을 반환한다.", async () => {
      User.exists.mockReturnValue(true);
      await postRegister(req, res, next);
      expect(next).toBeCalledWith(new Error("가입된 이메일 입니다."));
    });

    it("비밀번호가 8자 이상일 경우 400을 반환한다.", async () => {
      req.body = invalidUserData;
      User.exists.mockReturnValue(false);
      await postRegister(req, res, next);
      expect(next).toBeCalledWith(
        new Error("비밀번호를 8자 이상으로 설정해주세요.")
      );
    });
  });
});
