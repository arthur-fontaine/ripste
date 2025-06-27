import { testClient } from "hono/testing";
import { describe, it, expect } from "vitest";
import { app } from "./app.ts";

describe("Auth Endpoint", () => {
    const client = testClient(app);

    it("should return auth message", async () => {
        const res = await client.auth.$get();

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            message: "Hello from authRouter!",
        });
    });
});