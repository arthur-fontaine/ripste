import { serve } from "@hono/node-server";
import { app } from "./app.ts";
import { otel } from "@hono/otel";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";

const otelSdk = new NodeSDK({
	traceExporter: new ConsoleSpanExporter(),
});

otelSdk.start();

app.use("*", otel());

const server = serve(app);

// graceful shutdown
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
