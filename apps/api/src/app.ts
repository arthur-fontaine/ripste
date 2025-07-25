import { pingRouter } from "./routers/ping/ping-router.ts";
import { prometheus } from "@hono/prometheus";
import { cors } from "hono/cors";
import { otel } from "@hono/otel";
import { authRouter } from "./routers/auth/auth-router.ts";
import { companiesRouter } from "./routers/companies/companies-router.ts";
import { storesRouter } from "./routers/stores/stores-router.ts";
import { paymentsRouter } from "./routers/payments/payments-router.ts";
import { createHonoRouter } from "./utils/create-hono-router.ts";
import { adminRouter } from "./routers/admin/admin-router.ts";

const { printMetrics, registerMetrics } = prometheus();

export const app = createHonoRouter()
	.use(
		"*",
		cors({
			origin: (
				process.env["ALLOWED_ORIGINS"] ||
				"http://localhost:5173,http://localhost:3000,http://localhost:3003,https://ripste.com,https://admin.ripste.com,https://checkout.ripste.com"
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
	.route("/companies", companiesRouter)
	.route("/stores", storesRouter)
	.route("/payments", paymentsRouter)
	.route("/admin", adminRouter)
	.get("/metrics", printMetrics);

export type App = typeof app;
