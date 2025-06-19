import type { IOAuth2Client } from "../models/OAuth2Client.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IOAuth2ClientRepository
	extends IBaseRepository<IOAuth2Client> {}
