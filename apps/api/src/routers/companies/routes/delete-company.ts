import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";

export const deleteCompanyRoute = createHonoRouter().delete(
	"/:id",
	protectedRouteMiddleware,
	async (c) => {
		try {
			const id = c.req.param("id");

			const existingCompany = await database.company.findOne(id);
			if (!existingCompany) {
				return c.json({ error: "Company not found" }, 404);
			}

			const deleted = await database.company.delete(id);

			if (!deleted) {
				return c.json({ error: "Company not found" }, 404);
			}

			return c.body(null, 204);
		} catch (error) {
			console.error("Error deleting company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
