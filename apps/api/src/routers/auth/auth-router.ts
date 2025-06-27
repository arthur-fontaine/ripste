import { Hono } from "hono";

export const authRouter = new Hono().get("/", (c) => {
    return c.json({ message: "Hello from authRouter!" });
});
