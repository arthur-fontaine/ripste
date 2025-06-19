import { MikroOrmApiCredentialModel } from "../models/MikroOrmApiCredential.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IApiCredentialRepository } from "../../../domain/ports/IApiCredentialRepository.ts";

export class MikroOrmApiCredentialRepository
	extends MikroOrmBaseRepository(MikroOrmApiCredentialModel)
	implements IApiCredentialRepository {}
