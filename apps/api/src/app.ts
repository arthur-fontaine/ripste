import { pingRouter } from "./routers/ping/ping-router.ts";
import { prometheus } from "@hono/prometheus";
import { cors } from "hono/cors";
import { otel } from "@hono/otel";
import { authRouter } from "./routers/auth/auth-router.ts";
import { paymentsRouter } from "./routers/payments/payments-router.ts";
import { createHonoRouter } from "./utils/create-hono-router.ts";

const { printMetrics, registerMetrics } = prometheus();

export const app = createHonoRouter()
	.use(
		"*",
		cors({
			origin: (
				process.env["ALLOWED_ORIGINS"] ||
				"http://localhost:5173,http://localhost:3000"
			).split(","),
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use("*", otel())
	.use("*", registerMetrics)
	.route("/ping", pingRouter)
	.route("/auth", authRouter)
	.route("/payments", paymentsRouter)
	.get("/metrics", printMetrics);
