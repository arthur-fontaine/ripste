import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SignUpPage from "../pages/SignUpPage.vue";
import ConsentPage from "../pages/ConsentPage.vue";
import OAuthDemoPage from "../pages/OAuthDemoPage.vue";
import CompanyFormPage from "../pages/CompanyFormPage.vue";
import StoreFormPage from "../pages/StoreFormPage.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: HomePage,
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
		path: "/consent",
		name: "Consent",
		component: ConsentPage,
	},
	{
		path: "/oauth-demo",
		name: "OAuthDemo",
		component: OAuthDemoPage,
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
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
