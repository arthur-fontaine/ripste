import { Hono } from "hono";
import { apply } from "vike-server/hono";
import { serve } from "vike-server/hono/serve";

function startServer() {
	const app = new Hono();
	apply(app);
	return serve(app, {
		port: 3003,
		hostname: "0.0.0.0",
	});
}

export default startServer();
