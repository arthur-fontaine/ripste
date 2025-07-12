import { Hono } from "hono";
import { pingRouter } from "./routers/ping/ping-router.ts";
import { prometheus } from "@hono/prometheus";
import { otel } from "@hono/otel";
import { authRouter } from "./routers/auth/auth-router.ts";

const { printMetrics, registerMetrics } = prometheus();

export const app = new Hono()
	.use("*", otel())
	.use("*", registerMetrics)
	.route("/ping", pingRouter)
	.route("/auth", authRouter)
	.get("/metrics", printMetrics);
