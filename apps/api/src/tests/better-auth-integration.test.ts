import { describe, expect, it, beforeEach, beforeAll, afterAll } from "vitest";
import { customDatabaseAdapter } from "../better-auth-adapter.ts";
import {
	initializeDevelopmentDatabase,
	closeDevelopmentDatabase,
} from "../database-dev.ts";
import type { IDatabase, IUser } from "@ripste/db/mikro-orm";

let db: IDatabase;
let adapterFactory: ReturnType<typeof customDatabaseAdapter>;

beforeAll(async () => {
	db = await initializeDevelopmentDatabase();
});

afterAll(async () => {
	await closeDevelopmentDatabase();
});

beforeEach(() => {
	adapterFactory = customDatabaseAdapter(db);
});

describe("Better Auth Custom Database Adapter", () => {
	it("should be created with proper configuration", () => {
		expect(adapterFactory).toBeDefined();
		expect(adapterFactory.config).toBeDefined();
		expect(adapterFactory.config.adapterId).toBe("custom-database");
		expect(adapterFactory.config.adapterName).toBe("Custom Database Adapter");
	});

	it("should create adapter instance with required methods", () => {
		const adapterInstance = adapterFactory.adapter({ debugLog: () => {} });

		expect(adapterInstance.create).toBeDefined();
		expect(adapterInstance.update).toBeDefined();
		expect(adapterInstance.findOne).toBeDefined();
		expect(adapterInstance.findMany).toBeDefined();
		expect(adapterInstance.delete).toBeDefined();
		expect(adapterInstance.count).toBeDefined();
	});

	it("should handle user model creation", async () => {
		const adapterInstance = adapterFactory.adapter({ debugLog: () => {} });

		const userData = {
			email: "test@example.com",
			password: "hashedpassword",
			emailVerified: false,
		};

		const result = await adapterInstance.create({
			model: "user",
			data: userData,
		});

		expect(result).toBeDefined();
		expect(result["email"]).toBe(userData.email);
	});

	it("should handle session model creation", async () => {
		const adapterInstance = adapterFactory.adapter({ debugLog: () => {} });

		const userData = {
			email: "user@example.com",
			password: "hashedpassword",
			emailVerified: false,
		};

		const user = (await adapterInstance.create({
			model: "user",
			data: userData,
		})) as unknown as IUser;

		const sessionData = {
			token: "session-token-123",
			userId: user.id,
			expiresAt: new Date(Date.now() + 3600000),
		};

		const result = await adapterInstance.create({
			model: "session",
			data: sessionData,
		});

		expect(result).toBeDefined();
		expect(result["token"]).toBe(sessionData.token);
		expect(result["userId"]).toBe(sessionData.userId);
	});

	it("should handle account model creation", async () => {
		const adapterInstance = adapterFactory.adapter({ debugLog: () => {} });

		const userData = {
			email: "account-user@example.com",
			password: "hashedpassword",
			emailVerified: false,
		};

		const user = (await adapterInstance.create({
			model: "user",
			data: userData,
		})) as unknown as IUser;

		const accountData = {
			userId: user.id,
			accountId: "google-123456789",
			providerId: "google",
			accessToken: "access-token-123",
		};

		const result = await adapterInstance.create({
			model: "account",
			data: accountData,
		});

		expect(result).toBeDefined();
		expect(result["userId"]).toBe(accountData.userId);
		expect(result["providerId"]).toBe(accountData.providerId);
	});

	it("should handle verification model creation", async () => {
		const adapterInstance = adapterFactory.adapter({ debugLog: () => {} });

		const verificationData = {
			identifier: "test@example.com",
			value: "123456",
			expiresAt: new Date(Date.now() + 3600000),
			type: "email" as const,
		};

		const result = await adapterInstance.create({
			model: "verification",
			data: verificationData,
		});

		expect(result).toBeDefined();
		expect(result["identifier"]).toBe(verificationData.identifier);
		expect(result["type"]).toBe(verificationData.type);
	});
});
