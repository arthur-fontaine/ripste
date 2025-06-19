import type {
	IApiCredential,
	IApiCredentialInsert,
	IApiCredentialUpdate,
} from "../../models/ApiCredential.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IApiCredentialRepository
	extends IBaseRepository<
		IApiCredential,
		IApiCredentialInsert,
		IApiCredentialUpdate
	> {}
