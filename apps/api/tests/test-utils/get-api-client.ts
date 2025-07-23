import { SqliteDriver } from "@mikro-orm/sqlite";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import { testClient } from "hono/testing";
import { vi } from "vitest";

vi.mock("../../src/database.ts", async () => {
	let database: MikroOrmDatabase = await MikroOrmDatabase.create(
		SqliteDriver,
		":memory:",
	);

	return {
		get database() {
			return database;
		},
		getDatabase() {
			return database;
		},
		setDatabase(value: MikroOrmDatabase) {
			database = value;
		},
	};
});

export async function getApiClient({ cookie }: { cookie?: string } = {}) {
	const { app } = await import("../../src/app.ts");
	const { database, getDatabase, setDatabase } = (await import(
		"../../src/database.ts"
	)) as {
		database: MikroOrmDatabase;
		getDatabase: () => MikroOrmDatabase;
		setDatabase: (value: MikroOrmDatabase) => void;
	};

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
		getDatabase,
		setDatabase,
	};
}
