import type {
	IOAuthApplication,
	IInsertOAuthApplication,
	IUpdateOAuthApplication,
} from "../../models/IOAuthApplication.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IOAuthApplicationRepository
	extends IBaseRepository<
		IOAuthApplication,
		IInsertOAuthApplication,
		IUpdateOAuthApplication
	> {
	findOneByClientId(clientId: string): Promise<IOAuthApplication | null>;
}
