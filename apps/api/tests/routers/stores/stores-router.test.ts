import { describe, it, expect } from "vitest";
import { getApiClient } from "../../test-utils/get-api-client.ts";
import { readBody } from "../../test-utils/readBody.ts";

async function createUserWithCompany() {
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

	const companyRes = await apiClient.companies.$post({
		json: {
			legalName: "Test Company",
			kbis: Math.random().toString().slice(2, 16).padEnd(14, "0"),
			tradeName: "Test Trade Name",
			vatNumber: "FR123456789",
			address: "123 Test Street, Test City, TC 12345",
		},
	});

	if (companyRes.status !== 201) {
		throw new Error("Failed to create company");
	}

	return {
		apiClient,
		database,
		user,
	};
}

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

describe("Stores Router", async () => {
	describe("Company Requirement for Store Creation", () => {
		it("should create a store when user has a company", async () => {
			const { apiClient, database, user } = await createUserWithCompany();

			const storeSlug = `test-store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

			const res = await apiClient.stores.$post({
				json: {
					name: "Test Store",
					slug: storeSlug,
					contactEmail: "store@example.com",
					contactPhone: "+33123456789",
				},
			});

			expect(res.status).toBe(201);
			const body = await readBody(await res.json());
			const storeId = body.data.id;

			const [store] = await database.store.findMany({ id: storeId });
			expect(store).toBeDefined();
			expect(store?.name).toBe("Test Store");
			expect(store?.slug).toBe(storeSlug);
			expect(store?.contactEmail).toBe("store@example.com");
			expect(store?.contactPhone).toBe("+33123456789");

			const userWithCompany = await database.user.findOne(user.id);
			expect(store?.companyId).toBe(userWithCompany?.companyId);

			const [storeMember] = await database.storeMember.findMany({
				user: { id: user.id },
				store: { id: storeId },
			});
			expect(storeMember).toBeDefined();
			expect(storeMember?.permissionLevel).toBe("owner");
		});

		it("should reject store creation if user has no company", async () => {
			const { apiClient } = await createUserWithoutCompany();

			const storeSlug = `test-store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

			const res = await apiClient.stores.$post({
				json: {
					name: "Test Store Without Company",
					slug: storeSlug,
					contactEmail: "store@example.com",
				},
			});

			expect(res.status).toBe(404);
			const body = readBody(await res.json());
			expect(body.error as string).toContain(
				"No company associated with this user",
			);
		});

		// it("should reject duplicate slugs", async () => {
		// 	const { apiClient } = await createUserWithCompany();
		// 	const { apiClient: apiClient2 } = await createUserWithCompany();

		// 	const duplicateSlug = `duplicate-slug-${Date.now()}`;

		// 	const firstRes = await apiClient.stores.$post({
		// 		json: {
		// 			name: "First Store",
		// 			slug: duplicateSlug,
		// 			contactEmail: "first@example.com",
		// 		},
		// 	});
		// 	expect(firstRes.status).toBe(201);

		// 	const secondRes = await apiClient2.stores.$post({
		// 		json: {
		// 			name: "Second Store",
		// 			slug: duplicateSlug,
		// 			contactEmail: "second@example.com",
		// 		},
		// 	});

		// 	expect(secondRes.status).toBe(400);
		// 	const body = readBody(await secondRes.json());
		// 	expect(body.error as string).toContain("A store with this slug already exists");
		// });
	});

	describe("Store Access Control", () => {
		it("should only allow access to own store via GET /:id", async () => {
			const { apiClient } = await createUserWithCompany();
			const { apiClient: otherApiClient } = await createUserWithCompany();

			const storeSlug = `access-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const storeRes = await apiClient.stores.$post({
				json: {
					name: "My Store",
					slug: storeSlug,
					contactEmail: "mystore@example.com",
				},
			});

			const storeBody = readBody(await storeRes.json());
			const storeId = storeBody.data.id;

			const ownStoreRes = await apiClient.stores[":id"].$get({
				param: { id: storeId },
			});
			expect(ownStoreRes.status).toBe(200);

			const otherStoreRes = await otherApiClient.stores[":id"].$get({
				param: { id: storeId },
			});
			expect(otherStoreRes.status).toBe(404);
		});

		it("should only allow store owner to update store", async () => {
			const { apiClient } = await createUserWithCompany();
			const { apiClient: otherApiClient } = await createUserWithCompany();

			const storeSlug = `update-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const storeRes = await apiClient.stores.$post({
				json: {
					name: "Update Test Store",
					slug: storeSlug,
					contactEmail: "updatetest@example.com",
				},
			});

			const storeBody = readBody(await storeRes.json());
			const storeId = storeBody.data.id;

			const ownerUpdateRes = await apiClient.stores[":id"].$put({
				param: { id: storeId },
				json: {
					name: "Updated Store Name",
				},
			});
			expect(ownerUpdateRes.status).toBe(200);

			const otherUpdateRes = await otherApiClient.stores[":id"].$put({
				param: { id: storeId },
				json: {
					name: "Hacked Store Name",
				},
			});
			expect(otherUpdateRes.status).toBe(403);
		});

		// it("should prevent slug updates to existing slug", async () => {
		// 	const { apiClient } = await createUserWithCompany();

		// 	const firstSlug = `first-store-${Date.now()}`;
		// 	await apiClient.stores.$post({
		// 		json: {
		// 			name: "First Store",
		// 			slug: firstSlug,
		// 			contactEmail: "first@example.com",
		// 		},
		// 	});

		// 	const secondSlug = `second-store-${Date.now()}`;
		// 	const secondStoreRes = await apiClient.stores.$post({
		// 		json: {
		// 			name: "Second Store",
		// 			slug: secondSlug,
		// 			contactEmail: "second@example.com",
		// 		},
		// 	});

		// 	const secondStoreBody = readBody(await secondStoreRes.json());
		// 	const secondStoreId = secondStoreBody.data.id;

		// 	const updateRes = await apiClient.stores[":id"].$put({
		// 		param: { id: secondStoreId },
		// 		json: {
		// 			slug: firstSlug,
		// 		},
		// 	});

		// 	expect(updateRes.status).toBe(400);
		// 	const body = readBody(await updateRes.json());
		// 	expect(body.error as string).toContain("A store with this slug already exists");
		// });
	});

	describe("Store Member Permissions", () => {
		it("should automatically create owner membership on store creation", async () => {
			const { apiClient, database, user } = await createUserWithCompany();

			const storeSlug = `owner-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const storeRes = await apiClient.stores.$post({
				json: {
					name: "Owner Test Store",
					slug: storeSlug,
					contactEmail: "owner@example.com",
				},
			});

			const storeBody = readBody(await storeRes.json());
			const storeId = storeBody.data.id;

			const [storeMember] = await database.storeMember.findMany({
				user: { id: user.id },
				store: { id: storeId },
			});

			expect(storeMember).toBeDefined();
			expect(storeMember?.permissionLevel).toBe("owner");
			expect(storeMember?.userId).toBe(user.id);
			expect(storeMember?.storeId).toBe(storeId);
		});

		it("should not create duplicate store memberships", async () => {
			const { apiClient, database, user } = await createUserWithCompany();

			const storeSlug = `duplicate-member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const storeRes = await apiClient.stores.$post({
				json: {
					name: "Duplicate Member Test",
					slug: storeSlug,
					contactEmail: "duplicate@example.com",
				},
			});

			const storeBody = readBody(await storeRes.json());
			const storeId = storeBody.data.id;

			const storeMembers = await database.storeMember.findMany({
				user: { id: user.id },
				store: { id: storeId },
			});

			expect(storeMembers).toHaveLength(1);
			expect(storeMembers[0]?.permissionLevel).toBe("owner");
		});
	});

	describe("Store Validation", () => {
		it("should validate slug format", async () => {
			const { apiClient } = await createUserWithCompany();

			const invalidSlugs = [
				"Invalid Slug With Spaces",
				"UPPERCASE-SLUG",
				"slug_with_underscores",
				"slug.with.dots",
				"slug@with@special",
				"-slug-starting-with-dash",
				"slug-ending-with-dash-",
				"",
			];

			for (const invalidSlug of invalidSlugs) {
				const res = await apiClient.stores.$post({
					json: {
						name: "Test Store",
						slug: invalidSlug,
						contactEmail: "test@example.com",
					},
				});

				expect(res.status).toBe(400);
			}
		});
		it("should validate email format", async () => {
			const { apiClient } = await createUserWithCompany();

			const invalidEmails = [
				"invalid-email",
				"@example.com",
				"test@",
				"test@.com",
				"test space@example.com",
			];

			for (const invalidEmail of invalidEmails) {
				const storeSlug = `email-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				const res = await apiClient.stores.$post({
					json: {
						name: "Test Store",
						slug: storeSlug,
						contactEmail: invalidEmail,
					},
				});

				expect(res.status).toBe(400);
			}
		});

		it("should validate phone number format when provided", async () => {
			const { apiClient } = await createUserWithCompany();

			const invalidPhones = [
				"123456789",
				"+33",
				"not-a-number",
				"+33 1 23 45 67 89",
				"01 23 45 67 89",
			];

			for (const invalidPhone of invalidPhones) {
				const storeSlug = `phone-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				const res = await apiClient.stores.$post({
					json: {
						name: "Test Store",
						slug: storeSlug,
						contactEmail: "test@example.com",
						contactPhone: invalidPhone,
					},
				});

				expect(res.status).toBe(400);
			}
		});

		it("should accept valid phone number formats", async () => {
			const { apiClient } = await createUserWithCompany();

			const validPhones = ["+33123456789", "0123456789"];

			for (const validPhone of validPhones) {
				const storeSlug = `valid-phone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				const res = await apiClient.stores.$post({
					json: {
						name: "Test Store",
						slug: storeSlug,
						contactEmail: "test@example.com",
						contactPhone: validPhone,
					},
				});

				expect(res.status).toBe(201);
			}
		});
	});
});
