import { Hono } from "hono";
import { pingRouter } from "./routers/ping/ping-router.ts";
import { prometheus } from "@hono/prometheus";

const { printMetrics, registerMetrics } = prometheus();

export const app = new Hono()
	.use("*", registerMetrics)
	.route("/ping", pingRouter)
	.get("/metrics", printMetrics);
