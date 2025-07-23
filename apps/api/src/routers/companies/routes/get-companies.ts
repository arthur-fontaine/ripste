import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";

export const getCompaniesRoute = createHonoRouter().get(
	"/",
	protectedRouteMiddleware,
	async (c) => {
		try {
			const companies = await database.company.findMany();
			return c.json(companies);
		} catch (error) {
			console.error("Error fetching companies:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
