import type {
	IOAuthAccessToken,
	IInsertOAuthAccessToken,
	IUpdateOAuthAccessToken,
} from "../../../domain/models/IOAuthAccessToken.ts";
import type { IOAuthAccessTokenRepository } from "../../../domain/ports/repositories/IOAuthAccessTokenRepository.ts";
import { MikroOrmOAuthAccessTokenModel } from "../models/MikroOrmOAuthAccessTokenModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmOAuthAccessTokenRepository
	extends MikroOrmBaseRepository<
		IOAuthAccessToken,
		IInsertOAuthAccessToken,
		IUpdateOAuthAccessToken
	>(MikroOrmOAuthAccessTokenModel)
	implements IOAuthAccessTokenRepository {}
