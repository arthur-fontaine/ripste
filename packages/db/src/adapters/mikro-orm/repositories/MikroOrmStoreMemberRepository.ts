import { MikroOrmStoreMemberModel } from "../models/MikroOrmStoreMemberModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreMemberRepository } from "../../../domain/ports/IStoreMemberRepository.ts";

export class MikroOrmStoreMemberRepository
	extends MikroOrmBaseRepository(MikroOrmStoreMemberModel)
	implements IStoreMemberRepository {}
