import { postTransactionsRoute } from "./routes/post-transactions.ts";
import { createHonoRouter } from "../../utils/create-hono-router.ts";

export const paymentsRouter = createHonoRouter().route(
	"/transactions",
	postTransactionsRoute,
);
