import { MikroOrmApiCredentialModel } from "../models/MikroOrmApiCredentialModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type {
	IApiCredential,
	IInsertApiCredential,
	IUpdateApiCredential,
} from "../../../domain/models/IApiCredential.ts";
import type { IApiCredentialRepository } from "../../../domain/ports/repositories/IApiCredentialRepository.ts";

export class MikroOrmApiCredentialRepository
	extends MikroOrmBaseRepository<
		IApiCredential,
		IInsertApiCredential,
		IUpdateApiCredential
	>(MikroOrmApiCredentialModel)
	implements IApiCredentialRepository {}
