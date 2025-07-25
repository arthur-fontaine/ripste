import { describe, expect, it } from "vitest";
import { db, em } from "./db.ts";
import {
	generateFakeInsertCompany,
	type IUpdateCompany,
} from "../../../domain/models/ICompany.ts";
import { MikroOrmCompanyModel } from "../models/MikroOrmCompanyModel.ts";
import { generateFakeInsertUser } from "../../../domain/models/IUser.ts";

async function generateValidUser() {
	const [userData] = generateFakeInsertUser();
	if (!userData) throw new Error("Failed to generate user data");

	const { profileId, companyId, ...userDataWithoutCalculated } = userData;

	const userDataWithRequiredFields = {
		...userDataWithoutCalculated,
		profileId: null,
		companyId: null,
	};

	const user = await db.user.insert(userDataWithRequiredFields);

	return user;
}

async function generateCompanyId(
	override: IUpdateCompany & {
		updatedAt?: Date | null;
		deletedAt?: Date | null;
	} = { updatedAt: null, deletedAt: null },
) {
	const user = await generateValidUser();

	const [company] = generateFakeInsertCompany();
	if (!company) throw new Error("Failed to generate company data");

	Object.assign(company, { ...override, userId: user.id });
	const result = await db.company.insert(company);
	return result.id;
}

describe("MikroOrmCompanyRepository", () => {
	describe("insert", () => {
		it("should insert a new company", async () => {
			const user = await generateValidUser();
			const [company] = generateFakeInsertCompany();
			if (!company) throw new Error("Failed to generate company data");
			Object.assign(company, {
				updatedAt: null,
				deletedAt: null,
				userId: user.id,
			});

			const result = await db.company.insert(company);
			expect(result.id).toBeDefined();
			expect(result.legalName).toEqual(company.legalName);
		});
	});

	describe("findOne", () => {
		it("should find a company by ID", async () => {
			const companyId = await generateCompanyId();
			const result = await db.company.findOne(companyId);
			expect(result).toBeDefined();
			expect(result?.id).toEqual(companyId);
		});

		it("should return null for a non-existent company", async () => {
			const result = await db.company.findOne("non-existent-id");
			expect(result).toBeNull();
		});

		it("should return null for a company with a deletedAt timestamp", async () => {
			const companyId = await generateCompanyId({
				deletedAt: null,
			});
			if (!companyId) throw new Error("Failed to generate company ID");
			// @ts-expect-error
			await db.company.update(companyId, { deletedAt: new Date() });
			const result = await db.company.findOne(companyId);
			expect(result).toBeNull();
		});
	});

	describe("findMany", () => {
		it("should find multiple companies", async () => {
			const companyId1 = await generateCompanyId();
			const companyId2 = await generateCompanyId();

			const result = await db.company.findMany({
				id: { $in: [companyId1, companyId2] },
			});
			expect(result).toBeDefined();
			expect(result.length).toBeGreaterThanOrEqual(2);
			expect(result.some((c) => c.id === companyId1)).toBeTruthy();
			expect(result.some((c) => c.id === companyId2)).toBeTruthy();
		});

		it("should return an empty array for no matching companies", async () => {
			const result = await db.company.findMany({
				id: { $in: ["non-existent-id"] },
			});
			expect(result).toBeDefined();
			expect(result.length).toBe(0);
		});

		it("should return an empty array for companies with deletedAt timestamp", async () => {
			const companyId = await generateCompanyId({ deletedAt: null });
			if (!companyId) throw new Error("Failed to generate company ID");
			// @ts-expect-error
			await db.company.update(companyId, { deletedAt: new Date() });
			const result = await db.company.findMany({ id: { $in: [companyId] } });
			expect(result).toBeDefined();
			expect(result.length).toBe(0);
		});

		it("should return all companies when no query is provided", async () => {
			const companyId1 = await generateCompanyId();
			const companyId2 = await generateCompanyId();
			const result = await db.company.findMany();
			expect(result).toBeDefined();
			expect(result.length).toBeGreaterThanOrEqual(2);
			expect(result.some((c) => c.id === companyId1)).toBeTruthy();
			expect(result.some((c) => c.id === companyId2)).toBeTruthy();
		});
	});

	describe("update", () => {
		it("should update an existing company", async () => {
			const companyId = await generateCompanyId();
			const updateData: IUpdateCompany = {
				legalName: "Updated Name",
				// @ts-expect-error
				updatedAt: new Date(),
				deletedAt: null,
			};

			const result = await db.company.update(companyId, updateData);
			expect(result).toBeDefined();
			expect(result?.id).toEqual(companyId);
			expect(result?.legalName).toEqual(updateData.legalName);
		});

		it("should return null for a non-existent company", async () => {
			const result = await db.company.update("non-existent-id", {
				legalName: "New Name",
				// @ts-expect-error
				updatedAt: new Date(),
				deletedAt: null,
			});
			expect(result).toBeNull();
		});
	});

	describe("delete", () => {
		it("should return null for a deleted company", async () => {
			const companyId = await generateCompanyId();
			await db.company.delete(companyId);
			const result = await db.company.findOne(companyId);
			expect(result).toBeNull();
		});

		it("should perform a soft delete", async () => {
			const companyId = await generateCompanyId();
			const company = await db.company.findOne(companyId);
			if (!company) throw new Error("Failed to generate company ID");
			const cloneCompany = { ...company };

			await db.company.delete(companyId);
			const deletedEntity = await em.findOne(MikroOrmCompanyModel, {
				id: companyId,
			});
			expect(deletedEntity).toBeDefined();
			expect(deletedEntity?.deletedAt).toBeDefined();
			expect(deletedEntity?.deletedAt).toBeInstanceOf(Date);
			expect(deletedEntity?.deletedAt).not.toEqual(cloneCompany.deletedAt);
		});
	});
});
