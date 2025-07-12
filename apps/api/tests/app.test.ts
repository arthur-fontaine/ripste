import { testClient } from "hono/testing";
import { describe, it, expect, vi } from "vitest";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import { SqliteDriver } from "@mikro-orm/sqlite";

vi.mock("../src/database.ts", async () => ({
	database: await MikroOrmDatabase.create(SqliteDriver, ":memory:"),
}));

describe("Ping Endpoint", async () => {
	const { app } = await import("../src/app.ts");
	const client = testClient(app);

	it("should return ping response", async () => {
		const res = await client.ping.$get();

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			message: "pong",
		});
	});
});

describe("Metrics Endpoint", async () => {
	const { app } = await import("../src/app.ts");
	const client = testClient(app);

	it("should return metrics", async () => {
		const res = await client.metrics.$get();

		expect(res.status).toBe(200);
		expect(await res.text()).toContain(
			"# HELP http_request_duration_seconds Duration of HTTP requests in seconds",
		);
	});
});
