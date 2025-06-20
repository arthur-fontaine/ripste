import { Hono } from "hono";
import { pingRouter } from "./routers/ping/ping-router.ts";

export const app = new Hono().route("/psp-api/ping", pingRouter);
