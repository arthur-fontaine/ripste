import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/products",
			name: "products",
			component: () => import("../views/ProductsView.vue"),
		},
		{
			path: "/product/:id",
			name: "product",
			component: () => import("../views/ProductView.vue"),
			props: true,
		},
		{
			path: "/category/:category",
			name: "category",
			component: () => import("../views/ProductsView.vue"),
			props: true,
		},
		{
			path: "/cart",
			name: "cart",
			component: () => import("../views/CartView.vue"),
			props: true,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "not-found",
			component: NotFoundView,
		},
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}

		return { top: 0 };
	},
});

export default router;
