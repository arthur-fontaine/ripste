import { createHonoRouter } from "../../utils/create-hono-router.ts";
import { postCompaniesRoute } from "./routes/post-companies.ts";
import { getCompaniesRoute } from "./routes/get-companies.ts";
import { getCompanyByIdRoute } from "./routes/get-company-by-id.ts";
import { putCompanyRoute } from "./routes/put-company.ts";
import { deleteCompanyRoute } from "./routes/delete-company.ts";

export const companiesRouter = createHonoRouter()
	.route("/", postCompaniesRoute)
	.route("/", getCompaniesRoute)
	.route("/", getCompanyByIdRoute)
	.route("/", putCompanyRoute)
	.route("/", deleteCompanyRoute);
