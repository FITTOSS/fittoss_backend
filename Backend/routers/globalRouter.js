import express from "express";
import { routes } from "../routes";
import { postRegister } from "../controllers/golobalController";

export const globalRouter = express.Router();

// local register
globalRouter.post(routes.register, postRegister);
