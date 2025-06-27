import { betterAuth } from "better-auth";
import { customDatabaseAdapter } from "./better-auth-adapter.ts";
import { createDatabaseInstance } from "./database.ts";

export const auth = betterAuth({
	database: customDatabaseAdapter(createDatabaseInstance()).createAdapter(),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // remove after testing
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "lax",
			secure: process.env["NODE_ENV"] === "production",
		},
	},
});
