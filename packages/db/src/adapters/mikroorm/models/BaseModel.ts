import { PrimaryKey, Property, t } from "@mikro-orm/core";

export abstract class BaseModel {
	@PrimaryKey({ type: t.uuid, defaultRaw: "gen_random_uuid()" })
	declare id: string;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();
}
