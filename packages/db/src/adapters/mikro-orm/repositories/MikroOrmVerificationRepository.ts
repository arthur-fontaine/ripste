import type {
	IInsertVerification,
	IUpdateVerification,
	IVerification,
} from "../../../domain/models/IVerification.ts";
import type { IVerificationRepository } from "../../../domain/ports/repositories/IVerificationRepository.ts";
import { MikroOrmVerificationModel } from "../models/MikroOrmVerificationModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmVerificationRepository
	extends MikroOrmBaseRepository<
		IVerification,
		IInsertVerification,
		IUpdateVerification
	>(MikroOrmVerificationModel)
	implements IVerificationRepository {}
