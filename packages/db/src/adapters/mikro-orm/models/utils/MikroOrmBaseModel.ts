import crypto from "node:crypto";
import { PrimaryKey, Property, t } from "@mikro-orm/core";

export abstract class BaseModel {
	@PrimaryKey({ type: t.uuid })
	id: string = crypto.randomUUID();

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date(), nullable: true })
	updatedAt: Date | null = new Date();

	@Property({ type: t.datetime, nullable: true })
	deletedAt: Date | null = null;
}
