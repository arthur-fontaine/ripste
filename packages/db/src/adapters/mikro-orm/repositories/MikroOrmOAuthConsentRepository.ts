import type {
	IOAuthConsent,
	IInsertOAuthConsent,
	IUpdateOAuthConsent,
} from "../../../domain/models/IOAuthConsent.ts";
import type { IOAuthConsentRepository } from "../../../domain/ports/repositories/IOAuthConsentRepository.ts";
import { MikroOrmOAuthConsentModel } from "../models/MikroOrmOAuthConsentModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmOAuthConsentRepository
	extends MikroOrmBaseRepository<
		IOAuthConsent,
		IInsertOAuthConsent,
		IUpdateOAuthConsent
	>(MikroOrmOAuthConsentModel)
	implements IOAuthConsentRepository {}
