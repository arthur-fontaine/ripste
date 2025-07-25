import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { storeRouteMiddleware } from "../../../middlewares/storeRouteMiddleware.ts";

export const getThemesRoute = createHonoRouter().get(
	"/",
	protectedRouteMiddleware,
	storeRouteMiddleware,
	async (c) => {
		return c.json(c.get("store").checkoutThemes);
	},
);
