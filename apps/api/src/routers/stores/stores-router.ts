import { createHonoRouter } from "../../utils/create-hono-router.ts";
import { postStoresRoute } from "./routes/post-stores.ts";
import { getStoresRoute } from "./routes/get-stores.ts";
import { getStoreByIdRoute } from "./routes/get-store-by-id.ts";
import { putStoreRoute } from "./routes/put-store.ts";
import { deleteStoreRoute } from "./routes/delete-store.ts";
import { getThemesRoute } from "./routes/get-themes.ts";

export const storesRouter = createHonoRouter()
	.route("/themes", getThemesRoute)
	.route("/", postStoresRoute)
	.route("/", getStoresRoute)
	.route("/", getStoreByIdRoute)
	.route("/", putStoreRoute)
	.route("/", deleteStoreRoute);
