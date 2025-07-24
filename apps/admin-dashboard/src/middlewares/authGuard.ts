import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { authClient } from "../lib/auth.ts";

export const authGuard = async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
) => {
    try {
        const session = await authClient.getSession();

        const publicRoutes = ["/login", "/signup"];

        if (publicRoutes.includes(to.path)) {
            if (session.data) {
                next("/");
            } else {
                next();
            }
        } else {
            if (!session.data) {
                next("/login");
            } else {
                next();
            }
        }
    } catch (error) {
        console.error("Auth guard error:", error);

        if (!["/login", "/signup"].includes(to.path)) {
            next("/login");
        } else {
            next();
        }
    }
};