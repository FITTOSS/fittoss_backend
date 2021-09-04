import mongoose from "mongoose";
import request from "supertest";
import createApp from "../../app";
import { User } from "../../models/User";

beforeAll((done) => {
  mongoose.connect(process.env.DB_HOST_TEST, { useNewUrlParser: true }, () =>
    done()
  );
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

const app = createApp();

const userData = {
  email: "magicnc7@naverr.com",
  password: "12345678",
};
let userId;

describe("POST /api/register", () => {
  describe("성공 시", () => {
    it("response with json", async () => {
      const res = await request(app).post("/api/register").send(userData);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe(userData.email);

      userId = res.body.data._id;
    });
  });

  describe("실패 시", () => {
    it("가입된 계정일 경우 400을 반환한다.", async () => {
      // await User.create({
      //   email: "magicnc7@naver.com",
      //   password: "asdasdasdzxc",
      // });

      const res = await request(app).post("/api/register").send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toStrictEqual({
        success: false,
        message: "가입된 이메일 입니다.",
      });
    });
  });
});

describe("PATCH /api/login", () => {
  it("가입되지 않은 회원", async () => {
    const res = await request(app)
      .patch("/api/login")
      .send({ email: "asd@asd", password: "12345678" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      success: false,
      message: "가입되지 않은 이메일입니다.",
    });
  });

  it("비밀번호 틀림", async () => {
    const res = await request(app)
      .patch("/api/login")
      .send({ email: "magicnc7@naverr.com", password: "123456789987" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      success: false,
      message: "비밀번호를 확인해주세요.",
    });
  });

  it("로그인 수행", async () => {
    await User.findByIdAndUpdate(userId, { emailVerified: true });
    const res = await request(app).patch("/api/login").send(userData);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("PATCH /api/logout", () => {
  it("로그인 안 한 유저라면 400", async () => {
    const res = await request(app).get("/api/logout");

    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      success: false,
      message: "권한이 없습니다.",
    });
  });

  const agent = request.agent(app);
  beforeEach(async () => {
    await agent.patch("/api/login").send(userData);
  });

  it("로그아웃 수행", async () => {
    const res = await agent.get("/api/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ success: true });
  });
});

describe("PATCH /api/password/reset", () => {
  it("가입되지 않은 이메일", async () => {
    const res = await request(app)
      .patch("/api/password/reset")
      .send({ email: "asd@asd" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      success: false,
      message: "가입되지 않은 이메일입니다.",
    });
  });

  it("비밀번호 초기화 수행", async () => {
    const res = await request(app)
      .patch("/api/password/reset")
      .send({ email: "magicnc7@naverr.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ success: true });
  });
});
