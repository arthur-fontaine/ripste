import { SqliteDriver } from "@mikro-orm/sqlite";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";

export const database = await MikroOrmDatabase.create(SqliteDriver, "test.db")
