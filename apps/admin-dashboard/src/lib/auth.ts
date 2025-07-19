import { createAuthClient } from "better-auth/vue";
import { oidcClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000/auth",
	plugins: [oidcClient()],
});
