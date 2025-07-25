import type {
	IInsertJwks,
	IJwks,
	IUpdateJwks,
} from "../../../domain/models/IJwks.ts";
import type { IJwksRepository } from "../../../domain/ports/repositories/IJwksRepository.ts";
import { MikroOrmJwksModel } from "../models/MikroOrmJwksModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmJwksRepository
	extends MikroOrmBaseRepository<IJwks, IInsertJwks, IUpdateJwks>(
		MikroOrmJwksModel,
	)
	implements IJwksRepository {}
