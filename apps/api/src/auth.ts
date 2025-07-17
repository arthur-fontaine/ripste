import { betterAuth } from "better-auth";
import { customDatabaseAdapter } from "./better-auth-adapter.ts";
import { database } from "./database.ts";
import { emailService } from "./email.ts";

export const auth = betterAuth({
	basePath: "/auth",
	database: customDatabaseAdapter(database).createAdapter(),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendEmailVerificationOnSignUp: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await emailService.sendRegistrationConfirmation({
				userEmail: user.email,
				userName: user.name || user.email,
				confirmationUrl: url,
			});
		},
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
