import type {
	IInsertSession,
	IUpdateSession,
	ISession,
} from "../../../domain/models/ISession.ts";
import type { ISessionRepository } from "../../../domain/ports/repositories/ISessionRepository.ts";
import { MikroOrmSessionModel } from "../models/MikroOrmSessionModel.ts";
import { MikroOrmUserModel } from "../models/MikroOrmUserModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { EntityManager } from "@mikro-orm/core";

export class MikroOrmSessionRepository
	extends MikroOrmBaseRepository<ISession, IInsertSession, IUpdateSession>(
		MikroOrmSessionModel,
	)
	implements ISessionRepository {
	
	constructor(options: { em: EntityManager }) {
		super(options);
		this.insert = async (entity: IInsertSession): Promise<ISession> => {
			const { userId, ...sessionData } = entity;
			const newSession = this.em.create(MikroOrmSessionModel, sessionData as never);
			const userRef = this.em.getReference(MikroOrmUserModel, userId);
			newSession.user = userRef as any;

			await this.em.persistAndFlush(newSession);
			return newSession;
		};
	}
}
