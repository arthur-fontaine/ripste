import { betterAuth } from "better-auth";
import { customDatabaseAdapter } from "./better-auth-adapter.ts";
import { database } from "./database.ts";
import type * as Hono from "hono";
import { openAPI } from "better-auth/plugins"

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
	plugins: [openAPI()],
});

export interface AuthContext extends Hono.Env {
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null
	}
}

export const authMiddleware: Hono.MiddlewareHandler<AuthContext> = async (c, next) => {
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
