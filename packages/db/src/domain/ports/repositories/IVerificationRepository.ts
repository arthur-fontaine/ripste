import type { IBaseRepository } from "./utils/IBaseRepository.ts";
import type {
	IVerification,
	IInsertVerification,
	IUpdateVerification,
} from "../../models/IVerification.ts";

export interface IVerificationRepository
	extends IBaseRepository<
		IVerification,
		IInsertVerification,
		IUpdateVerification
	> {}
