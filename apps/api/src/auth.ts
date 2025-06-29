import { betterAuth } from "better-auth";
import { customDatabaseAdapter } from "./better-auth-adapter.ts";
import { getDatabaseConnection } from "./database.ts";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
	if (!authInstance) {
		const db = await getDatabaseConnection();
		authInstance = betterAuth({
			database: customDatabaseAdapter(db).createAdapter(),
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
	}
	return authInstance;
}

export const auth = {
	get handler() {
		return getAuth().then((auth) => auth.handler);
	},
};
