import { describe, it, expect } from "vitest";
import { getApiClient } from "../../test-utils/get-api-client.ts";
import { readBody } from "../../test-utils/readBody.ts";

async function createUserWithoutCompany() {
	const { app, database } = await getApiClient();

	const uniqueEmail = `testuser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;

	await app.fetch(
		new Request("https://_/auth/sign-up/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "Test User",
				email: uniqueEmail,
				password: "TestPassword123!",
			}),
		}),
	);

	const [user] = await database.user.findMany({ email: uniqueEmail });
	if (!user) throw new Error("User not found");

	await database.user.update(user.id, { emailVerified: true });

	const signInResponse = await app.fetch(
		new Request("https://_/auth/sign-in/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: uniqueEmail,
				password: "TestPassword123!",
			}),
		}),
	);

	const cookie = signInResponse.headers.get("set-cookie");
	if (!cookie) throw new Error("Missing cookie");

	const { apiClient } = await getApiClient({ cookie });

	return {
		apiClient,
		database,
		user,
	};
}

describe("Companies Router", async () => {
	describe("POST /companies", () => {
		it("should create a company and associate it with the authenticated user", async () => {
			const { apiClient, database, user } = await createUserWithoutCompany();

			const res = await apiClient.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "12345678901234",
					tradeName: "Test Trade Name",
					vatNumber: "FR123456789",
					address: "123 Test Street, Test City, TC 12345",
				},
			});

			expect(res.status).toBe(201);
			const body = await readBody(await res.json());
			const companyId = body.data.id;

			const [company] = await database.company.findMany({ id: companyId });
			expect(company).toBeDefined();
			expect(company?.legalName).toBe("Test Company");
			expect(company?.kbis).toBe("12345678901234");
			expect(company?.tradeName).toBe("Test Trade Name");
			expect(company?.vatNumber).toBe("FR123456789");
			expect(company?.address).toBe("123 Test Street, Test City, TC 12345");
			expect(company?.userId).toBeDefined();
			expect(company?.userId).toBe(user.id);
		});

		// it("should reject duplicate KBIS", async () => {
		// 	const { apiClient: firstApiClient } = await createUserWithoutCompany();

		// 	await firstApiClient.companies.$post({
		// 		json: {
		// 			legalName: "First Company",
		// 			kbis: "12345678901236",
		// 			tradeName: "First Trade Name",
		// 			vatNumber: "FR123456789",
		// 			address: "123 First Street, First City, FC 12345",
		// 		},
		// 	});

		// 	const { apiClient: secondApiClient } = await createUserWithoutCompany();

		// 	const res = await secondApiClient.companies.$post({
		// 		json: {
		// 			legalName: "Second Company",
		// 			kbis: "12345678901236",
		// 			tradeName: "Second Trade Name",
		// 			vatNumber: "FR987654321",
		// 			address: "456 Second Street, Second City, SC 54321",
		// 		},
		// 	});

		// 	expect(res.status).toBe(400);
		// 	const body = readBody(await res.json());
		// 	expect(body.error).toBe("A company with this KBIS already exists");
		// });
	});

	describe("Company Access Control", () => {
		it("should only allow access to own company via GET /:id", async () => {
			const { apiClient, database, user } = await createUserWithoutCompany();

			await apiClient.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "12345678901238",
					tradeName: "Test Trade Name",
					vatNumber: "FR123456789",
					address: "123 Test Street, Test City, TC 12345",
				},
			});

			const userWithCompany = await database.user.findOne(user.id);
			const companyId = userWithCompany?.companyId;
			if (!companyId) throw new Error("User should have a company");

			const anotherUser = await database.user.insert({
				email: "another@example.com",
				passwordHash: "hashedpassword",
				emailVerified: true,
				permissionLevel: "user",
				profileId: null,
				companyId: null,
			});

			const anotherCompany = await database.company.insert({
				legalName: "Another Company",
				kbis: "12345678901239",
				tradeName: null,
				vatNumber: null,
				address: null,
				userId: anotherUser.id,
			});

			await database.user.update(anotherUser.id, {
				companyId: anotherCompany.id,
			});

			const ownCompanyRes = await apiClient.companies[":id"].$get({
				param: { id: companyId },
			});
			expect(ownCompanyRes.status).toBe(200);

			const otherCompanyRes = await apiClient.companies[":id"].$get({
				param: { id: anotherCompany.id },
			});
			expect(otherCompanyRes.status).toBe(403);
		});

		it("should only allow updates to own company", async () => {
			const { apiClient, database, user } = await createUserWithoutCompany();

			await apiClient.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "22345678901238",
					tradeName: "Test Trade Name",
					vatNumber: "FR123456789",
					address: "123 Test Street, Test City, TC 12345",
				},
			});

			const userWithCompany = await database.user.findOne(user.id);
			const companyId = userWithCompany?.companyId;
			if (!companyId) throw new Error("User should have a company");

			const anotherUser = await database.user.insert({
				email: "another2@example.com",
				passwordHash: "hashedpassword",
				emailVerified: true,
				permissionLevel: "user",
				profileId: null,
				companyId: null,
			});

			const anotherCompany = await database.company.insert({
				legalName: "Another Company 2",
				kbis: `6666${Math.floor(Math.random() * 1000000000)
					.toString()
					.padStart(10, "0")}`,
				tradeName: null,
				vatNumber: null,
				address: null,
				userId: anotherUser.id,
			});

			await database.user.update(anotherUser.id, {
				companyId: anotherCompany.id,
			});

			const ownUpdateRes = await apiClient.companies[":id"].$put({
				param: { id: companyId },
				json: {
					legalName: "Updated Company Name",
				},
			});
			expect(ownUpdateRes.status).toBe(200);

			const otherUpdateRes = await apiClient.companies[":id"].$put({
				param: { id: anotherCompany.id },
				json: {
					legalName: "Hacked Company Name",
				},
			});
			expect(otherUpdateRes.status).toBe(403);
		});

		it("should prevent KBIS updates for security", async () => {
			const { apiClient, database, user } = await createUserWithoutCompany();

			await apiClient.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "32345678901238",
					tradeName: "Test Trade Name",
					vatNumber: "FR123456789",
					address: "123 Test Street, Test City, TC 12345",
				},
			});

			const userWithCompany = await database.user.findOne(user.id);
			const companyId = userWithCompany?.companyId;
			if (!companyId) throw new Error("User should have a company");

			const updateRes = await apiClient.companies[":id"].$put({
				param: { id: companyId },
				json: {
					kbis: "42345678901238",
				},
			});

			expect(updateRes.status).toBe(400);
			const body = readBody(await updateRes.json());
			expect(body.error as string).toContain("KBIS cannot be updated");
		});
	});

	describe("Store Creation with Company Association", () => {
		it("should create a store using the user's company automatically", async () => {
			const { apiClient, database, user } = await createUserWithoutCompany();

			await apiClient.companies.$post({
				json: {
					legalName: "Test Company",
					kbis: "42345678901234",
					tradeName: "Test Trade Name",
					vatNumber: "FR123456789",
					address: "123 Test Street, Test City, TC 12345",
				},
			});

			const userWithCompany = await database.user.findOne(user.id);
			const expectedCompanyId = userWithCompany?.companyId;
			if (!expectedCompanyId) throw new Error("User should have a company");

			const storeRes = await apiClient.stores.$post({
				json: {
					name: "My Test Store",
					slug: "my-test-store-unique",
					contactEmail: "store@example.com",
				},
			});

			expect(storeRes.status).toBe(201);
			const storeBody = readBody(await storeRes.json());

			const createdStore = await database.store.findOne(storeBody.data.id);
			expect(createdStore?.companyId).toBe(expectedCompanyId);

			const [storeMember] = await database.storeMember.findMany({
				user: { id: user.id },
				store: { id: storeBody.data.id },
			});
			expect(storeMember).toBeDefined();
			expect(storeMember?.permissionLevel).toBe("owner");
		});

		it("should reject store creation if user has no company", async () => {
			const { apiClient } = await createUserWithoutCompany();

			const storeRes = await apiClient.stores.$post({
				json: {
					name: "Store Without Company",
					slug: "store-without-company",
					contactEmail: "store@example.com",
				},
			});

			expect(storeRes.status).toBe(404);
			const body = readBody(await storeRes.json());
			expect(body.error as string).toContain(
				"No company associated with this user",
			);
		});
	});
});
