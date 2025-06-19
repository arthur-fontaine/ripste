import { MikroOrmStoreStatusModel } from "../models/MikroOrmStoreStatusModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IStoreStatusRepository } from "../../../domain/ports/IStoreStatusRepository.ts";

export class MikroOrmStoreStatusRepository
	extends MikroOrmBaseRepository(MikroOrmStoreStatusModel)
	implements IStoreStatusRepository {}
