import type { Config } from "vike/types";
import vikeServer from "vike-server/config";

export const config = {
	extends: [vikeServer],
	server: "src/server/index.ts",
} satisfies Config;
