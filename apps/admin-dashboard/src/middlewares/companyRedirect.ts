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
			//TODO: Check if user is logged in
			const response = await apiClient.admin.metrics.transactions.$get();
			if (!response.json()) {
				next("/company/create");
			} else {
				next();
			}
			next();
		} else {
			next();
		}
	} catch (error) {
		console.error("Company redirect error:", error);
		next();
	}
};
