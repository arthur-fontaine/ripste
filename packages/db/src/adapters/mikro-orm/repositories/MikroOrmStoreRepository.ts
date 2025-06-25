import { MikroOrmStoreModel } from "../models/MikroOrmStoreModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreRepository } from "../../../domain/ports/repositories/IStoreRepository.ts";
import type {
	IInsertStore,
	IStore,
	IUpdateStore,
} from "../../../domain/models/IStore.ts";

export class MikroOrmStoreRepository
	extends MikroOrmBaseRepository<IStore, IInsertStore, IUpdateStore>(
		MikroOrmStoreModel,
	)
	implements IStoreRepository {}
