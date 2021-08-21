import "./db";

import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { routes } from "./routes";
import { globalRouter } from "./routers/globalRouter";

dotenv.config();
const app = express();

const { PORT } = process.env;

app.use(morgan("dev"));
app.use(express.json());

app.use(routes.home, globalRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

if (!PORT) console.error("PORT is required");

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
