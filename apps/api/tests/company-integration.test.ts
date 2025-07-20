import { testClient } from "hono/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import { SqliteDriver } from "@mikro-orm/sqlite";

let database: MikroOrmDatabase;

vi.mock("../src/database.ts", () => ({
	get database() {
		return database;
	},
}));

describe("Company API Integration Tests", () => {
	let app: any;
	let client: any;

	beforeEach(async () => {
		database = await MikroOrmDatabase.create(SqliteDriver, ":memory:");
		const appModule = await import("../src/app.ts");
		app = appModule.app;
		client = testClient(app);
	});

	it("should handle complete company management workflow", async () => {
		let companiesRes = await client.companies.$get();
		expect(companiesRes.status).toBe(200);
		let companies = await companiesRes.json();
		expect(companies).toHaveLength(0);

		const minimalCompanyData = {
			legalName: "Tech Startup SAS",
			kbis: "12345678901234",
		};

		const createRes1 = await client.companies.$post({
			json: minimalCompanyData,
		});

		expect(createRes1.status).toBe(201);
		const company1 = await createRes1.json();
		expect(company1).toMatchObject({
			...minimalCompanyData,
			tradeName: null,
			vatNumber: null,
			address: null,
		});
		expect(company1.id).toBeDefined();

		const fullCompanyData = {
			legalName: "E-Commerce Solutions SARL",
			tradeName: "E-Com",
			kbis: "98765432109876",
			vatNumber: "FR98765432109",
			address: "456 Commerce Avenue, 69000 Lyon",
		};

		const createRes2 = await client.companies.$post({
			json: fullCompanyData,
		});

		expect(createRes2.status).toBe(201);
		const company2 = await createRes2.json();
		expect(company2).toMatchObject(fullCompanyData);

		companiesRes = await client.companies.$get();
		companies = await companiesRes.json();
		expect(companies).toHaveLength(2);

		const getRes1 = await client.companies[":id"].$get({
			param: { id: company1.id },
		});
		expect(getRes1.status).toBe(200);
		expect(await getRes1.json()).toMatchObject(minimalCompanyData);

		const getRes2 = await client.companies[":id"].$get({
			param: { id: company2.id },
		});
		expect(getRes2.status).toBe(200);
		expect(await getRes2.json()).toMatchObject(fullCompanyData);

		const duplicateRes = await client.companies.$post({
			json: {
				legalName: "Another Company",
				kbis: "12345678901234",
			},
		});

		expect(duplicateRes.status).toBe(400);
		const error = await duplicateRes.json();
		expect(error).toHaveProperty("error");
		expect(error.error).toContain("KBIS already exists");

		companiesRes = await client.companies.$get();
		companies = await companiesRes.json();
		expect(companies).toHaveLength(2);
	});

	it("should validate real-world business scenarios", async () => {
		const scenarios = [
			{
				name: "Individual entrepreneur",
				data: {
					legalName: "Jean Dupont",
					kbis: "11111111111111",
					tradeName: null,
					vatNumber: null,
					address: "10 Rue de la Paix, 75001 Paris",
				},
			},
			{
				name: "SAS with full details",
				data: {
					legalName: "Innovation Tech SAS",
					tradeName: "InnovTech",
					kbis: "22222222222222",
					vatNumber: "FR22222222222",
					address: "100 Avenue des Champs-Élysées, 75008 Paris",
				},
			},
			{
				name: "SARL minimal",
				data: {
					legalName: "Services Pro SARL",
					kbis: "33333333333333",
				},
			},
		];

		for (const scenario of scenarios) {
			const res = await client.companies.$post({
				json: scenario.data,
			});

			expect(res.status).toBe(201);
			const company = await res.json();
			expect(company).toMatchObject(scenario.data);
			expect(company.id).toBeDefined();
			expect(company.createdAt).toBeDefined();
		}

		const companiesRes = await client.companies.$get();
		const companies = await companiesRes.json();
		expect(companies).toHaveLength(3);
	});

	it("should handle complete CRUD lifecycle with security validations", async () => {
		const initialData = {
			legalName: "Security Test Corp",
			kbis: "55555555555555",
			tradeName: "SecTest",
			vatNumber: "FR55555555555",
			address: "Security Street, Test City",
		};

		const createRes = await client.companies.$post({ json: initialData });
		expect(createRes.status).toBe(201);
		const company = await createRes.json();

		const readRes = await client.companies[":id"].$get({
			param: { id: company.id },
		});
		expect(readRes.status).toBe(200);
		const readCompany = await readRes.json();
		expect(readCompany).toMatchObject(initialData);

		const invalidUpdateRes = await client.companies[":id"].$put({
			param: { id: company.id },
			json: {
				kbis: "99999999999999", 
			},
		});
		expect(invalidUpdateRes.status).toBe(400);
		const error = await invalidUpdateRes.json();
		expect(error.error).toContain("security reasons");

		const updateData = {
			legalName: "Updated Security Corp",
			tradeName: "UpdatedSecTest",
			address: "New Security Address",
		};

		const updateRes = await client.companies[":id"].$put({
			param: { id: company.id },
			json: updateData,
		});
		expect(updateRes.status).toBe(200);
		const updatedCompany = await updateRes.json();
		expect(updatedCompany.legalName).toBe("Updated Security Corp");
		expect(updatedCompany.kbis).toBe("55555555555555");

		const verifyRes = await client.companies[":id"].$get({
			param: { id: company.id },
		});
		const verifiedCompany = await verifyRes.json();
		expect(verifiedCompany.legalName).toBe("Updated Security Corp");

		const deleteRes = await client.companies[":id"].$delete({
			param: { id: company.id },
		});
		expect(deleteRes.status).toBe(204);

		const deletedRes = await client.companies[":id"].$get({
			param: { id: company.id },
		});
		expect(deletedRes.status).toBe(404);

		const reuseRes = await client.companies.$post({
			json: {
				legalName: "Reuse KBIS Corp",
				kbis: "55555555555555",
			},
		});
		expect(reuseRes.status).toBe(201);
		const reuseCompany = await reuseRes.json();
		expect(reuseCompany.legalName).toBe("Reuse KBIS Corp");
	});
});
