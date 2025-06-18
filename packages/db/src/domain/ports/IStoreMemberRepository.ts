import type {
	IInsertStoreMember,
	IStoreMember,
} from "../models/IStoreMember.ts";

export interface IStoreMemberRepository {
	findById(id: string): Promise<IStoreMember | null>;
	findMany(params: {
		userId?: string;
		storeId?: string;
		permissionLevel?: "owner";
		storeOwners?: boolean;
	}): Promise<IStoreMember[]>;
	isUserMemberOfStore(userId: string, storeId: string): Promise<boolean>;
	create(memberData: IInsertStoreMember): Promise<IStoreMember>;
	update(id: string, memberData: IInsertStoreMember): Promise<IStoreMember>;
	delete(id: string): Promise<void>;
	removeUserFromStore(userId: string, storeId: string): Promise<void>;
}
