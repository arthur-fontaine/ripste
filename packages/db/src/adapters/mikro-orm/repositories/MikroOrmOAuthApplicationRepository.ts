import type {
	IOAuthApplication,
	IInsertOAuthApplication,
	IUpdateOAuthApplication,
} from "../../../domain/models/IOAuthApplication.ts";
import type { IOAuthApplicationRepository } from "../../../domain/ports/repositories/IOAuthApplicationRepository.ts";
import { MikroOrmOAuthApplicationModel } from "../models/MikroOrmOAuthApplicationModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmOAuthApplicationRepository
	extends MikroOrmBaseRepository<
		IOAuthApplication,
		IInsertOAuthApplication,
		IUpdateOAuthApplication
	>(MikroOrmOAuthApplicationModel)
	implements IOAuthApplicationRepository {}
