import { createHonoRouter } from "../../utils/create-hono-router.ts";

export const pingRouter = createHonoRouter().get("/", (c) => {
	return c.json({ message: "pong" });
});
