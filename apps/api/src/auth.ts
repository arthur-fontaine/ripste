import { betterAuth } from "better-auth";
import { customDatabaseAdapter } from "./better-auth-adapter.ts";
import { database } from "./database.ts";
import type { MiddlewareHandler } from "hono";

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

export const authMiddleware: MiddlewareHandler = async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
};
