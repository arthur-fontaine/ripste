import { hc } from "hono/client";
import type { App } from "./app.ts";

export function createPspClient(baseUrl: string) {
	return hc<App>(baseUrl);
}
