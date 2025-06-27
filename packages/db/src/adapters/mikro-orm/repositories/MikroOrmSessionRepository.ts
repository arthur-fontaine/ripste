import type {
	IInsertSession,
	IUpdateSession,
	ISession,
} from "../../../domain/models/ISession.ts";
import type { ISessionRepository } from "../../../domain/ports/repositories/ISessionRepository.ts";
import { MikroOrmSessionModel } from "../models/MikroOrmSessionModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmSessionRepository
	extends MikroOrmBaseRepository<ISession, IInsertSession, IUpdateSession>(
		MikroOrmSessionModel,
	)
	implements ISessionRepository {}
