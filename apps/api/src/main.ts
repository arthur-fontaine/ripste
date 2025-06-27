import { serve } from "@hono/node-server";
import { app } from "./app.ts";
import { initTraces } from "./traces.ts";
import { initializeDatabase, closeDatabase } from "./database.ts";

const cleanupTraces = initTraces(process.env["OTLP_URL"]);

// Initialize database connection
try {
	await initializeDatabase();
	console.log("Database connection established successfully");
} catch (error) {
	console.error("Failed to initialize database connection:", error);
	process.exit(1);
}

const server = serve({
	fetch: app.fetch,
	port: Number(process.env["API_PORT"]) || 3000,
});

// graceful shutdown
process.on("SIGINT", async () => {
	await closeDatabase();
	await cleanupTraces();
	server.close();
	process.exit(0);
});
process.on("SIGTERM", async () => {
	await closeDatabase();
	await cleanupTraces();
	server.close((err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		process.exit(0);
	});
});
