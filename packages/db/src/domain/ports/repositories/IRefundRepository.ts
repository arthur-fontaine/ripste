import type {
	IRefund,
	IInsertRefund,
	IUpdateRefund,
} from "../../models/IRefund.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IRefundRepository
	extends IBaseRepository<IRefund, IInsertRefund, IUpdateRefund> {}
