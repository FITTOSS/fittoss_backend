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
import userJson from "../data/user.json";

// mock 함수

let req;
let res;
let next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe("GET /api/user/set", () => {
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

    // _getJSONData(node-mocks-http 제공)
    expect(setUser._getJSONData()).toStrictEqual(userJson);
  });
});
