import { Hono } from "hono";
import type { auth } from "../auth.ts";

export const createHonoRouter = () => new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>()
