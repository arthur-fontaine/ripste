import vue from "@vitejs/plugin-vue";
import ssr from "vite-plugin-ssr/plugin";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [vue(), ssr()],
};

export default config;
