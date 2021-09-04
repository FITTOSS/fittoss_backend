// import "./db";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import responseTime from "response-time";
import { routes } from "./routes";
import { globalRouter } from "./routers/globalRouter";

dotenv.config();

const createServer = () => {
  const app = express();

  const { PORT, DB_HOST, COOKIE_SECRET } = process.env;

  app.set("port", PORT || 4000);
  app.use(responseTime());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(
    session({
      secret: COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: DB_HOST }),
    })
  );

  // router
  app.use(routes.home, globalRouter);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // console.error(err.message);
    res.status(err.status || 5000);
    res.json({ success: false, message: err.message });
  });

  app.use((req, res) => {
    res
      .status(404)
      .json({ success: false, message: "존재하지 않는 API입니다." });
  });

  return app;
};

export default createServer;
