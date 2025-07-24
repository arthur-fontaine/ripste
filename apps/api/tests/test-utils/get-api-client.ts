import { SqliteDriver } from "@mikro-orm/sqlite";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import { testClient } from "hono/testing";
import { vi } from "vitest";

vi.mock("../../src/database.ts", async () => ({
	database: await MikroOrmDatabase.create(SqliteDriver, ":memory:"),
}));

export async function getApiClient({ cookie }: { cookie?: string } = {}) {
	const { app } = await import("../../src/app.ts");
	const { database } = await import("../../src/database.ts");

	const headers: Record<string, string> = {};
	if (cookie) {
		headers["cookie"] = cookie;
	}

	return {
		apiClient: testClient(app, {
			test: { headers },
		}),
		app,
		database,
	};
}
