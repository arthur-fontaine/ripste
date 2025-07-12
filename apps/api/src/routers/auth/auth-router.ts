import { Hono } from "hono";
import { auth } from "../../auth.ts";

export const authRouter = new Hono().on(["POST", "GET"], "/*", async (c) => {
	return auth.handler(c.req.raw);
});
