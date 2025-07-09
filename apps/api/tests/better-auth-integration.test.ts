import { describe } from "vitest";
import { runAdapterTest } from "better-auth/adapters/test";
import { createCustomDatabaseAdapterWithMappings } from "../src/better-auth-adapter.ts";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import { SqliteDriver } from "@mikro-orm/sqlite";

describe("Better Auth Custom Database Adapter", async () => {
	const db = await MikroOrmDatabase.create(SqliteDriver, ":memory:")

	await runAdapterTest({
		getAdapter: async (betterAuthOptions = {}) => {
			const adapterFactory = createCustomDatabaseAdapterWithMappings(
				db,
				betterAuthOptions,
				{
					debugLogs: {
						isRunningAdapterTests: true,
					},
				},
			);
			return adapterFactory.createAdapter()(betterAuthOptions);
		},
	});
});
