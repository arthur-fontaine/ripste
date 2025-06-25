import { MikroOrmStoreStatusModel } from "../models/MikroOrmStoreStatusModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreStatusRepository } from "../../../domain/ports/repositories/IStoreStatusRepository.ts";
import type {
	IStoreStatus,
	IInsertStoreStatus,
	IUpdateStoreStatus,
} from "../../../domain/models/IStoreStatus.ts";

export class MikroOrmStoreStatusRepository
	extends MikroOrmBaseRepository<
		IStoreStatus,
		IInsertStoreStatus,
		IUpdateStoreStatus
	>(MikroOrmStoreStatusModel)
	implements IStoreStatusRepository {}
