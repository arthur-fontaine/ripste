import { MikroOrmRefundModel } from "../models/MikroOrmRefundModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IRefundRepository } from "../../../domain/ports/repositories/IRefundRepository.ts";
import type {
	IInsertRefund,
	IRefund,
	IUpdateRefund,
} from "../../../domain/models/IRefund.ts";

export class MikroOrmRefundRepository
	extends MikroOrmBaseRepository<IRefund, IInsertRefund, IUpdateRefund>(
		MikroOrmRefundModel,
	)
	implements IRefundRepository {}
