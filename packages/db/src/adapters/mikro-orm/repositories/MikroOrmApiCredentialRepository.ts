import { MikroOrmApiCredentialModel } from "../models/MikroOrmApiCredential.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IApiCredentialRepository } from "../../../domain/ports/repositories/IApiCredentialRepository.ts";
import type {
	IApiCredential,
	IApiCredentialInsert,
	IApiCredentialUpdate,
} from "../../../domain/models/ApiCredential.ts";

export class MikroOrmApiCredentialRepository
	extends MikroOrmBaseRepository<
		IApiCredential,
		IApiCredentialInsert,
		IApiCredentialUpdate
	>(MikroOrmApiCredentialModel)
	implements IApiCredentialRepository {}
