import { MikroOrmOauth2ClientModel } from "../models/MikroOrmOauth2ClientModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IOAuth2ClientRepository } from "../../../domain/ports/repositories/IOAuth2ClientRepository.ts";
import type {
	IInsertOAuth2Client,
	IOAuth2Client,
	IUpdateOAuth2Client,
} from "../../../domain/models/IOAuth2Client.ts";

export class MikroOrmOauth2ClientRepository
	extends MikroOrmBaseRepository<
		IOAuth2Client,
		IInsertOAuth2Client,
		IUpdateOAuth2Client
	>(MikroOrmOauth2ClientModel)
	implements IOAuth2ClientRepository {}
