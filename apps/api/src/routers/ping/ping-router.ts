import { Hono } from "hono";

export const pingRouter = new Hono()
  .get("/", (c) => {
    return c.json({ message: "pong" });
  });
