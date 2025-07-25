import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app.ts";

const EXAMPLE_BACKEND_PORT =
	Number(process.env["EXAMPLE_BACKEND_PORT"]) || 4000;

console.log(
	`🚀 Serveur backend e-commerce démarré sur le port ${EXAMPLE_BACKEND_PORT}`,
);
console.log("📱 Frontend URL: http://localhost:5173");
console.log(`🔗 API URL: http://localhost:${EXAMPLE_BACKEND_PORT}`);

if (!process.env["CHECKOUT_URL"]) {
	throw new Error("CHECKOUT_URL environment variable is not set");
}

if (!process.env["RIPSTE_API_URL"]) {
	throw new Error("RIPSTE_API_URL environment variable is not set");
}

if (!process.env["RIPSTE_API_EMAIL"] || !process.env["RIPSTE_API_PASSWORD"]) {
	throw new Error(
		"RIPSTE_API_EMAIL and RIPSTE_API_PASSWORD environment variables must be set",
	);
}

const server = serve({
	fetch: app.fetch,
	port: EXAMPLE_BACKEND_PORT,
});

process.on("SIGINT", () => {
	console.log("🛑 Arrêt du serveur...");
	server.close();
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.log("🛑 Arrêt du serveur...");
	server.close((err) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		process.exit(0);
	});
});
