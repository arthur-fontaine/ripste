import { betterAuth } from "better-auth";
import { createCustomDatabaseAdapterWithMappings } from "./better-auth-adapter.ts";
import { oidcProvider, openAPI } from "better-auth/plugins";
import { database } from "./database.ts";

export const auth = betterAuth({
	basePath: "/auth",
	database: createCustomDatabaseAdapterWithMappings(
		database,
		{},
	).createAdapter(),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	trustedOrigins: (
		process.env["ALLOWED_ORIGINS"] ||
		"http://localhost:5173,http://localhost:3000"
	).split(","),
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
	plugins: [
		oidcProvider({
			loginPage:
				process.env["OIDC_LOGIN_PAGE"] || "http://localhost:5173/login",
			consentPage:
				process.env["OIDC_CONSENT_PAGE"] || "http://localhost:5173/consent",
		}),
		openAPI(),
	],
	advanced: {
		defaultCookieAttributes: {
			sameSite: "lax",
			secure: process.env["NODE_ENV"] === "production",
		},
	},
});

export default auth;
