import { MikroOrmRefundModel } from "../models/MikroOrmRefundModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IRefundRepository } from "../../../domain/ports/repositories/IRefundRepository.ts";
import type {
	IRefund,
	IRefundInsert,
	IRefundUpdate,
} from "../../../domain/models/Refund.ts";

export class MikroOrmRefundRepository
	extends MikroOrmBaseRepository<IRefund, IRefundInsert, IRefundUpdate>(
		MikroOrmRefundModel,
	)
	implements IRefundRepository {}
