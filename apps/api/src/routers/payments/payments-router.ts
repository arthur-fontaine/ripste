import { Hono } from "hono";
import { postTransactionsRoute } from "./routes/post-transactions.ts";

export const paymentsRouter = new Hono().route(
	"/transactions",
	postTransactionsRoute,
);
