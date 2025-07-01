import { testClient } from "hono/testing";
import { describe, it, expect } from "vitest";
import { app } from "../app.ts";

async function createTestUser(
	client: any,
	userData = {
		name: "Test User",
		email: "test@example.com",
		password: "password123",
	},
) {
	const res = await client.auth["sign-up"].email.$post({
		json: userData,
	});
	return { response: res, userData };
}

describe("Auth Router", () => {
	const client = testClient(app);

	describe("Sign up Endpoint", () => {
		it("should handle sign up with email and password via POST", async () => {
			const signUpData = {
				name: "New User",
				email: "newuser@example.com",
				password: "password123",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: signUpData,
			});

			expect(res.status).toBe(200);
			const responseData = await res.json();
			expect(responseData).toHaveProperty("user");
			expect(responseData.user).toHaveProperty("email", signUpData.email);
			expect(responseData.user).toHaveProperty("name", signUpData.name);
		});

		it("should return 400 for missing email", async () => {
			const incompleteData = {
				name: "Test User",
				password: "password123",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: incompleteData,
			});

			expect(res.status).toBe(400);
		});

		it("should return 500 for missing password", async () => {
			const incompleteData = {
				name: "Test User",
				email: "test@example.com",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: incompleteData,
			});

			expect(res.status).toBe(500);
		});

		it("should create user without name field", async () => {
			const incompleteData = {
				email: "test-no-name@example.com",
				password: "password123",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: incompleteData,
			});

			expect(res.status).toBe(200);
		});

		it("should return 422 for duplicate email", async () => {
			const userData = {
				name: "First User",
				email: "duplicate@example.com",
				password: "password123",
			};

			await client.auth["sign-up"].email.$post({
				json: userData,
			});

			const duplicateUserData = {
				name: "Second User",
				email: "duplicate@example.com",
				password: "differentpassword",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: duplicateUserData,
			});

			expect(res.status).toBe(422);
		});
	});

	describe("Sign in Endpoint", () => {
		it("should handle sign in with email and password via POST", async () => {
			const testUserData = {
				name: "Test User",
				email: "signin-test@example.com",
				password: "password123",
			};

			await createTestUser(client, testUserData);

			const signInData = {
				email: testUserData.email,
				password: testUserData.password,
			};

			const res = await client.auth["sign-in"]["email"].$post({
				json: signInData,
			});

			expect(res.status).toBe(200);
			const responseData = await res.json();
			expect(responseData).toHaveProperty("user");
			expect(responseData).toHaveProperty("token");
		});

		it("should return 401 for invalid credentials", async () => {
			const testUserData = {
				name: "Test User 2",
				email: "signin-invalid@example.com",
				password: "password123",
			};

			await createTestUser(client, testUserData);

			const invalidSignInData = {
				email: testUserData.email,
				password: "wrongpassword",
			};

			const res = await client.auth["sign-in"]["email"].$post({
				json: invalidSignInData,
			});

			expect(res.status).toBe(401);
		});

		it("should return 400 for missing email", async () => {
			const incompleteData = {
				password: "password123",
			};

			const res = await client.auth["sign-in"]["email"].$post({
				json: incompleteData,
			});

			expect(res.status).toBe(400);
		});

		it("should return 400 for missing password", async () => {
			const incompleteData = {
				email: "test@example.com",
			};

			const res = await client.auth["sign-in"]["email"].$post({
				json: incompleteData,
			});

			expect(res.status).toBe(400);
		});

		it("should return 401 for non-existent user", async () => {
			const nonExistentUserData = {
				email: "nonexistent@example.com",
				password: "password123",
			};

			const res = await client.auth["sign-in"]["email"].$post({
				json: nonExistentUserData,
			});

			expect(res.status).toBe(401);
		});
	});

	describe("Auth Integration", () => {
		it("should allow sign up then sign in flow", async () => {
			const userData = {
				name: "Integration Test User",
				email: "integration@example.com",
				password: "securepassword123",
			};

			const signUpRes = await client.auth["sign-up"].email.$post({
				json: userData,
			});

			expect(signUpRes.status).toBe(200);
			const signUpData = await signUpRes.json();
			expect(signUpData).toHaveProperty("user");
			expect(signUpData.user.email).toBe(userData.email);

			const signInData = {
				email: userData.email,
				password: userData.password,
			};

			const signInRes = await client.auth["sign-in"]["email"].$post({
				json: signInData,
			});

			expect(signInRes.status).toBe(200);
			const signInResponseData = await signInRes.json();
			expect(signInResponseData).toHaveProperty("user");
			expect(signInResponseData).toHaveProperty("token");
			expect(signInResponseData.user.email).toBe(userData.email);
		});
	});

	-describe("Input Validation", () => {
		it("should return 400 for invalid email format", async () => {
			const invalidEmailData = {
				name: "Test User",
				email: "invalid-email",
				password: "password123",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: invalidEmailData,
			});

			expect(res.status).toBe(400);
		});

		it("should return 400 for password too short", async () => {
			const shortPasswordData = {
				name: "Test User",
				email: "test@example.com",
				password: "123",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: shortPasswordData,
			});

			expect(res.status).toBe(400);
		});

		it("should return 400 for empty strings", async () => {
			const emptyData = {
				name: "",
				email: "",
				password: "",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: emptyData,
			});

			expect(res.status).toBe(400);
		});

		it("should handle very long email addresses", async () => {
			const longEmail = "a".repeat(300) + "@example.com";
			const longEmailData = {
				name: "Test User",
				email: longEmail,
				password: "password123",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: longEmailData,
			});

			expect(res.status).toBe(200);
		});
	});

	describe("Security Tests", () => {
		it("should not return password in response", async () => {
			const userData = {
				name: "Security Test",
				email: "security@example.com",
				password: "password123",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: userData,
			});

			expect(res.status).toBe(200);
			const responseData = await res.json();
			expect(responseData.user).not.toHaveProperty("password");
		});

		it("should handle SQL injection attempts in email", async () => {
			const maliciousData = {
				name: "Test User",
				email: "test'; DROP TABLE users; --@example.com",
				password: "password123",
			};

			const res = await client.auth["sign-up"].email.$post({
				json: maliciousData,
			});

			expect(res.status).toBe(400);
		});
	});
});
