import { Hono } from "hono";
import type { AuthContext } from "../auth.ts";

export const createHonoRouter = () => new Hono<AuthContext>()
