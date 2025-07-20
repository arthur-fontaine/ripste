import { testClient } from "hono/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import { SqliteDriver } from "@mikro-orm/sqlite";
import type { IInsertCompany } from "@ripste/db/mikro-orm";

let database: MikroOrmDatabase;

vi.mock("../src/database.ts", () => ({
	get database() {
		return database;
	},
}));

describe("Company Router", async () => {
	const appModule = await import("../src/app.ts");
	const client = testClient(appModule.app);

	beforeEach(async () => {
		database = await MikroOrmDatabase.create(SqliteDriver, ":memory:");
	});

	describe("POST /companies", () => {
		it("should create a company with required fields", async () => {
			const companyData: Omit<
				IInsertCompany,
				"id" | "createdAt" | "updatedAt" | "deletedAt" | "stores"
			> = {
				legalName: "Acme Corp",
				kbis: "12345678901234",
				tradeName: null,
				vatNumber: null,
				address: null,
			};

			const res = await client.companies.$post({
				json: companyData,
			});

			expect(res.status).toBe(201);
			const company = await res.json();
			expect(company).toMatchObject({
				legalName: "Acme Corp",
				kbis: "12345678901234",
				tradeName: null,
				vatNumber: null,
				address: null,
			});
			expect(company.id).toBeDefined();
			expect(company.createdAt).toBeDefined();
		});

		it("should create a company with all fields", async () => {
			const companyData: Omit<
				IInsertCompany,
				"id" | "createdAt" | "updatedAt" | "deletedAt" | "stores"
			> = {
				legalName: "Tech Solutions SAS",
				tradeName: "TechSol",
				kbis: "98765432109876",
				vatNumber: "FR12345678901",
				address: "123 Rue de la Tech, 75001 Paris",
			};

			const res = await client.companies.$post({
				json: companyData,
			});

			expect(res.status).toBe(201);
			const company = await res.json();
			expect(company).toMatchObject({
				legalName: "Tech Solutions SAS",
				tradeName: "TechSol",
				kbis: "98765432109876",
				vatNumber: "FR12345678901",
				address: "123 Rue de la Tech, 75001 Paris",
			});
		});

		it("should return 400 when legalName is missing", async () => {
			const companyData = {
				kbis: "12345678901234",
			};

			const res = await client.companies.$post({
				json: companyData,
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error");
		});

		it("should return 400 when kbis is missing", async () => {
			const companyData = {
				legalName: "Acme Corp",
			};

			const res = await client.companies.$post({
				json: companyData,
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error");
		});

		it("should return 400 when kbis is not unique", async () => {
			const companyData: Omit<
				IInsertCompany,
				"id" | "createdAt" | "updatedAt" | "deletedAt" | "stores"
			> = {
				legalName: "First Company",
				kbis: "12345678901234",
				tradeName: null,
				vatNumber: null,
				address: null,
			};

			await client.companies.$post({
				json: companyData,
			});

			const duplicateCompanyData = {
				...companyData,
				legalName: "Second Company",
			};

			const res = await client.companies.$post({
				json: duplicateCompanyData,
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error");
		});

		it("should validate KBIS format", async () => {
			const companyData = {
				legalName: "Acme Corp",
				kbis: "123",
			};

			const res = await client.companies.$post({
				json: companyData,
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error");
		});
	});

	describe("GET /companies", () => {
		it("should return empty array when no companies exist", async () => {
			const res = await client.companies.$get();

			expect(res.status).toBe(200);
			const companies = await res.json();
			expect(companies).toEqual([]);
		});

		it("should return all companies", async () => {
			const company1Data = {
				legalName: "Company One",
				kbis: "12345678901234",
			};

			const company2Data = {
				legalName: "Company Two",
				kbis: "98765432109876",
			};

			await client.companies.$post({ json: company1Data });
			await client.companies.$post({ json: company2Data });

			const res = await client.companies.$get();

			expect(res.status).toBe(200);
			const companies = await res.json();
			expect(companies).toHaveLength(2);
			expect(companies[0]).toMatchObject(company1Data);
			expect(companies[1]).toMatchObject(company2Data);
		});
	});

	describe("GET /companies/:id", () => {
		it("should return a company by id", async () => {
			const companyData = {
				legalName: "Test Company",
				kbis: "12345678901234",
			};

			const createRes = await client.companies.$post({ json: companyData });
			const createdCompany = await createRes.json();

			const res = await client.companies[":id"].$get({
				param: { id: createdCompany.id },
			});

			expect(res.status).toBe(200);
			const company = await res.json();
			expect(company).toMatchObject(companyData);
			expect(company.id).toBe(createdCompany.id);
		});

		it("should return 404 for non-existent company", async () => {
			const res = await client.companies[":id"].$get({
				param: { id: "00000000-0000-0000-0000-000000000000" },
			});

			expect(res.status).toBe(404);
			const error = await res.json();
			expect(error).toHaveProperty("error", "Company not found");
		});
	});

	describe("PUT /companies/:id", () => {
		it("should update a company with valid data", async () => {
			const initialData = {
				legalName: "Initial Company",
				kbis: "12345678901234",
				tradeName: null,
			};

			const createRes = await client.companies.$post({ json: initialData });
			const createdCompany = await createRes.json();

			const updateData = {
				legalName: "Updated Company Name",
				tradeName: "Updated Trade Name",
				vatNumber: "FR12345678901",
				address: "123 Updated Street, Paris",
			};

			const res = await client.companies[":id"].$put({
				param: { id: createdCompany.id },
				json: updateData,
			});

			expect(res.status).toBe(200);
			const updatedCompany = await res.json();
			expect(updatedCompany).toMatchObject({
				...updateData,
				kbis: "12345678901234",
			});
			expect(updatedCompany.id).toBe(createdCompany.id);
		});

		it("should not allow updating KBIS", async () => {
			const createRes = await client.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "12345678901234",
				},
			});
			const createdCompany = await createRes.json();

			const res = await client.companies[":id"].$put({
				param: { id: createdCompany.id },
				json: {
					legalName: "Updated Company",
					kbis: "98765432109876",
				},
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error");
		});

		it("should return 404 when updating non-existent company", async () => {
			const res = await client.companies[":id"].$put({
				param: { id: "00000000-0000-0000-0000-000000000000" },
				json: {
					legalName: "Updated Company",
				},
			});

			expect(res.status).toBe(404);
			const error = await res.json();
			expect(error).toHaveProperty("error", "Company not found");
		});

		it("should validate required fields on update", async () => {
			const createRes = await client.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "12345678901234",
				},
			});
			const createdCompany = await createRes.json();

			const res = await client.companies[":id"].$put({
				param: { id: createdCompany.id },
				json: {
					legalName: "",
				},
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error");
		});

		it("should allow partial updates", async () => {
			const initialData = {
				legalName: "Test Company",
				kbis: "12345678901234",
				tradeName: "Original Trade Name",
				vatNumber: "FR11111111111",
			};

			const createRes = await client.companies.$post({ json: initialData });
			const createdCompany = await createRes.json();

			const res = await client.companies[":id"].$put({
				param: { id: createdCompany.id },
				json: {
					legalName: "Updated Legal Name",
				},
			});

			expect(res.status).toBe(200);
			const updatedCompany = await res.json();
			expect(updatedCompany.legalName).toBe("Updated Legal Name");
			expect(updatedCompany.tradeName).toBe("Original Trade Name");
			expect(updatedCompany.vatNumber).toBe("FR11111111111");
		});
	});

	describe("DELETE /companies/:id", () => {
		it("should soft delete a company", async () => {
			const createRes = await client.companies.$post({
				json: {
					legalName: "Company to Delete",
					kbis: "12345678901234",
				},
			});
			const createdCompany = await createRes.json();

			const deleteRes = await client.companies[":id"].$delete({
				param: { id: createdCompany.id },
			});

			expect(deleteRes.status).toBe(204);

			const getRes = await client.companies[":id"].$get({
				param: { id: createdCompany.id },
			});

			expect(getRes.status).toBe(404);
		});

		it("should return 404 when deleting non-existent company", async () => {
			const res = await client.companies[":id"].$delete({
				param: { id: "00000000-0000-0000-0000-000000000000" },
			});

			expect(res.status).toBe(404);
			const error = await res.json();
			expect(error).toHaveProperty("error", "Company not found");
		});

		it("should remove deleted company from listings", async () => {
			const createRes1 = await client.companies.$post({
				json: {
					legalName: "Company 1",
					kbis: "12345678901234",
				},
			});
			const company1 = await createRes1.json();

			await client.companies.$post({
				json: {
					legalName: "Company 2",
					kbis: "98765432109876",
				},
			});

			let listRes = await client.companies.$get();
			let companies = await listRes.json();
			expect(companies).toHaveLength(2);

			await client.companies[":id"].$delete({
				param: { id: company1.id },
			});

			listRes = await client.companies.$get();
			companies = await listRes.json();
			expect(companies).toHaveLength(1);
			expect(companies[0].legalName).toBe("Company 2");
		});

		it("should allow creating new company with same KBIS after deletion", async () => {
			const companyData = {
				legalName: "Original Company",
				kbis: "12345678901234",
			};

			const createRes = await client.companies.$post({ json: companyData });
			const company = await createRes.json();

			await client.companies[":id"].$delete({
				param: { id: company.id },
			});

			const newCompanyData = {
				legalName: "New Company",
				kbis: "12345678901234",
			};

			const createNewRes = await client.companies.$post({
				json: newCompanyData,
			});
			expect(createNewRes.status).toBe(201);
			const newCompany = await createNewRes.json();
			expect(newCompany.legalName).toBe("New Company");
		});
	});
});
