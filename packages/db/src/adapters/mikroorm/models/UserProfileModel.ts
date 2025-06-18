import { Entity, OneToOne, Property, t } from "@mikro-orm/core";
import type { IUserProfile } from "../../../domain/models/IUserProfile.ts";
import { BaseModel } from "./BaseModel.ts";
import { UserModel } from "./UserModel.ts";

@Entity()
export class UserProfileModel extends BaseModel implements IUserProfile {
	@Property({ type: t.string })
	firstName: string;

	@Property({ type: t.string })
	lastName: string;

	@Property({ type: t.string, nullable: true })
	phone: string | null;

	@OneToOne({ entity: () => UserModel, mappedBy: "profile", nullable: false })
	user!: UserModel;

	get userId(): string {
		return this.user.id;
	}

	get fullName(): string {
		return `${this.firstName} ${this.lastName}`.trim();
	}

	constructor({
		firstName,
		lastName,
		phone = null,
	}: Pick<UserProfileModel, "firstName" | "lastName"> &
		Partial<Pick<UserProfileModel, "phone">>) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.phone = phone;
	}
}
