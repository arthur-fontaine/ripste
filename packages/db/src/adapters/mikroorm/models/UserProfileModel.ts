import { Entity, OneToOne, Property, t } from "@mikro-orm/core";
import type { IUserProfile } from "../../../domain/models/IUserProfile.ts";
import { BaseModel } from "./BaseModel.ts";
import { UserModel } from "./UserModel.ts";

@Entity()
export class UserProfileModel extends BaseModel implements IUserProfile {
	@Property({ type: t.string })
	firstName: string | null;

	@Property({ type: t.string })
	lastName: string | null;

	@Property({ type: t.string, nullable: true })
	phone: string | null;

	@OneToOne({ entity: () => UserModel, mappedBy: "profile", nullable: false })
	declare user: IUserProfile["user"];

	get userId(): string {
		return this.user.id;
	}

	get fullName(): string {
		return `${this.firstName} ${this.lastName}`.trim();
	}

	constructor({
		firstName,
		lastName,
		phone,
	}: Pick<UserProfileModel, "firstName" | "lastName" | "phone">) {
		super();
		this.firstName = firstName ?? null;
		this.lastName = lastName ?? null;
		this.phone = phone ?? null;
	}
}
