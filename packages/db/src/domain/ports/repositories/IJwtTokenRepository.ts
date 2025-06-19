import type { IJwtToken, IJwtTokenInsert, IJwtTokenUpdate } from "../../models/JwtToken.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IJwtTokenRepository extends IBaseRepository<IJwtToken, IJwtTokenInsert, IJwtTokenUpdate> {}
