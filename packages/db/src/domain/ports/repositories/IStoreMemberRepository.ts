import type {
	IStoreMember,
	IInsertStoreMember,
	IUpdateStoreMember,
} from "../../models/IStoreMember.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IStoreMemberRepository
	extends IBaseRepository<
		IStoreMember,
		IInsertStoreMember,
		IUpdateStoreMember
	> {}
