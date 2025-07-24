import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { storeAccessMiddleware } from "../../../middlewares/storeAccessMiddleware.ts";

export const getStoreByIdRoute = createHonoRouter().get(
	"/:id",
	protectedRouteMiddleware,
	storeAccessMiddleware,
	async (c) => {
		try {
			const store = c.get("store");
			return c.json(store);
		} catch (error) {
			console.error("Error fetching store:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
