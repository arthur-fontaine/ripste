import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { IUserRepository } from "../../domain/ports/IUserRepository.ts";
import { UserModel } from "./models/UserModel.ts";
import type { IUser } from "../../domain/models/IUser.ts";
import { UserProfileModel } from "./models/UserProfileModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = ["profile"] as const;

interface IMikroormUserRepositoryOptions {
	em: EntityManager;
}

export class MikroormUserRepository implements IUserRepository {
	private options: IMikroormUserRepositoryOptions;

	constructor(options: IMikroormUserRepositoryOptions) {
		this.options = options;
	}

	findById: IUserRepository["findById"] = async (id) => {
		return RepoUtils.findById<IUser, UserModel>(
			this.options.em,
			UserModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IUserRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<UserModel> = {};

		if (params.email) whereClause.email = params.email;
		if (params.permissionLevel)
			whereClause.permissionLevel = params.permissionLevel;
		if (params.emailVerified !== undefined)
			whereClause.emailVerified = params.emailVerified;

		return RepoUtils.findMany<IUser, UserModel>(
			this.options.em,
			UserModel,
			whereClause,
			POPULATE_FIELDS,
		);
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
		return RepoUtils.updateEntity<IUser, UserModel>(
			this.options.em,
			UserModel,
			id,
			RepoUtils.filterUpdateData(userData),
			POPULATE_FIELDS,
		);
	};

	delete: IUserRepository["delete"] = async (id) => {
		return RepoUtils.deleteEntity<IUser, UserModel>(
			this.options.em,
			UserModel,
			id,
		);
	};

	hardDelete: IUserRepository["hardDelete"] = async (id) => {
		return RepoUtils.hardDeleteEntity(this.options.em, UserModel, id);
	};
}
