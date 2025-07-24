import { hc } from "hono/client";
import type { App } from "./app.ts";

export function createApiClient(baseUrl: string) {
	return hc<App>(baseUrl, {
		init: {
			credentials: "include",
		},
	});
}
