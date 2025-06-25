import type {
	IJwtToken,
	IInsertJwtToken,
	IUpdateJwtToken,
} from "../../models/IJwtToken.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IJwtTokenRepository
	extends IBaseRepository<IJwtToken, IInsertJwtToken, IUpdateJwtToken> {}
