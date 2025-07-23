import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { authClient } from "../lib/auth.ts";

export const authGuard = async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
) => {
    const session = authClient.useSession();
    
    const publicRoutes = ["/login", "/signup"];
    
    if (publicRoutes.includes(to.path)) {
        if (session.value.data) {
            next("/");
        } else {
            next();
        }
    } else {
        if (!session.value.data) {
            next("/login");
        } else {
            next();
        }
    }
};