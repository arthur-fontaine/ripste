import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

import { apiClient } from "../lib/api.ts";

export const companyRedirect = async (
	to: RouteLocationNormalized,
	_from: RouteLocationNormalized,
	next: NavigationGuardNext,
) => {
	try {
		const publicRoutes = ["/", "/metrics"];

		if (publicRoutes.includes(to.path)) {
			const response = await apiClient.admin.metrics.transactions.$get();
			const metrics = await response.json();
			if (
				"error" in metrics &&
				metrics.error === "User has no associated company"
			) {
				next("/company/create");
			} else {
				next();
			}
		} else {
			next();
		}
	} catch (error) {
		console.error("Company redirect error:", error);
		next();
	}
};
