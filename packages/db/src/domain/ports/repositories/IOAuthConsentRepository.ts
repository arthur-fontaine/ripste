import type {
	IOAuthConsent,
	IInsertOAuthConsent,
	IUpdateOAuthConsent,
} from "../../models/IOAuthConsent.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IOAuthConsentRepository
	extends IBaseRepository<
		IOAuthConsent,
		IInsertOAuthConsent,
		IUpdateOAuthConsent
	> {}
