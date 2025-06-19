import { MikroOrmRefundModel } from "../models/MikroOrmRefundModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IRefundRepository } from "../../../domain/ports/repositories/IRefundRepository.ts";

export class MikroOrmRefundRepository
	extends MikroOrmBaseRepository(MikroOrmRefundModel)
	implements IRefundRepository {}
