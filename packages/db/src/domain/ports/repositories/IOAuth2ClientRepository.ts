import type {
	IOAuth2Client,
	IOAuth2ClientInsert,
	IOAuth2ClientUpdate,
} from "../../models/OAuth2Client.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IOAuth2ClientRepository
	extends IBaseRepository<
		IOAuth2Client,
		IOAuth2ClientInsert,
		IOAuth2ClientUpdate
	> {}
