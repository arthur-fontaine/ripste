import { postTransactionsRoute } from "./routes/post-transactions.ts";
import { createHonoRouter } from "../../utils/create-hono-router.ts";
import { submitCardInfosRoute } from "./routes/submitCardInfosRoute.ts";

export const paymentsRouter = createHonoRouter()
	.route("/transactions", postTransactionsRoute)
	.route("/submit-card-infos", submitCardInfosRoute);
