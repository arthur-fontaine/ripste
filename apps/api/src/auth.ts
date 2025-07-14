import { betterAuth } from "better-auth";
import { createCustomDatabaseAdapterWithMappings } from "./better-auth-adapter.ts";
import { oidcProvider, openAPI } from "better-auth/plugins";
import { database } from "./database.ts";

export const auth = betterAuth({
	basePath: "/auth",
	database: createCustomDatabaseAdapterWithMappings(
		database,
		{},
		{
			debugLogs: {
				isRunningAdapterTests: false,
			},
		},
	).createAdapter(),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
	plugins: [
		oidcProvider({
			loginPage: "/sign-in",
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
