import { SqliteDriver } from "@mikro-orm/sqlite";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import { testClient } from "hono/testing";
import { vi } from "vitest";

export async function getApiClient() {
  vi.mock("../../src/database.ts", async () => ({
    database: await MikroOrmDatabase.create(SqliteDriver, ":memory:"),
  }));

  const { app } = await import("../../src/app.ts");
  
  return { apiClient: testClient(app), app };
}