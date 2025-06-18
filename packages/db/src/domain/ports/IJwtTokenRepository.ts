import type { JwtToken } from "../models/JwtToken.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IJwtTokenRepository extends IBaseRepository<JwtToken> {}
