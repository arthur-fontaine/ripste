import { describe, expect, it, beforeEach } from "vitest";
import type { EntityManager } from "@mikro-orm/core";
import { MikroOrmDatabase } from "../../../../packages/db/src/adapters/mikro-orm/MikroOrmDatabase.ts";
import { customDatabaseAdapter } from "../better-auth-adapter.ts";
import type { IInsertUser } from "../../../../packages/db/src/domain/models/IUser.ts";
import type { IInsertSession } from "../../../../packages/db/src/domain/models/ISession.ts";
import type { IInsertAccount } from "../../../../packages/db/src/domain/models/IAccount.ts";
import type { IInsertVerification } from "../../../../packages/db/src/domain/models/IVerification.ts";

type TestInsertData =
	| IInsertUser
	| IInsertSession
	| IInsertAccount
	| IInsertVerification
	| Record<string, unknown>;

interface MockEntity {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	user?: { id: string };
	userId?: string;
	[key: string]: unknown;
}

// Mock database setup for testing
let db: MikroOrmDatabase;
let adapterFactory: ReturnType<typeof customDatabaseAdapter>;

// Create a mock EntityManager for testing
const mockEm: Partial<EntityManager> = {
	findOne: () => Promise.resolve(null),
	find: () => Promise.resolve([]),
	create: (model: string, data: TestInsertData): MockEntity => {
		const baseEntity: MockEntity = {
			...data,
			id: "test-id",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Handle user relation mapping for session and account models
		if (
			typeof data === "object" &&
			data !== null &&
			"user" in data &&
			data["user"]
		) {
			baseEntity.user = { id: data["user"] as string };
			Object.defineProperty(baseEntity, "userId", {
				get() {
					return this.user?.id;
				},
			});
		}

		return baseEntity;
	},
	persistAndFlush: () => Promise.resolve(),
};

beforeEach(() => {
	db = new MikroOrmDatabase(mockEm as EntityManager);
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

		const sessionData = {
			token: "session-token-123",
			userId: "user-id-123",
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

		const accountData = {
			userId: "user-id-123",
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
