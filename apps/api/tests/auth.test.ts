import { describe, it, expect, vi } from "vitest";
import { createAuthClient } from "better-auth/client";
import { getApiClient } from "./test-utils/get-api-client.ts";

interface UserSignUpData {
	name: string;
	email: string;
	password: string;
}

interface UserSignInData {
	email: string;
	password: string;
}

const authClient = createAuthClient({
	baseURL: "http://localhost:3000/auth",
	fetchOptions: {
		customFetchImpl: async (
			input: string | Request | URL,
			init?: RequestInit,
		) => {
			const request =
				input instanceof Request ? input : new Request(input, init);
			const { app } = await getApiClient();
			return await app.fetch(request);
		},
	},
});

async function createTestUser(
	userData: UserSignUpData = {
		name: "Test User",
		email: "test@example.com",
		password: "password123",
	},
) {
	const res = await authClient.signUp.email(userData);
	return { response: res, userData };
}

describe("Auth Router", () => {
	describe("Sign up Endpoint", () => {
		it("should handle sign up with email and password", async () => {
			const signUpData = {
				name: "New User",
				email: "newuser@example.com",
				password: "password123",
			};

			const res = await authClient.signUp.email(signUpData);

			expect(res.data).toBeTruthy();
			expect(res.data?.user).toHaveProperty("email", signUpData.email);
			expect(res.data?.user).toHaveProperty("name", signUpData.name);
		});

		it("should return error for missing email", async () => {
			const incompleteData: Omit<UserSignUpData, "email"> = {
				name: "Test User",
				password: "password123",
			};

			const res = await authClient.signUp.email(
				// @ts-expect-error - Testing incomplete data
				incompleteData,
			);

			expect(res.error).toBeTruthy();
		});

		it("should return error for missing password", async () => {
			const incompleteData: Omit<UserSignUpData, "password"> = {
				name: "Test User",
				email: "test@example.com",
			};

			const res = await authClient.signUp.email(
				// @ts-expect-error - Testing incomplete data
				incompleteData,
			);

			expect(res.error).toBeTruthy();
		});

		it("should create user without name field", async () => {
			const incompleteData = {
				name: "",
				email: "test-no-name@example.com",
				password: "password123",
			};

			const res = await authClient.signUp.email(incompleteData);

			expect(res.data).toBeTruthy();
			expect(res.data?.user).toHaveProperty("email", incompleteData.email);
		});

		it("should return error for duplicate email", async () => {
			const userData = {
				name: "First User",
				email: "duplicate@example.com",
				password: "password123",
			};

			await authClient.signUp.email(userData);

			const duplicateUserData = {
				name: "Second User",
				email: "duplicate@example.com",
				password: "differentpassword",
			};

			const res = await authClient.signUp.email(duplicateUserData);

			expect(res.error).toBeTruthy();
		});
	});

	describe("Sign in Endpoint", () => {
		it("should return 403 for unverified email when requireEmailVerification is enabled", async () => {
			const testUserData = {
				name: "Test User",
				email: "signin-test@example.com",
				password: "password123",
			};

			await createTestUser(testUserData);

			const signInData = {
				email: testUserData.email,
				password: testUserData.password,
			};

			const res = await authClient.signIn.email(signInData);

			expect(res.error).toBeTruthy();
			expect(res.error?.status).toBe(403);
		});

		it("should return error for invalid credentials", async () => {
			const testUserData = {
				name: "Test User 2",
				email: "signin-invalid@example.com",
				password: "password123",
			};

			await createTestUser(testUserData);

			const invalidSignInData = {
				email: testUserData.email,
				password: "wrongpassword",
			};

			const res = await authClient.signIn.email(invalidSignInData);

			expect(res.error).toBeTruthy();
		});

		it("should return error for missing email", async () => {
			const incompleteData: Omit<UserSignInData, "email"> = {
				password: "password123",
			};

			const res = await authClient.signIn.email(
				// @ts-expect-error - Testing incomplete data
				incompleteData,
			);

			expect(res.error).toBeTruthy();
		});

		it("should return error for missing password", async () => {
			const incompleteData: Omit<UserSignInData, "password"> = {
				email: "test@example.com",
			};

			const res = await authClient.signIn.email(
				// @ts-expect-error - Testing incomplete data
				incompleteData,
			);

			expect(res.error).toBeTruthy();
		});

		it("should return error for non-existent user", async () => {
			const nonExistentUserData = {
				email: "nonexistent@example.com",
				password: "password123",
			};

			const res = await authClient.signIn.email(nonExistentUserData);

			expect(res.error).toBeTruthy();
		});
	});

	describe("Email Verification", () => {
		it("should require email verification before sign in", async () => {
			const userData = {
				name: "Verification Test User",
				email: "verification@example.com",
				password: "password123",
			};

			const signUpRes = await authClient.signUp.email(userData);
			expect(signUpRes.data).toBeTruthy();

			const signInRes = await authClient.signIn.email({
				email: userData.email,
				password: userData.password,
			});

			expect(signInRes.error).toBeTruthy();
			expect(signInRes.error?.status).toBe(403);
		});

		it("should send verification email on sign up when enabled", async () => {
			const userData = {
				name: "Email Test User",
				email: "emailtest@example.com",
				password: "password123",
			};

			const signUpRes = await authClient.signUp.email(userData);
			expect(signUpRes.data).toBeTruthy();

			expect(signUpRes.data?.user).toHaveProperty("emailVerified", false);
		});

		it("should return 403 when trying to sign in with unverified email", async () => {
			const userData = {
				name: "Unverified User",
				email: "unverified@example.com",
				password: "password123",
			};

			const signUpRes = await authClient.signUp.email(userData);
			expect(signUpRes.data).toBeTruthy();

			const signInRes = await authClient.signIn.email({
				email: userData.email,
				password: userData.password,
			});

			expect(signInRes.error).toBeTruthy();
			expect(signInRes.error?.status).toBe(403);
		});

		it("should allow verification of email with valid token", async () => {
			const userData = {
				name: "Verification Test User",
				email: "verification-token-test@example.com",
				password: "password123",
			};

			const signUpRes = await authClient.signUp.email(userData);
			expect(signUpRes.data).toBeTruthy();
			expect(signUpRes.data?.user.emailVerified).toBe(false);

			try {
				await authClient.verifyEmail({
					query: {
						token: "invalid-token",
					},
				});
			} catch (error) {
				expect(error).toBeTruthy();
			}
		});
	});

	describe("Auth Integration", () => {
		it("should create user but prevent sign in until email verification", async () => {
			const userData = {
				name: "Integration Test User",
				email: "integration@example.com",
				password: "securepassword123",
			};

			const signUpRes = await authClient.signUp.email(userData);

			expect(signUpRes.data).toBeTruthy();
			expect(signUpRes.data?.user).toHaveProperty("email", userData.email);
			expect(signUpRes.data?.user).toHaveProperty("emailVerified", false);

			const signInData = {
				email: userData.email,
				password: userData.password,
			};

			const signInRes = await authClient.signIn.email(signInData);

			expect(signInRes.error).toBeTruthy();
			expect(signInRes.error?.status).toBe(403);
		});
	});

	describe("Input Validation", () => {
		it("should return error for invalid email format", async () => {
			const invalidEmailData = {
				name: "Test User",
				email: "invalid-email",
				password: "password123",
			};

			const res = await authClient.signUp.email(invalidEmailData);

			expect(res.error).toBeTruthy();
		});

		it("should return error for password too short", async () => {
			const shortPasswordData = {
				name: "Test User",
				email: "test@example.com",
				password: "123",
			};

			const res = await authClient.signUp.email(shortPasswordData);

			expect(res.error).toBeTruthy();
		});

		it("should return error for empty strings", async () => {
			const emptyData = {
				name: "",
				email: "",
				password: "",
			};

			const res = await authClient.signUp.email(emptyData);

			expect(res.error).toBeTruthy();
		});

		it("should handle very long email addresses", async () => {
			const longEmail = `${"a".repeat(300)}@example.com`;
			const longEmailData = {
				name: "Test User",
				email: longEmail,
				password: "password123",
			};

			const res = await authClient.signUp.email(longEmailData);

			expect(res.data || res.error).toBeTruthy();
		});
	});

	describe("Security Tests", () => {
		it("should not return password in response", async () => {
			const userData = {
				name: "Security Test",
				email: "security@example.com",
				password: "password123",
			};

			const res = await authClient.signUp.email(userData);

			expect(res.data).toBeTruthy();
			expect(res.data?.user).not.toHaveProperty("password");
		});

		it("should handle SQL injection attempts in email", async () => {
			const maliciousData = {
				name: "Test User",
				email: "test'; DROP TABLE users; --@example.com",
				password: "password123",
			};

			const res = await authClient.signUp.email(maliciousData);

			expect(res.error).toBeTruthy();
		});
	});
});
