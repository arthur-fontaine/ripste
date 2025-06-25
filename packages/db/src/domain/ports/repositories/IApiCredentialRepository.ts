import type {
	IApiCredential,
	IInsertApiCredential,
	IUpdateApiCredential,
} from "../../models/IApiCredential.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IApiCredentialRepository
	extends IBaseRepository<
		IApiCredential,
		IInsertApiCredential,
		IUpdateApiCredential
	> {}
