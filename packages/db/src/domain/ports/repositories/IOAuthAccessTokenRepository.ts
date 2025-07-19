import type {
	IOAuthAccessToken,
	IInsertOAuthAccessToken,
	IUpdateOAuthAccessToken,
} from "../../models/IOAuthAccessToken.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IOAuthAccessTokenRepository
	extends IBaseRepository<
		IOAuthAccessToken,
		IInsertOAuthAccessToken,
		IUpdateOAuthAccessToken
	> {}
