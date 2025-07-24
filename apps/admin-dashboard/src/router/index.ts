import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SignUpPage from "../pages/SignUpPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import ConsentPage from "../pages/ConsentPage.vue";
import OAuthDemoPage from "../pages/OAuthDemoPage.vue";
import CompanyFormPage from "../pages/CompanyFormPage.vue";
import StoreFormPage from "../pages/StoreFormPage.vue";
import { authGuard } from "../middlewares/authGuard.ts";
import {companyRedirect} from "../middlewares/companyRedirect.js";

const routes = [
	{
		path: "/",
		name: "Home",
		component: HomePage,
		meta: { requiresAuth: true },
	},
	{
		path: "/login",
		name: "Login",
		component: LoginPage,
	},
	{
		path: "/signup",
		name: "SignUp",
		component: SignUpPage,
	},
	{
		path: "/profile",
		name: "Profile",
		component: ProfilePage,
		meta: { requiresAuth: true },
	},
	{
		path: "/consent",
		name: "Consent",
		component: ConsentPage,
	},
	{
		path: "/oauth-demo",
		name: "OAuthDemo",
		component: OAuthDemoPage,
		meta: { requiresAuth: true },
	},
	{
		path: "/company/create",
		name: "CreateCompany",
		component: CompanyFormPage,
	},
	{
		path: "/store/create",
		name: "CreateStore",
		component: StoreFormPage,
	},
	{
		path: "/metrics",
		name: "AdminMetrics",
		component: () => import("../pages/AdminMetrics.vue"),
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(authGuard);
router.beforeEach(companyRedirect);

export default router;
