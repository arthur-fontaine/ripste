import { serve } from "@hono/node-server";
import { app } from "./app.ts";
import { otel } from "@hono/otel";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";

const otelSdk = new NodeSDK({
	serviceName: "psp-api",
	traceExporter: new ConsoleSpanExporter(),
});

otelSdk.start();

app.use("*", otel());

const server = serve({
	fetch: app.fetch,
	port: Number(process.env["PSP_API_PORT"]) || 3001,
});

process.on("SIGINT", () => {
	server.close();
	process.exit(0);
});
process.on("SIGTERM", () => {
	server.close((err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		process.exit(0);
	});
});
