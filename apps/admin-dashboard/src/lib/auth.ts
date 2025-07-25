import { createAuthClient } from "better-auth/vue";
import { oidcClient } from "better-auth/client/plugins";
import { apiUrl } from "./apiUrl.ts";

export const authClient = createAuthClient({
	baseURL: `${apiUrl}/auth`,
	plugins: [oidcClient()],
});
