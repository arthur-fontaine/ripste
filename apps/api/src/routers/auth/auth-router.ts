import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "../../auth.ts";

export const authRouter = new Hono()
	.use(
		"*",
		cors({
			origin: (
				process.env["ALLOWED_ORIGINS"] ||
				"http://localhost:5173,http://localhost:3000"
			).split(","),
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.on(["POST", "GET"], "/*", async (c) => {
		return auth.handler(c.req.raw);
	});
