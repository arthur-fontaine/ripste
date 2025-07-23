import { auth } from "../../auth.ts";
import { createHonoRouter } from "../../utils/create-hono-router.ts";

export const authRouter = createHonoRouter().on(
	["POST", "GET"],
	"/*",
	async (c) => {
		return auth.handler(c.req.raw);
	},
);
