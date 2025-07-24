/// <reference types="vite/client" />

import type { EntityManager } from "@mikro-orm/core";
import { MikroOrmDatabase } from "../MikroOrmDatabase.ts";
import { MikroORM, type EntityClass } from "@mikro-orm/sqlite";

// biome-ignore lint/style/useConst: We need to declare it here to access it in loadModels
export let em: EntityManager;

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
)
	.filter((entity) => entity !== undefined)
	.map((modelClass) => {
		modelClass.prototype._loadEm = () => em;
		return modelClass;
	});

const orm = await MikroORM.init({
	dbName: ":memory:",
	entities,
});

await orm.schema.refreshDatabase();

em = orm.em.fork();

export const db = new MikroOrmDatabase(em);
