import { MikroOrmStoreStatusModel } from "../models/MikroOrmStoreStatusModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreStatusRepository } from "../../../domain/ports/repositories/IStoreStatusRepository.ts";
import type {
	IStoreStatus,
	IStoreStatusInsert,
	IStoreStatusUpdate,
} from "../../../domain/models/StoreStatus.ts";

export class MikroOrmStoreStatusRepository
	extends MikroOrmBaseRepository<
		IStoreStatus,
		IStoreStatusInsert,
		IStoreStatusUpdate
	>(MikroOrmStoreStatusModel)
	implements IStoreStatusRepository {}
