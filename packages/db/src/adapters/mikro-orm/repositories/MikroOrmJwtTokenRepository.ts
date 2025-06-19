import { MikroOrmJwtTokenModel } from "../models/MikroOrmJwtTokenModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IJwtTokenRepository } from "../../../domain/ports/repositories/IJwtTokenRepository.ts";
import type {
	IJwtToken,
	IJwtTokenInsert,
	IJwtTokenUpdate,
} from "../../../domain/models/JwtToken.ts";

export class MikroOrmJwtTokenRepository
	extends MikroOrmBaseRepository<IJwtToken, IJwtTokenInsert, IJwtTokenUpdate>(
		MikroOrmJwtTokenModel,
	)
	implements IJwtTokenRepository {}
