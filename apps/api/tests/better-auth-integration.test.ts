import { describe, afterAll } from "vitest";
import { runAdapterTest } from "better-auth/adapters/test";
import { customDatabaseAdapter } from "../src/better-auth-adapter.ts";
import { initializeTestDatabase, closeTestDatabase } from "./database-utils.ts";
import type { IDatabase } from "@ripste/db/mikro-orm";

let db: IDatabase;

describe("Better Auth Custom Database Adapter", async () => {
	afterAll(async () => {
		await closeTestDatabase();
	});

	// Initialize the database before running tests
	db = await initializeTestDatabase();

	const adapterFactory = customDatabaseAdapter(db, {
		debugLogs: {
			isRunningAdapterTests: true, // Super secret flag for better-auth test suite
		},
	});

	await runAdapterTest({
		getAdapter: async (betterAuthOptions = {}) => {
			return adapterFactory.createAdapter()(betterAuthOptions);
		},
	});
});
