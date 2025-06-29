import type { IBaseRepository } from "./utils/IBaseRepository.ts";
import type {
	ISession,
	IInsertSession,
	IUpdateSession,
} from "../../models/ISession.ts";

export interface ISessionRepository
	extends IBaseRepository<ISession, IInsertSession, IUpdateSession> {}
