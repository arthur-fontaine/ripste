import type { IInsertJwks, IJwks, IUpdateJwks } from "../../models/IJwks.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IJwksRepository
	extends IBaseRepository<IJwks, IInsertJwks, IUpdateJwks> {}
