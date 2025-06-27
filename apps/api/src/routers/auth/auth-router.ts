import { Hono } from "hono";
import { auth } from "../../auth.ts";

export const authRouter = new Hono()
	.use("*", async (c, next) => {
		const response = await auth.handler(c.req.raw);
		if (response) {
			return response;
		}
		return next();
	})
	.get("/", (c) => {
		return c.json({ message: "Hello from authRouter!" });
	});
