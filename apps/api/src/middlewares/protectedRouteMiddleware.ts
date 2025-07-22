import type { MiddlewareHandler } from "hono";
import type { AuthContext } from "./authMiddleware.ts";

export interface ProtectedRouteContext extends AuthContext {
	Variables: {
		user: NonNullable<AuthContext["Variables"]["user"]>;
		session: NonNullable<AuthContext["Variables"]["session"]>;
	} & AuthContext["Variables"];
}

export const protectedRouteMiddleware: MiddlewareHandler<ProtectedRouteContext> = async (
	c,
	next,
) => {
	const user = c.get("user");
	const session = c.get("session");

	if (!user || !session) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	return next();
};
