import crypto from "node:crypto";
import { PrimaryKey, Property, t, type EntityManager } from "@mikro-orm/core";

export abstract class BaseModel {
	_loadEm: (() => EntityManager) | null = null;

	/** @deprecated */
	get _em(): EntityManager {
		const loadEm = this._loadEm || Object.getPrototypeOf(this)._loadEm;
		if (!loadEm) throw new Error("EntityManager is not set");
		return loadEm();
	}

	@PrimaryKey({ type: t.uuid })
	id: string = crypto.randomUUID();

	@Property({ type: t.datetime, onCreate: () => new Date() })
	createdAt = new Date();

	@Property({ type: t.datetime, onUpdate: () => new Date(), nullable: true })
	updatedAt: Date | null = new Date();

	@Property({ type: t.datetime, nullable: true })
	deletedAt: Date | null = null;
}
