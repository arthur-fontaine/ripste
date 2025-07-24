import { Hono } from "hono";
import { stubRouter } from "./routers/stub/stubRouter.ts";

export const app = new Hono().route("/stub", stubRouter);
