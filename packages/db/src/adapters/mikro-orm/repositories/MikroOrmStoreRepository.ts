import { MikroOrmStoreModel } from "../models/MikroOrmStoreModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreRepository } from "../../../domain/ports/repositories/IStoreRepository.ts";
import type { IStore, IStoreInsert, IStoreUpdate } from "../../../domain/models/Store.ts";

export class MikroOrmStoreRepository
	extends MikroOrmBaseRepository<
		IStore,
		IStoreInsert,
		IStoreUpdate
	>(MikroOrmStoreModel)
	implements IStoreRepository {}
