import { MikroOrmStoreMemberModel } from "../models/MikroOrmStoreMemberModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreMemberRepository } from "../../../domain/ports/repositories/IStoreMemberRepository.ts";
import type {
	IStoreMember,
	IStoreMemberInsert,
	IStoreMemberUpdate,
} from "../../../domain/models/StoreMember.ts";

export class MikroOrmStoreMemberRepository
	extends MikroOrmBaseRepository<
		IStoreMember,
		IStoreMemberInsert,
		IStoreMemberUpdate
	>(MikroOrmStoreMemberModel)
	implements IStoreMemberRepository {}
