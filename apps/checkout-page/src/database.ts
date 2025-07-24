import "dotenv/config";

import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

const dbName = process.env["POSTGRES_DB"] || "ripste";
const options = {
	host: process.env["POSTGRES_HOST"] || "localhost",
	port: Number(process.env["POSTGRES_PORT"]) || 5432,
	user: process.env["POSTGRES_USER"] || "ripste",
	password: process.env["POSTGRES_PASSWORD"] || "your_secure_password_here",
	debug: process.env["NODE_ENV"] !== "production",
	allowGlobalContext: true,
	forceEntityConstructor: true,
};

export const database = await MikroOrmDatabase.create(
	PostgreSqlDriver,
	dbName,
	options,
);
