import { MikroOrmJwtTokenModel } from "../models/MikroOrmJwtTokenModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IJwtTokenRepository } from "../../../domain/ports/IJwtTokenRepository.ts";

export class MikroOrmJwtTokenRepository
	extends MikroOrmBaseRepository(MikroOrmJwtTokenModel)
	implements IJwtTokenRepository {}
