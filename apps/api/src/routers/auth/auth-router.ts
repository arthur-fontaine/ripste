import { Hono } from "hono";
import { getAuth } from "../../auth.ts";

export const authRouter = new Hono()
	.use("*", async (c, next) => {
		const response = (await getAuth()).handler(c.req.raw);
		if (response) {
			return response;
		}
		return next();
	})
	.get("/", (c) => {
		return c.json({ message: "Hello from authRouter!" });
	});
