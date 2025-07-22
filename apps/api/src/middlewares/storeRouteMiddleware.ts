
import type { MiddlewareHandler } from "hono";
import type { IStore } from "@ripste/db/mikro-orm";
import type { ProtectedRouteContext } from "./protectedRouteMiddleware.ts";
import { database } from "../database.ts";

interface StoreRouteContext extends ProtectedRouteContext {
  Variables: {
    store: NonNullable<IStore>;
  } & ProtectedRouteContext["Variables"];
}

export const storeRouteMiddleware: MiddlewareHandler<StoreRouteContext> = async (
  c,
  next,
) => {
  const storeMembers = await database.storeMember.findMany({
    user: { id: c.get("user").id },
  });
  const store = storeMembers[0]?.store;

  if (!store) {
    return c.json(
      { error: "User is not a member of any store." },
      403,
    );
  }

  c.set("store", store);

  return next();
};
