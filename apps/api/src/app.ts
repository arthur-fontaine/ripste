import { Hono } from "hono";
import { pingRouter } from "./routers/ping/ping-router.ts";
import { prometheus } from "@hono/prometheus";
import { otel } from "@hono/otel";
import { authRouter } from "./routers/auth/auth-router.ts";
import { paymentsRouter } from "./routers/payments/payments-router.ts";
import { authMiddleware } from "./auth.ts";
import { createHonoRouter } from "./utils/create-hono-router.ts";

const { printMetrics, registerMetrics } = prometheus();

export const app = createHonoRouter()
	.use("*", authMiddleware)
	.use("*", otel())
	.use("*", registerMetrics)
	.route("/ping", pingRouter)
	.route("/auth", authRouter)
	.route("/payments", paymentsRouter)
	.get("/metrics", printMetrics);
