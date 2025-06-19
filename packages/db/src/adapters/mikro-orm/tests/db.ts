/// <reference types="vite/client" />

import { MikroOrmDatabase } from "../MikroOrmDatabase.ts";
import { MikroORM, type EntityClass } from "@mikro-orm/sqlite";

const entityModules = import.meta.glob("../models/*.ts");
const entities = (
	await Promise.all(
		Object.values(entityModules)
			.map(
				(module) =>
					module() as Promise<{ [key: string]: EntityClass<unknown> }>,
			)
			.map((mod) => mod.then((m) => Object.values(m)[0])),
	)
).filter((entity) => entity !== undefined);

const orm = await MikroORM.init({
	dbName: ":memory:",
	entities,
});

await orm.schema.refreshDatabase();

export const em = orm.em.fork();

export const db = new MikroOrmDatabase(em);
