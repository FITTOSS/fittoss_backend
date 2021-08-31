/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import expressRequestMock from "express-request-mock";
import httpMocks from "node-mocks-http";
import bcrypt from "bcrypt";
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
import successUser from "../data/successUser.json";
import success from "../data/success.json";
import userData from "../data/userData.json";
import invalidUserData from "../data/invalidUserData.json";

// mock 함수
Auth.findOne = jest.fn();
Auth.create = jest.fn();
Auth.findOneAndUpdate = jest.fn();
User.findByIdAndUpdate = jest.fn();
User.findOneAndUpdate = jest.fn();
User.exists = jest.fn();
User.findOne = jest.fn();

jest.mock("bcrypt", () => ({
  async hash() {
    return await new Promise((resolve) => resolve("hash"));
  },
  async compare() {
    return await new Promise((resolve) => resolve(true));
  },
}));

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

jest.useFakeTimers();
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

    it("가입된 이메일인 경우 400을 반환한다.", async () => {
      req.body = userData;
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

describe("PATCH /api/login", () => {
  beforeEach(() => {
    req.body = userData;
  });
  describe("성공 시", () => {
    it("should have a patchLogin", async () => {
      expect(typeof patchLogin).toBe("function");
    });

    it("should call User.findOne()", async () => {
      await patchLogin(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        email: "yoteamo7@naver.com",
        socialOnly: false,
      });
    });

    it("should return json body in response", async () => {
      req.session = {};
      User.findOne.mockReturnValue({
        password: "12345678910",
        emailVerified: true,
      });

      await patchLogin(req, res, next);
      expect(res._getJSONData()).toStrictEqual(successUser);
      expect(res._isEndCalled).toBeTruthy();
    });
  });

  describe("실패 시", () => {
    it("res.body의 email or password 누락 시 400을 반환한다", async () => {
      req.body = {};
      await patchLogin(req, res, next);
      expect(next).toBeCalledWith(
        new Error("이메일 또는 비밀번호를 입력해주세요.")
      );
    });

    it("가입되지 않은 이메일 | 첫 가입이 sns인 경우 400을 반환한다", async () => {
      User.findOne.mockReturnValue(undefined);
      await patchLogin(req, res, next);

      expect(next).toBeCalledWith(new Error("가입되지 않은 이메일입니다."));
    });

    it("이메일 인증을 안 한 경우 400을 반환한다", async () => {
      User.findOne.mockReturnValue({ emailVerified: false, id: 1 });
      Auth.findOneAndUpdate.mockReturnValue({ ttl: 200 });
      await patchLogin(req, res, next);

      expect(next).toBeCalledWith(new Error("이메일 인증을 완료해주세요."));
    });
  });
});

describe("PATCH /api/password/reset", () => {
  beforeEach(() => {
    req.body = userData;
  });

  describe("성공 시", () => {
    it("should have a patchLogin", async () => {
      expect(typeof patchResetPassword).toBe("function");
    });

    it("should return json body in response", async () => {
      User.findOne.mockReturnValue({
        password: "12345678910",
        save: () => new Promise((resolve) => resolve({ success: true })),
      });

      await patchResetPassword(req, res, next);
      expect(res._getJSONData()).toStrictEqual(success);
      expect(res._isEndCalled).toBeTruthy();
    });
  });

  describe("실패 시", () => {
    it("req.body에 email 누락 시 400을 반환한다.", async () => {
      req.body = {};
      await patchResetPassword(req, res, next);

      expect(next).toBeCalledWith(new Error("이메일을 입력해주세요."));
    });

    it("가입되지 않은 계정일 경우 400을 반환한다.", async () => {
      User.findOne.mockReturnValue(undefined);
      await patchResetPassword(req, res, next);

      expect(next).toBeCalledWith(new Error("가입되지 않은 이메일입니다."));
    });
  });
});

describe("PATCH /api/password/change", () => {
  beforeEach(() => {
    req.body = userData;
  });

  describe("성공 시", () => {
    it("should have a patchChangePassword", () => {
      expect(typeof patchChangePassword).toBe("function");
    });

    it("should call User.findOneAndUpdate()", async () => {
      req = httpMocks.createRequest({
        session: {
          loggedIn: true,
          user: {
            email: "test@test.com",
          },
        },
        body: {
          password: "12345678",
        },
      });
      User.findOneAndUpdate.mockReturnValue({
        email: "test@test.com",
        password: "hash",
      });

      await patchChangePassword(req, res, next);
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { email: "test@test.com" },
        {
          password: "hash",
        }
      );
    });

    it("should return json body in response", async () => {
      req = httpMocks.createRequest({
        session: {
          loggedIn: true,
          user: {
            email: "test@test.com",
          },
        },
        body: {
          password: "12345678",
        },
      });
      User.findOneAndUpdate.mockReturnValue({
        email: "test@test.com",
        password: "hash",
      });

      await patchChangePassword(req, res, next);
      expect(res._getJSONData()).toStrictEqual(success);
      expect(res._isEndCalled).toBeTruthy();
    });
  });

  describe("실패 시", () => {
    it("로그인 하지 않은 경우, 400을 반환한다", async () => {
      req = httpMocks.createRequest({
        session: {
          loggedIn: false,
          user: {
            email: "test@test.com",
          },
        },
        body: {
          password: "12345678",
        },
      });
      await patchChangePassword(req, res, next);
      expect(next).toBeCalledWith(new Error("권한이 없습니다."));
    });

    it("req.body에 비밀번호를 누락 할 경우, 400을 반환한다", async () => {
      req = httpMocks.createRequest({
        session: {
          loggedIn: true,
          user: {
            email: "test@test.com",
          },
        },
      });

      await patchChangePassword(req, res, next);
      expect(next).toBeCalledWith(new Error("비밀번호를 입력해주세요."));
    });

    it("비밀번호가 8자 이상일 경우, 400을 반환한다", async () => {
      req = httpMocks.createRequest({
        session: {
          loggedIn: true,
          user: {
            email: "test@test.com",
          },
        },
        body: {
          password: "12345",
        },
      });

      await patchChangePassword(req, res, next);
      expect(next).toBeCalledWith(
        new Error("비밀번호를 8자 이상으로 설정해주세요.")
      );
    });
  });
});
