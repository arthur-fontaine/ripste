import { MikroOrmStoreMemberModel } from "../models/MikroOrmStoreMemberModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreMemberRepository } from "../../../domain/ports/repositories/IStoreMemberRepository.ts";
import type {
	IInsertStoreMember,
	IStoreMember,
	IUpdateStoreMember,
} from "../../../domain/models/IStoreMember.ts";

export class MikroOrmStoreMemberRepository
	extends MikroOrmBaseRepository<
		IStoreMember,
		IInsertStoreMember,
		IUpdateStoreMember
	>(MikroOrmStoreMemberModel)
	implements IStoreMemberRepository {}
