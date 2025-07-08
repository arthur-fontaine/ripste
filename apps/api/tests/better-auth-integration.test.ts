import { describe, afterAll } from "vitest";
import { runAdapterTest } from "better-auth/adapters/test";
import { createCustomDatabaseAdapterWithMappings } from "../src/better-auth-adapter.ts";
import { initializeTestDatabase, closeTestDatabase } from "./database-utils.ts";
import type { IDatabase } from "@ripste/db/mikro-orm";

let db: IDatabase;

describe("Better Auth Custom Database Adapter", async () => {
	afterAll(async () => {
		await closeTestDatabase();
	});

	db = await initializeTestDatabase();

	await runAdapterTest({
		getAdapter: async (betterAuthOptions = {}) => {
			const adapterFactory = createCustomDatabaseAdapterWithMappings(db, betterAuthOptions, {
				debugLogs: {
					isRunningAdapterTests: true,
				},
			});
			return adapterFactory.createAdapter()(betterAuthOptions);
		},
	});
});
