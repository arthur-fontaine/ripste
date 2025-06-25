import type {
	IOAuth2Client,
	IInsertOAuth2Client,
	IUpdateOAuth2Client,
} from "../../models/IOAuth2Client.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IOAuth2ClientRepository
	extends IBaseRepository<
		IOAuth2Client,
		IInsertOAuth2Client,
		IUpdateOAuth2Client
	> {}
