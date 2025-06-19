import { describe, expect, it } from "vitest";
import { db, em } from "./db.ts";
import {
	generateFakeApiCredentialInsert,
	type IApiCredentialUpdate,
} from "../../../domain/models/ApiCredential.ts";
import { MikroOrmApiCredentialModel } from "../models/MikroOrmApiCredential.ts";

async function generateApiCredentialId(
	override: IApiCredentialUpdate = {
		updatedAt: null,
		deletedAt: null,
	},
) {
	const apiCredential = generateFakeApiCredentialInsert();
	Object.assign(apiCredential, override);
	const result = await db.apiCredential.insert(apiCredential);
	return result.id;
}

describe("MikroOrmApiCredentialRepository", () => {
	describe("insert", () => {
		it("should insert a new API credential", async () => {
			const apiCredential = generateFakeApiCredentialInsert();
			apiCredential.updatedAt = null;
			apiCredential.deletedAt = null;

			const result = await db.apiCredential.insert(apiCredential);
			expect(result.id).toBeDefined();
			expect(result.name).toEqual(apiCredential.name);
		});
	});

	describe("findOne", () => {
		it("should find an API credential by ID", async () => {
			const apiCredentialId = await generateApiCredentialId();
			const result = await db.apiCredential.findOne(apiCredentialId);
			expect(result).toBeDefined();
			expect(result?.id).toEqual(apiCredentialId);
		});

		it("should return null for a non-existent API credential", async () => {
			const result = await db.apiCredential.findOne("non-existent-id");
			expect(result).toBeNull();
		});

		it("should return null for an API credential with a deletedAt timestamp", async () => {
			const apiCredentialId = await generateApiCredentialId({
				deletedAt: new Date(),
			});
			if (!apiCredentialId)
				throw new Error("Failed to generate API credential ID");
			const result = await db.apiCredential.findOne(apiCredentialId);
			expect(result).toBeNull();
		});
	});

	describe("update", () => {
		it("should update an existing API credential", async () => {
			const apiCredentialId = await generateApiCredentialId();
			const updateData: IApiCredentialUpdate = {
				name: "Updated Name",
				updatedAt: new Date(),
				deletedAt: null,
			};

			const result = await db.apiCredential.update(apiCredentialId, updateData);
			expect(result).toBeDefined();
			expect(result?.id).toEqual(apiCredentialId);
			expect(result?.name).toEqual(updateData.name);
		});

		it("should return null for a non-existent API credential", async () => {
			const result = await db.apiCredential.update("non-existent-id", {
				name: "New Name",
				updatedAt: new Date(),
				deletedAt: null,
			});
			expect(result).toBeNull();
		});
	});

	describe("delete", () => {
		it("should return null for a deleted API credential", async () => {
			const apiCredentialId = await generateApiCredentialId();
			await db.apiCredential.delete(apiCredentialId);
			const result = await db.apiCredential.findOne(apiCredentialId);
			expect(result).toBeNull();
		});

		it("should perform a soft delete", async () => {
			const apiCredentialId = await generateApiCredentialId();
			const apiCredential = await db.apiCredential.findOne(apiCredentialId);
			if (!apiCredential)
				throw new Error("Failed to generate API credential ID");
			const cloneApiCredential = { ...apiCredential };

			await db.apiCredential.delete(apiCredentialId);
			const deletedEntity = await em.findOne(MikroOrmApiCredentialModel, {
				id: apiCredentialId,
			});
			expect(deletedEntity).toBeDefined();
			expect(deletedEntity?.deletedAt).toBeDefined();
			expect(deletedEntity?.deletedAt).toBeInstanceOf(Date);
			expect(deletedEntity?.deletedAt).not.toEqual(
				cloneApiCredential.deletedAt,
			);
		});
	});
});
