import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { storeAccessMiddleware } from "../../../middlewares/storeAccessMiddleware.ts";

export const getThemesRoute = createHonoRouter().get(
	"/",
	protectedRouteMiddleware,
	storeAccessMiddleware,
	async (c) => {
		return c.json(c.get("store").checkoutThemes);
	},
);
