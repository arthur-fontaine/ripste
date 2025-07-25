import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: `${process.env["RIPSTE_API_URL"] || "http://localhost:3000"}/auth`,
	plugins: [jwtClient()],
});
