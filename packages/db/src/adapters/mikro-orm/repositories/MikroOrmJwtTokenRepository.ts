import { MikroOrmJwtTokenModel } from "../models/MikroOrmJwtTokenModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IJwtTokenRepository } from "../../../domain/ports/repositories/IJwtTokenRepository.ts";
import type {
	IInsertJwtToken,
	IJwtToken,
	IUpdateJwtToken,
} from "../../../domain/models/IJwtToken.ts";

export class MikroOrmJwtTokenRepository
	extends MikroOrmBaseRepository<IJwtToken, IInsertJwtToken, IUpdateJwtToken>(
		MikroOrmJwtTokenModel,
	)
	implements IJwtTokenRepository {}
