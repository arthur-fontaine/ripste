import vikeVue from "vike-vue/config";
import vikeVuePinia from "vike-vue-pinia/config";
import type { Config } from "vike/types";
import Layout from "../layouts/LayoutDefault.vue";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
	// https://vike.dev/Layout
	Layout,

	// https://vike.dev/head-tags
	title: "My Vike App",
	description: "Demo showcasing Vike",

	extends: [vikeVue, vikeVuePinia],
} satisfies Config;
