import type { EntityManager } from "@mikro-orm/core";
import type { IUserRepository } from "../../domain/ports/IUserRepository.ts";
import { UserModel } from "./models/UserModel.ts";
import type { IUser } from "../../domain/models/IUser.ts";
import { UserProfileModel } from "./models/UserProfileModel.ts";

interface IMikroormUserRepositoryOptions {
	em: EntityManager;
}

export class MikroormUserRepository implements IUserRepository {
	private options: IMikroormUserRepositoryOptions;

	constructor(options: IMikroormUserRepositoryOptions) {
		this.options = options;
	}

	findById: IUserRepository["findById"] = async (id) => {
		const user = await this.options.em.findOne(
			UserModel,
			{ id },
			{
				populate: ["profile"],
			},
		);
		return user;
	};

	findByEmail: IUserRepository["findByEmail"] = async (email) => {
		const user = await this.options.em.findOne(
			UserModel,
			{ email },
			{
				populate: ["profile"],
			},
		);
		return user;
	};

	create: IUserRepository["create"] = async (user) => {
		const userModel = new UserModel({
			email: user.email,
			passwordHash: user.passwordHash,
		});
		await this.options.em.persistAndFlush(userModel);
		return userModel;
	};

	createWithProfile: IUserRepository["createWithProfile"] = async (
		userData,
		profileData,
	) => {
		const userModel = new UserModel({
			email: userData.email,
			passwordHash: userData.passwordHash,
			emailVerified: userData.emailVerified,
			permissionLevel: userData.permissionLevel,
		});

		await this.options.em.persistAndFlush(userModel);

		if (profileData) {
			const profileModel = new UserProfileModel({
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				phone: profileData.phone,
			});
			profileModel.user = userModel;
			await this.options.em.persistAndFlush(profileModel);
			userModel.profile = profileModel;
		}

		return userModel;
	};

	update: IUserRepository["update"] = async (id, userData) => {
		const user = await this.options.em.findOne(
			UserModel,
			{ id },
			{
				populate: ["profile"],
			},
		);
		if (!user) {
			throw new Error(`User with id ${id} not found`);
		}

		this.options.em.assign(user, userData);
		await this.options.em.flush();
		return user as IUser;
	};

	delete: IUserRepository["delete"] = async (id) => {
		const user = await this.options.em.findOne(UserModel, { id });
		if (!user) {
			return;
		}

		await this.options.em.removeAndFlush(user);
	};

	softDelete: IUserRepository["softDelete"] = async (id) => {
		const user = await this.options.em.findOne(UserModel, { id });
		if (!user) {
			return;
		}

		user.deletedAt = new Date();
		await this.options.em.flush();
	};
}
