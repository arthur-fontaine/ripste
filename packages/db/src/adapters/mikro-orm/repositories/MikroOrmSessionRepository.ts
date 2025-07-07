import type {
	IInsertSession,
	IUpdateSession,
	ISession,
} from "../../../domain/models/ISession.ts";
import type { ISessionRepository } from "../../../domain/ports/repositories/ISessionRepository.ts";
import { MikroOrmSessionModel } from "../models/MikroOrmSessionModel.ts";
import { MikroOrmUserModel } from "../models/MikroOrmUserModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import { Reference, type EntityManager } from "@mikro-orm/core";

export class MikroOrmSessionRepository
	extends MikroOrmBaseRepository<ISession, IInsertSession, IUpdateSession>(
		MikroOrmSessionModel,
	)
	implements ISessionRepository
{
	constructor(options: { em: EntityManager }) {
		super(options);
		this.insert = async (entity: IInsertSession): Promise<ISession> => {
			const { userId, ...sessionData } = entity;
			const newSession = this._em.create(
				MikroOrmSessionModel,
				sessionData as never,
			);
			const userRef = this._em.getReference(MikroOrmUserModel, userId);
			newSession.user = Reference.create(userRef);

			await this._em.persistAndFlush(newSession);
			return newSession;
		};
	}
}
