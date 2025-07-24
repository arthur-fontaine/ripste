import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { companyAccessMiddleware } from "../../../middlewares/companyAccessMiddleware.ts";

export const getCompanyByIdRoute = createHonoRouter().get(
	"/:id",
	protectedRouteMiddleware,
	companyAccessMiddleware,
	async (c) => {
		try {
			const company = c.get("company");
			return c.json(company);
		} catch (error) {
			console.error("Error fetching company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);
