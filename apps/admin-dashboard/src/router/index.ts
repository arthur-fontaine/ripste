import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SignUpPage from "../pages/SignUpPage.vue";
import ConsentPage from "../pages/ConsentPage.vue";
import OAuthDemoPage from "../pages/OAuthDemoPage.vue";

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
	// Alias pour /sign-in (utilisé par l'OIDC provider)
	{
		path: "/sign-in",
		redirect: "/login",
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
