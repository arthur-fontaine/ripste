import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app.ts";
import { initTraces } from "./traces.ts";

const cleanupTraces = initTraces(process.env["OTLP_URL"]);

const server = serve({
	fetch: app.fetch,
	port: Number(process.env["API_PORT"]) || 3000,
});

// graceful shutdown
process.on("SIGINT", async () => {
	await cleanupTraces();
	server.close();
	process.exit(0);
});
process.on("SIGTERM", async () => {
	await cleanupTraces();
	server.close((err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		process.exit(0);
	});
});
