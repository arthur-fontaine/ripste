import { createHonoRouter } from "../../utils/create-hono-router.ts";
import { getTransactionMetricsRoute } from "./routes/get-transactions-metrics.ts";

export const adminRouter = createHonoRouter().route(
	"/metrics",
	getTransactionMetricsRoute,
);
