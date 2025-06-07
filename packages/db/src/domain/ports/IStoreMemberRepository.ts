import type {
	IInsertStoreMember,
	IStoreMember,
} from "../models/IStoreMember.ts";

export interface IStoreMemberRepository {
	findById(id: string): Promise<IStoreMember | null>;
	findByUserId(userId: string): Promise<IStoreMember[]>;
	findByStoreId(storeId: string): Promise<IStoreMember[]>;
	findByUserAndStore(
		userId: string,
		storeId: string,
	): Promise<IStoreMember | null>;
	findByPermissionLevel(permissionLevel: "owner"): Promise<IStoreMember[]>;
	findStoreOwners(storeId: string): Promise<IStoreMember[]>;
	isUserMemberOfStore(userId: string, storeId: string): Promise<boolean>;
	create(memberData: IInsertStoreMember): Promise<IStoreMember>;
	update(id: string, memberData: IInsertStoreMember): Promise<IStoreMember>;
	delete(id: string): Promise<void>;
	removeUserFromStore(userId: string, storeId: string): Promise<void>;
}
