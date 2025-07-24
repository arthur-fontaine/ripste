import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app.ts";

const PORT = Number(process.env["PORT"]) || 4000;

console.log(`🚀 Serveur backend e-commerce démarré sur le port ${PORT}`);
console.log("📱 Frontend URL: http://localhost:5173");
console.log(`🔗 API URL: http://localhost:${PORT}`);

const server = serve({
	fetch: app.fetch,
	port: PORT,
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
