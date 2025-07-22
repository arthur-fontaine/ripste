import { Hono } from "hono";
import { authMiddleware, type AuthContext } from "../middlewares/authMiddleware.ts";

export const createHonoRouter = () => new Hono<AuthContext>()
  .use("*", authMiddleware);
