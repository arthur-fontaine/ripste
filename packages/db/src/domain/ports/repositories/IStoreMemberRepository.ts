import type {
	IStoreMember,
	IStoreMemberInsert,
	IStoreMemberUpdate,
} from "../../models/StoreMember.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IStoreMemberRepository
	extends IBaseRepository<
		IStoreMember,
		IStoreMemberInsert,
		IStoreMemberUpdate
	> {}
