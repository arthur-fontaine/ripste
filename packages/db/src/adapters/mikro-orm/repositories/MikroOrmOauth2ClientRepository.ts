import { MikroOrmOauth2ClientModel } from "../models/MikroOrmOauth2ClientModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IOAuth2ClientRepository } from "../../../domain/ports/repositories/IOAuth2ClientRepository.ts";

export class MikroOrmOauth2ClientRepository
	extends MikroOrmBaseRepository(MikroOrmOauth2ClientModel)
	implements IOAuth2ClientRepository {}
