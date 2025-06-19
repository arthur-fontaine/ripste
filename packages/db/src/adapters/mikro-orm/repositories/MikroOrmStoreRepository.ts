import { MikroOrmStoreModel } from "../models/MikroOrmStoreModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreRepository } from "../../../domain/ports/repositories/IStoreRepository.ts";

export class MikroOrmStoreRepository
	extends MikroOrmBaseRepository(MikroOrmStoreModel)
	implements IStoreRepository {}
