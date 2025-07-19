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
	implements IOAuthApplicationRepository
{
	async findOneByClientId(clientId: string): Promise<IOAuthApplication | null> {
		const entity = await this._em.findOne(MikroOrmOAuthApplicationModel, {
			clientId,
			deletedAt: null,
		});
		return entity || null;
	}
}
