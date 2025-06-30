import { Hono } from "hono";
import { pingRouter } from "./routers/ping/ping-router.ts";
import { prometheus } from "@hono/prometheus";
import { otel } from "@hono/otel";
import { paymentsRouter } from "./routers/payments/payments-router.ts";

const { printMetrics, registerMetrics } = prometheus();

export const app = new Hono()
	.use("*", otel())
	.use("*", registerMetrics)
	.route("/ping", pingRouter)
	.route("/payments", paymentsRouter)
	.get("/metrics", printMetrics);
