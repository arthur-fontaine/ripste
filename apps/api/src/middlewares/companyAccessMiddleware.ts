import type { MiddlewareHandler } from "hono";
import type { ICompany } from "@ripste/db/mikro-orm";
import type { ProtectedRouteContext } from "./protectedRouteMiddleware.ts";
import { database } from "../database.ts";

interface CompanyAccessMiddlewareContext extends ProtectedRouteContext {
	Variables: {
		company: NonNullable<ICompany>;
	} & ProtectedRouteContext["Variables"];
}

export const companyAccessMiddleware: MiddlewareHandler<
	CompanyAccessMiddlewareContext
> = async (c, next) => {
	const companyId = c.req.param("id");

	if (!companyId) {
		return c.json({ error: "Company ID is required" }, 400);
	}

	const company = await database.company.findOne(companyId);

	if (!company) {
		return c.json({ error: "Company not found" }, 404);
	}

	if (company.userId !== c.get("user").id) {
		return c.json({ error: "Company not found or access denied" }, 404);
	}

	c.set("company", company);

	return next();
};

export const companyOwnerFromUserMiddleware: MiddlewareHandler<
	CompanyAccessMiddlewareContext
> = async (c, next) => {
	const user = c.get("user");

	const userWithCompany = await database.user.findOne(user.id);

	if (!userWithCompany || !userWithCompany.companyId) {
		return c.json({ error: "No company associated with this user" }, 404);
	}

	const company = await database.company.findOne(userWithCompany.companyId);

	if (!company) {
		return c.json({ error: "Company not found" }, 404);
	}

	c.set("company", company);

	return next();
};
