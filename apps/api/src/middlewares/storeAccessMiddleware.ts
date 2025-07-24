import type { MiddlewareHandler } from "hono";
import type { IStore } from "@ripste/db/mikro-orm";
import type { ProtectedRouteContext } from "./protectedRouteMiddleware.ts";
import { database } from "../database.ts";

interface StoreAccessMiddlewareContext extends ProtectedRouteContext {
	Variables: {
		store: NonNullable<IStore>;
		userStorePermission: "owner";
	} & ProtectedRouteContext["Variables"];
}

export const storeAccessMiddleware: MiddlewareHandler<
	StoreAccessMiddlewareContext
> = async (c, next) => {
	const storeId = c.req.param("id");

	if (!storeId) {
		return c.json({ error: "Store ID is required" }, 400);
	}

	const storeMembers = await database.storeMember.findMany({
		user: { id: c.get("user").id },
		store: { id: storeId },
	});

	if (storeMembers.length === 0) {
		return c.json({ error: "Store not found or access denied" }, 404);
	}

	const storeMember = storeMembers[0];
	if (!storeMember || !storeMember.store) {
		return c.json({ error: "Store not found" }, 404);
	}

	c.set("store", storeMember.store);
	c.set("userStorePermission", storeMember.permissionLevel as "owner");

	return next();
};

export const storeOwnerMiddleware: MiddlewareHandler<
	StoreAccessMiddlewareContext
> = async (c, next) => {
	const storeId = c.req.param("id");

	if (!storeId) {
		return c.json({ error: "Store ID is required" }, 400);
	}

	const storeMembers = await database.storeMember.findMany({
		user: { id: c.get("user").id },
		store: { id: storeId },
		permissionLevel: "owner",
	});

	if (storeMembers.length === 0) {
		return c.json(
			{ error: "Store not found or insufficient permissions" },
			403,
		);
	}

	const storeMember = storeMembers[0];
	if (!storeMember || !storeMember.store) {
		return c.json({ error: "Store not found" }, 404);
	}

	c.set("store", storeMember.store);
	c.set("userStorePermission", storeMember.permissionLevel as "owner");

	return next();
};
