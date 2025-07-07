import { betterAuth } from "better-auth";
import { customDatabaseAdapter } from "./better-auth-adapter.ts";
import { database } from "./database.ts";

export const auth = betterAuth({
	basePath: "/auth",
	database: customDatabaseAdapter(database).createAdapter(),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
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

export default auth;
