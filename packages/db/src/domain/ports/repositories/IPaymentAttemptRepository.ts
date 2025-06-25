import type {
	IInsertPaymentAttempt,
	IPaymentAttempt,
	IUpdatePaymentAttempt,
} from "../../models/IPaymentAttempt.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IPaymentAttemptRepository
	extends IBaseRepository<
		IPaymentAttempt,
		IInsertPaymentAttempt,
		IUpdatePaymentAttempt
	> {}
