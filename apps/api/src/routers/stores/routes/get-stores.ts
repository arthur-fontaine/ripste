import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";

export const getStoresRoute = createHonoRouter().get(
	"/",
	protectedRouteMiddleware,
	async (c) => {
		try {
			const storeMembers = await database.storeMember.findMany({
				user: { id: c.get("user").id },
			});

			const stores = storeMembers.map((member) => member.store).filter(Boolean);

			return c.json(stores);
		} catch (error) {
			console.error("Error fetching stores:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
