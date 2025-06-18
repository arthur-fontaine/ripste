import type { FilterQuery } from "@mikro-orm/core";
import type { IUserProfileRepository } from "../../domain/ports/IUserProfileRepository.ts";
import type { IUserProfile } from "../../domain/models/IUserProfile.ts";
import { UserProfileModel } from "./models/UserProfileModel.ts";
import { UserModel } from "./models/UserModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";

const POPULATE_FIELDS = ["user"] as const;

export class MikroormUserProfileRepository implements IUserProfileRepository {
	private options: RepoUtils.IMikroormRepositoryOptions;

	constructor(options: RepoUtils.IMikroormRepositoryOptions) {
		this.options = options;
	}

	findById: IUserProfileRepository["findById"] = async (id) => {
		return RepoUtils.findById<IUserProfile, UserProfileModel>(
			this.options.em,
			UserProfileModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IUserProfileRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<UserProfileModel> = {};

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

		return RepoUtils.findMany<IUserProfile, UserProfileModel>(
			this.options.em,
			UserProfileModel,
			whereClause,
			POPULATE_FIELDS,
		);
	};

	create: IUserProfileRepository["create"] = async (profileData) => {
		const user = await RepoUtils.findRelatedEntity(
			this.options.em,
			UserModel,
			profileData.userId,
			"User",
		);

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
		const updateData: Record<string, unknown> = {};

		if (profileData.userId !== undefined) {
			const user = await RepoUtils.findRelatedEntity(
				this.options.em,
				UserModel,
				profileData.userId,
				"User",
			);
			updateData["user"] = user;
		}

		const { userId, ...otherData } = profileData;
		Object.assign(updateData, RepoUtils.filterUpdateData(otherData));

		return RepoUtils.updateEntity<IUserProfile, UserProfileModel>(
			this.options.em,
			UserProfileModel,
			id,
			updateData,
			POPULATE_FIELDS,
		);
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
		const filteredUpdateData = RepoUtils.filterUpdateData(updateData);

		this.options.em.assign(profile, filteredUpdateData);
		await this.options.em.flush();
		return profile as IUserProfile;
	};

	delete: IUserProfileRepository["delete"] = async (id) => {
		await RepoUtils.deleteEntity(this.options.em, UserProfileModel, id);
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
