import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";

export const getCompanyByIdRoute = createHonoRouter().get(
	"/:id",
	protectedRouteMiddleware,
	async (c) => {
		try {
			const id = c.req.param("id");
			const company = await database.company.findOne(id);

			if (!company) {
				return c.json({ error: "Company not found" }, 404);
			}

			return c.json(company);
		} catch (error) {
			console.error("Error fetching company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
