import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { companyAccessMiddleware } from "../../../middlewares/companyAccessMiddleware.ts";

export const deleteCompanyRoute = createHonoRouter().delete(
	"/:id",
	protectedRouteMiddleware,
	companyAccessMiddleware,
	async (c) => {
		try {
			const company = c.get("company");

			const deleted = await database.company.delete(company.id);

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
