import type * as Hono from "hono";
import { auth } from "../auth.ts";

export interface AuthContext extends Hono.Env {
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
	Bindings?: {
		test?: { headers: Headers } | undefined;
	};
}

export const authMiddleware: Hono.MiddlewareHandler<AuthContext> = async (
	c,
	next,
) => {
	const headers = c.env?.test?.headers ?? c.req.raw.headers;

	const session = await auth.api.getSession({ headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
};
