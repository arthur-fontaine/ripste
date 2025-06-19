import { MikroOrmOauth2ClientModel } from "../models/MikroOrmOauth2ClientModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IOAuth2ClientRepository } from "../../../domain/ports/repositories/IOAuth2ClientRepository.ts";
import type { IOAuth2Client, IOAuth2ClientInsert, IOAuth2ClientUpdate } from "../../../domain/models/OAuth2Client.ts";

export class MikroOrmOauth2ClientRepository
	extends MikroOrmBaseRepository<
		IOAuth2Client,
		IOAuth2ClientInsert,
		IOAuth2ClientUpdate
	>(MikroOrmOauth2ClientModel)
	implements IOAuth2ClientRepository {}
