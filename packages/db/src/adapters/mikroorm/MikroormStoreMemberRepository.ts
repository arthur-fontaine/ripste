import type { EntityManager } from "@mikro-orm/core";
import type { IStoreMemberRepository } from "../../domain/ports/IStoreMemberRepository.ts";
import type { IStoreMember } from "../../domain/models/IStoreMember.ts";
import { StoreMemberModel } from "./models/StoreMemberModel.ts";
import { UserModel } from "./models/UserModel.ts";
import { StoreModel } from "./models/StoreModel.ts";

interface IMikroormStoreMemberRepositoryOptions {
	em: EntityManager;
}

export class MikroormStoreMemberRepository implements IStoreMemberRepository {
	private options: IMikroormStoreMemberRepositoryOptions;

	constructor(options: IMikroormStoreMemberRepositoryOptions) {
		this.options = options;
	}

	findById: IStoreMemberRepository["findById"] = async (id) => {
		const storeMember = await this.options.em.findOne(
			StoreMemberModel,
			{ id },
			{
				populate: ["user", "store"],
			},
		);
		return storeMember;
	};

	findByUserId: IStoreMemberRepository["findByUserId"] = async (userId) => {
		const storeMembers = await this.options.em.find(
			StoreMemberModel,
			{
				user: { id: userId },
			},
			{
				populate: ["user", "store"],
			},
		);
		return storeMembers;
	};

	findByStoreId: IStoreMemberRepository["findByStoreId"] = async (storeId) => {
		const storeMembers = await this.options.em.find(
			StoreMemberModel,
			{
				store: { id: storeId },
			},
			{
				populate: ["user", "store"],
			},
		);
		return storeMembers;
	};

	findByUserAndStore: IStoreMemberRepository["findByUserAndStore"] = async (
		userId,
		storeId,
	) => {
		const storeMember = await this.options.em.findOne(
			StoreMemberModel,
			{
				user: { id: userId },
				store: { id: storeId },
			},
			{
				populate: ["user", "store"],
			},
		);
		return storeMember;
	};

	findByPermissionLevel: IStoreMemberRepository["findByPermissionLevel"] =
		async (permissionLevel) => {
			const storeMembers = await this.options.em.find(
				StoreMemberModel,
				{
					permissionLevel,
				},
				{
					populate: ["user", "store"],
				},
			);
			return storeMembers;
		};

	findStoreOwners: IStoreMemberRepository["findStoreOwners"] = async (
		storeId,
	) => {
		const storeOwners = await this.options.em.find(
			StoreMemberModel,
			{
				store: { id: storeId },
				permissionLevel: "owner",
			},
			{
				populate: ["user", "store"],
			},
		);
		return storeOwners;
	};

	isUserMemberOfStore: IStoreMemberRepository["isUserMemberOfStore"] = async (
		userId,
		storeId,
	) => {
		const storeMember = await this.options.em.findOne(StoreMemberModel, {
			user: { id: userId },
			store: { id: storeId },
		});
		return !!storeMember;
	};

	create: IStoreMemberRepository["create"] = async (memberData) => {
		let user: UserModel | null = null;
		if (memberData.userId) {
			user = await this.options.em.findOne(UserModel, {
				id: memberData.userId,
			});
			if (!user) {
				throw new Error(`User with id ${memberData.userId} not found`);
			}
		}

		let store: StoreModel | null = null;
		if (memberData.storeId) {
			store = await this.options.em.findOne(StoreModel, {
				id: memberData.storeId,
			});
			if (!store) {
				throw new Error(`Store with id ${memberData.storeId} not found`);
			}
		}

		if (!user) {
			throw new Error("User is required to create a store member");
		}
		if (!store) {
			throw new Error("Store is required to create a store member");
		}

		const storeMemberModel = new StoreMemberModel({
			permissionLevel: memberData.permissionLevel,
			user: user,
			store: store,
		});

		await this.options.em.persistAndFlush(storeMemberModel);
		return storeMemberModel;
	};

	update: IStoreMemberRepository["update"] = async (id, memberData) => {
		const storeMember = await this.options.em.findOne(StoreMemberModel, { id });
		if (!storeMember) {
			throw new Error(`StoreMember with id ${id} not found`);
		}

		if (memberData.userId !== undefined) {
			if (memberData.userId === null) {
				throw new Error("User cannot be null for store member");
			}

			const user = await this.options.em.findOne(UserModel, {
				id: memberData.userId,
			});
			if (!user) {
				throw new Error(`User with id ${memberData.userId} not found`);
			}
			storeMember.user = user;
		}

		if (memberData.storeId !== undefined) {
			if (memberData.storeId === null) {
				throw new Error("Store cannot be null for store member");
			}

			const store = await this.options.em.findOne(StoreModel, {
				id: memberData.storeId,
			});
			if (!store) {
				throw new Error(`Store with id ${memberData.storeId} not found`);
			}
			storeMember.store = store;
		}

		const { userId, storeId, ...updateData } = memberData;
		const filteredUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, value]) => value !== undefined),
		);

		this.options.em.assign(storeMember, filteredUpdateData);
		await this.options.em.flush();
		return storeMember as IStoreMember;
	};

	delete: IStoreMemberRepository["delete"] = async (id) => {
		const storeMember = await this.options.em.findOne(StoreMemberModel, { id });
		if (!storeMember) {
			return;
		}

		await this.options.em.removeAndFlush(storeMember);
	};

	removeUserFromStore: IStoreMemberRepository["removeUserFromStore"] = async (
		userId,
		storeId,
	) => {
		const storeMember = await this.options.em.findOne(StoreMemberModel, {
			user: { id: userId },
			store: { id: storeId },
		});
		if (!storeMember) {
			return;
		}

		await this.options.em.removeAndFlush(storeMember);
	};
}
