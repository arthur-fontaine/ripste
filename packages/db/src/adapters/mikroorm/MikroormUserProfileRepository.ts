import type { EntityManager, FilterQuery } from "@mikro-orm/core";
import type { IUserProfileRepository } from "../../domain/ports/IUserProfileRepository.ts";
import type { IUserProfile } from "../../domain/models/IUserProfile.ts";
import { UserProfileModel } from "./models/UserProfileModel.ts";
import { UserModel } from "./models/UserModel.ts";

interface IMikroormUserProfileRepositoryOptions {
	em: EntityManager;
}

export class MikroormUserProfileRepository implements IUserProfileRepository {
	private options: IMikroormUserProfileRepositoryOptions;

	constructor(options: IMikroormUserProfileRepositoryOptions) {
		this.options = options;
	}

	findById: IUserProfileRepository["findById"] = async (id) => {
		const profile = await this.options.em.findOne(
			UserProfileModel,
			{
				id,
				deletedAt: null,
			},
			{
				populate: ["user"],
			},
		);
		return profile;
	};

	findMany: IUserProfileRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<UserProfileModel> = {
			deletedAt: null,
		};

		if (params.userId) whereClause.user = { id: params.userId };

		if (params.phone) whereClause.phone = params.phone;

		if (params.firstName) whereClause.firstName = params.firstName;

		if (params.lastName) whereClause.lastName = params.lastName;

		if (params.searchTerm) {
			whereClause.$or = [
				{ firstName: { $ilike: `%${params.searchTerm}%` } },
				{ lastName: { $ilike: `%${params.searchTerm}%` } },
			];
		}

		const profiles = await this.options.em.find(UserProfileModel, whereClause, {
			populate: ["user"],
		});
		return profiles;
	};

	create: IUserProfileRepository["create"] = async (profileData) => {
		const user = await this.options.em.findOne(UserModel, {
			id: profileData.userId,
		});
		if (!user) {
			throw new Error(`User with id ${profileData.userId} not found`);
		}

		const profileModel = new UserProfileModel({
			firstName: profileData.firstName,
			lastName: profileData.lastName,
			phone: profileData.phone,
		});

		profileModel.user = user;

		await this.options.em.persistAndFlush(profileModel);
		return profileModel;
	};

	update: IUserProfileRepository["update"] = async (id, profileData) => {
		const profile = await this.options.em.findOne(UserProfileModel, {
			id,
			deletedAt: null,
		});
		if (!profile) {
			throw new Error(`UserProfile with id ${id} not found`);
		}

		if (profileData.userId !== undefined) {
			const user = await this.options.em.findOne(UserModel, {
				id: profileData.userId,
			});
			if (!user) {
				throw new Error(`User with id ${profileData.userId} not found`);
			}
			profile.user = user;
		}

		const { userId, ...updateData } = profileData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(profile, filteredUpdateData);
		await this.options.em.flush();
		return profile as IUserProfile;
	};

	updateByUserId: IUserProfileRepository["updateByUserId"] = async (
		userId,
		profileData,
	) => {
		const profile = await this.options.em.findOne(UserProfileModel, {
			user: { id: userId },
			deletedAt: null,
		});
		if (!profile) {
			throw new Error(`UserProfile for user ${userId} not found`);
		}

		const { userId: _, ...updateData } = profileData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(profile, filteredUpdateData);
		await this.options.em.flush();
		return profile as IUserProfile;
	};

	delete: IUserProfileRepository["delete"] = async (id) => {
		const profile = await this.options.em.findOne(UserProfileModel, {
			id,
			deletedAt: null,
		});
		if (!profile) {
			return;
		}

		profile.deletedAt = new Date();
		await this.options.em.flush();
	};

	deleteByUserId: IUserProfileRepository["deleteByUserId"] = async (userId) => {
		const profile = await this.options.em.findOne(UserProfileModel, {
			user: { id: userId },
			deletedAt: null,
		});
		if (!profile) {
			return;
		}

		profile.deletedAt = new Date();
		await this.options.em.flush();
	};
}
