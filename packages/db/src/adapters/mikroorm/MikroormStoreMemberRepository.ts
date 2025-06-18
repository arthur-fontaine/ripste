import type { IStoreMemberRepository } from "../../domain/ports/IStoreMemberRepository.ts";
import { StoreMemberModel } from "./models/StoreMemberModel.ts";
import { UserModel } from "./models/UserModel.ts";
import { StoreModel } from "./models/StoreModel.ts";
import * as RepoUtils from "./BaseMikroormRepository.ts";
import type { FilterQuery } from "@mikro-orm/core";

const POPULATE_FIELDS = ["user", "store"] as const;

export class MikroormStoreMemberRepository implements IStoreMemberRepository {
	private options: RepoUtils.IMikroormRepositoryOptions;

	constructor(options: RepoUtils.IMikroormRepositoryOptions) {
		this.options = options;
	}

	findById: IStoreMemberRepository["findById"] = async (id) => {
		return await RepoUtils.findById(
			this.options.em,
			StoreMemberModel,
			id,
			POPULATE_FIELDS,
		);
	};

	findMany: IStoreMemberRepository["findMany"] = async (params) => {
		const whereClause: FilterQuery<StoreMemberModel> = {};

		if (params.userId) whereClause.user = { id: params.userId };

		if (params.storeId) whereClause.store = { id: params.storeId };

		if (params.permissionLevel)
			whereClause.permissionLevel = params.permissionLevel;

		if (params.storeOwners !== undefined && params.storeOwners)
			whereClause.permissionLevel = "owner";

		return await RepoUtils.findMany(
			this.options.em,
			StoreMemberModel,
			whereClause,
			POPULATE_FIELDS,
		);
	};

	isUserMemberOfStore: IStoreMemberRepository["isUserMemberOfStore"] = async (
		userId,
		storeId,
	) => {
		const storeMember = await this.options.em.findOne(StoreMemberModel, {
			user: { id: userId },
			store: { id: storeId },
			deletedAt: null,
		});
		return !!storeMember;
	};

	create: IStoreMemberRepository["create"] = async (memberData) => {
		if (!memberData.userId) {
			throw new Error("User is required to create a store member");
		}
		if (!memberData.storeId) {
			throw new Error("Store is required to create a store member");
		}

		const user = await RepoUtils.findRelatedEntity(
			this.options.em,
			UserModel,
			memberData.userId,
			"User",
		);

		const store = await RepoUtils.findRelatedEntity(
			this.options.em,
			StoreModel,
			memberData.storeId,
			"Store",
		);

		const storeMemberModel = new StoreMemberModel({
			permissionLevel: memberData.permissionLevel,
			user: user,
			store: store,
		});

		await this.options.em.persistAndFlush(storeMemberModel);
		return storeMemberModel;
	};

	update: IStoreMemberRepository["update"] = async (id, memberData) => {
		const updateData: Record<string, unknown> = {};

		if (memberData.userId !== undefined) {
			if (memberData.userId === null) {
				throw new Error("User cannot be null for store member");
			}

			const user = await RepoUtils.findRelatedEntity(
				this.options.em,
				UserModel,
				memberData.userId,
				"User",
			);
			updateData["user"] = user;
		}

		if (memberData.storeId !== undefined) {
			if (memberData.storeId === null) {
				throw new Error("Store cannot be null for store member");
			}

			const store = await RepoUtils.findRelatedEntity(
				this.options.em,
				StoreModel,
				memberData.storeId,
				"Store",
			);
			updateData["store"] = store;
		}

		const { userId, storeId, ...otherData } = memberData;
		Object.assign(updateData, RepoUtils.filterUpdateData(otherData));

		return await RepoUtils.updateEntity(
			this.options.em,
			StoreMemberModel,
			id,
			updateData,
			POPULATE_FIELDS,
		);
	};

	delete: IStoreMemberRepository["delete"] = async (id) => {
		await RepoUtils.deleteEntity(this.options.em, StoreMemberModel, id);
	};

	removeUserFromStore: IStoreMemberRepository["removeUserFromStore"] = async (
		userId,
		storeId,
	) => {
		const storeMember = await this.options.em.findOne(StoreMemberModel, {
			user: { id: userId },
			store: { id: storeId },
			deletedAt: null,
		});
		if (!storeMember) {
			return;
		}

		storeMember.deletedAt = new Date();
		await this.options.em.flush();
	};
}
