import { describe, it, expect, beforeEach } from "vitest";
import { MikroOrmDatabase, type ICompany } from "@ripste/db/mikro-orm";
import { getRealConditionApiClient } from "../../test-utils/getRealConditionApiClient.ts";
import { readBody } from "../../test-utils/readBody.ts";
import { SqliteDriver } from "@mikro-orm/sqlite";

describe("Company Router", async () => {
	const { apiClient, setDatabase, getDatabase } =
		await getRealConditionApiClient();

	beforeEach(async () => {
		setDatabase(await MikroOrmDatabase.create(SqliteDriver, ":memory:"));
	});

	describe("POST /companies", () => {
		it("should create a company with required fields", async () => {
			const res = await apiClient.companies.$post({
				json: {
					legalName: "Acme Corp",
					kbis: "12345678901234",
					tradeName: null,
					vatNumber: null,
					address: null,
				},
			});
			const body = readBody(await res.json());
			const companyId = body.data.id;

			const [company] = await getDatabase().company.findMany({
				id: companyId,
			});

			expect(company).toBeDefined();
			expect(company?.legalName).toBe("Acme Corp");
			expect(company?.kbis).toBe("12345678901234");
		});

		it("should create a company with all fields", async () => {
			const res = await apiClient.companies.$post({
				json: {
					legalName: "Tech Solutions SAS",
					tradeName: "TechSol",
					kbis: "98765432109876",
					vatNumber: "FR12345678901",
					address: "123 Rue de la Tech, 75001 Paris",
				},
			});

			const body = readBody(await res.json());
			const companyId = body.data.id;
			const [company] = await getDatabase().company.findMany({
				id: companyId,
			});

			expect(company).toBeDefined();
			expect(company?.legalName).toBe("Tech Solutions SAS");
			expect(company?.tradeName).toBe("TechSol");
			expect(company?.kbis).toBe("98765432109876");
			expect(company?.vatNumber).toBe("FR12345678901");
			expect(company?.address).toBe("123 Rue de la Tech, 75001 Paris");
		});

		it("should return 400 when legalName is missing", async () => {
			const res = await apiClient.companies.$post({
				json: {
					kbis: "12345678901234",
					tradeName: null,
					vatNumber: null,
					address: null,
				},
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error");
		});

		it("should return 400 when kbis is missing", async () => {
			const res = await apiClient.companies.$post({
				json: {
					legalName: "Test Company",
					tradeName: null,
					vatNumber: null,
					address: null,
				},
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error");
		});

		it("should return 400 when kbis is not unique", async () => {
			const companyData = {
				legalName: "First Company",
				kbis: "12345678901234",
				tradeName: null,
				vatNumber: null,
				address: null,
			};

			await apiClient.companies.$post({
				json: companyData,
			});

			const duplicateCompanyData = {
				...companyData,
				legalName: "Second Company",
			};

			const res = await apiClient.companies.$post({
				json: duplicateCompanyData,
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty(
				"error",
				"A company with this KBIS already exists",
			);
		});

		it("should validate KBIS format", async () => {
			const res = await apiClient.companies.$post({
				json: {
					legalName: "Acme Corp",
					kbis: "1236",
				},
			});

			console.log("Response status:", res);

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error", "KBIS must be exactly 14 digits");
		});
	});

	describe("GET /companies", () => {
		it("should return empty array when no companies exist", async () => {
			const res = await apiClient.companies.$get();

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

			await apiClient.companies.$post({ json: company1Data });
			await apiClient.companies.$post({ json: company2Data });

			const res = await apiClient.companies.$get();

			expect(res.status).toBe(200);
			const companies = (await res.json()) as unknown as ICompany[];
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

			const createRes = await apiClient.companies.$post({ json: companyData });
			const createdCompanyBody = readBody(await createRes.json());
			const createdCompanyId = createdCompanyBody.data.id;

			const res = await apiClient.companies[":id"].$get({
				param: { id: createdCompanyId },
			});

			expect(res.status).toBe(200);
			const company = (await res.json()) as unknown as ICompany;
			expect(company).toMatchObject(companyData);
			expect(company.id).toBe(createdCompanyId);
		});

		it("should return 404 for non-existent company", async () => {
			const res = await apiClient.companies[":id"].$get({
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

			const createRes = await apiClient.companies.$post({ json: initialData });
			const createdCompanyBody = readBody(await createRes.json());
			const createdCompanyId = createdCompanyBody.data.id;

			const updateData = {
				legalName: "Updated Company Name",
				tradeName: "Updated Trade Name",
				vatNumber: "FR12345678901",
				address: "123 Updated Street, Paris",
			};

			const res = await apiClient.companies[":id"].$put({
				param: { id: createdCompanyId },
				json: updateData,
			});

			expect(res.status).toBe(200);
			const updatedCompanyBody = readBody(await res.json());
			const updatedCompanyId = updatedCompanyBody.data.id;

			const [updatedCompany] = await getDatabase().company.findMany({
				id: updatedCompanyId,
			});

			expect(updatedCompany).toBeDefined();
			expect(updatedCompany?.legalName).toBe("Updated Company Name");
			expect(updatedCompany?.tradeName).toBe("Updated Trade Name");
			expect(updatedCompany?.vatNumber).toBe("FR12345678901");
			expect(updatedCompany?.address).toBe("123 Updated Street, Paris");
			expect(updatedCompany?.id).toBe(createdCompanyId);
		});

		it("should not allow updating KBIS", async () => {
			const createRes = await apiClient.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "12345678901234",
				},
			});
			const createdCompanyBody = readBody(await createRes.json());
			const createdCompanyId = createdCompanyBody.data.id;

			const res = await apiClient.companies[":id"].$put({
				param: { id: createdCompanyId },
				json: {
					legalName: "Updated Company",
					kbis: "98765432109876",
				},
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			console.log("Error response:", error);
			expect(error).toHaveProperty(
				"error",
				"KBIS cannot be updated for security reasons",
			);
		});

		it("should return 404 when updating non-existent company", async () => {
			const res = await apiClient.companies[":id"].$put({
				param: { id: "00000000-0000-0000-0000-000000000000" },
				json: {
					legalName: "Updated Company",
				},
			});

			expect(res.status).toBe(404);
			const error = await res.json();
			expect(error).toHaveProperty("error", "Company not found");
		});

		it("should validate required Legal Name on update", async () => {
			const createRes = await apiClient.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "12345678901234",
				},
			});
			const createdCompanyBody = readBody(await createRes.json());
			const createdCompanyId = createdCompanyBody.data.id;

			const res = await apiClient.companies[":id"].$put({
				param: { id: createdCompanyId },
				json: {
					legalName: "",
				},
			});

			expect(res.status).toBe(400);
			const error = await res.json();
			expect(error).toHaveProperty("error", "Legal name cannot be empty");
		});

		it("should allow partial updates", async () => {
			const initialData = {
				legalName: "Test Company",
				kbis: "12345678901234",
				tradeName: "Original Trade Name",
				vatNumber: "FR11111111111",
			};

			const createRes = await apiClient.companies.$post({ json: initialData });
			const createdCompanyBody = readBody(await createRes.json());
			const createdCompanyId = createdCompanyBody.data.id;

			const res = await apiClient.companies[":id"].$put({
				param: { id: createdCompanyId },
				json: {
					legalName: "Updated Legal Name",
				},
			});

			expect(res.status).toBe(200);
			const updatedCompanyBody = readBody(await res.json());
			const updatedCompanyId = updatedCompanyBody.data.id;
			const [updatedCompany] = await getDatabase().company.findMany({
				id: updatedCompanyId,
			});
			expect(updatedCompany).toBeDefined();
			expect(updatedCompany?.legalName).toBe("Updated Legal Name");
			expect(updatedCompany?.tradeName).toBe("Original Trade Name");
			expect(updatedCompany?.vatNumber).toBe("FR11111111111");
		});
	});

	describe("DELETE /companies/:id", () => {
		it("should soft delete a company", async () => {
			const createRes = await apiClient.companies.$post({
				json: {
					legalName: "Company to Delete",
					kbis: "12345678901234",
				},
			});
			const createdCompanyBody = readBody(await createRes.json());
			const createdCompanyId = createdCompanyBody.data.id;

			const deleteRes = await apiClient.companies[":id"].$delete({
				param: { id: createdCompanyId },
			});

			expect(deleteRes.status).toBe(204);

			const getRes = await apiClient.companies[":id"].$get({
				param: { id: createdCompanyId },
			});

			expect(getRes.status).toBe(404);

			const [company] = await getDatabase().company.findMany({
				id: createdCompanyId,
			});
			expect(company).toBeUndefined();
		});

		it("should return 404 when deleting non-existent company", async () => {
			const res = await apiClient.companies[":id"].$delete({
				param: { id: "00000000-0000-0000-0000-000000000000" },
			});

			expect(res.status).toBe(404);
			const error = await res.json();
			expect(error).toHaveProperty("error", "Company not found");
		});

		it("should remove deleted company from listings", async () => {
			const createRes1 = await apiClient.companies.$post({
				json: {
					legalName: "Company 1",
					kbis: "12345678901234",
				},
			});
			const company1Body = readBody(await createRes1.json());
			const company1Id = company1Body.data.id;

			await apiClient.companies.$post({
				json: {
					legalName: "Company 2",
					kbis: "98765432109876",
				},
			});

			let listRes = await apiClient.companies.$get();
			let companies = await listRes.json();
			expect(companies).toHaveLength(2);

			await apiClient.companies[":id"].$delete({
				param: { id: company1Id },
			});

			listRes = await apiClient.companies.$get();
			companies = await listRes.json();
			expect(companies).toHaveLength(1);
			expect(companies[0].legalName).toBe("Company 2");
		});

		it("should allow creating new company with same KBIS after deletion", async () => {
			const companyData = {
				legalName: "Original Company",
				kbis: "12345678901234",
			};

			const createRes = await apiClient.companies.$post({ json: companyData });
			const companyBody = readBody(await createRes.json());
			const companyId = companyBody.data.id;

			await apiClient.companies[":id"].$delete({
				param: { id: companyId },
			});

			const newCompanyData = {
				legalName: "New Company",
				kbis: "12345678901234",
			};

			const createNewRes = await apiClient.companies.$post({
				json: newCompanyData,
			});
			expect(createNewRes.status).toBe(201);
			const newCompanyBody = readBody(await createNewRes.json());
			const newCompanyId = newCompanyBody.data.id;

			const [newCompany] = await getDatabase().company.findMany({
				id: newCompanyId,
			});
			expect(newCompany).toBeDefined();
			expect(newCompany?.legalName).toBe("New Company");
			expect(newCompany?.kbis).toBe("12345678901234");
			expect(newCompany?.id).toBe(newCompanyId);
		});
	});
});
