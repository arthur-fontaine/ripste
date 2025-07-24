import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { storeOwnerMiddleware } from "../../../middlewares/storeAccessMiddleware.ts";

export const deleteStoreRoute = createHonoRouter().delete(
	"/:id",
	protectedRouteMiddleware,
	storeOwnerMiddleware,
	async (c) => {
		try {
			const id = c.req.param("id");

			const transactions = await database.transaction.findMany({
				store: { id },
			});

			if (transactions.length > 0) {
				return c.json(
					{ error: "Cannot delete store with existing transactions" },
					400,
				);
			}

			await database.store.delete(id);

			return c.json({ message: "Store deleted successfully" });
		} catch (error) {
			console.error("Error deleting store:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
