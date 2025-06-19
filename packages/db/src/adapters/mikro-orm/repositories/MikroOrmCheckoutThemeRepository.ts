import { MikroOrmCheckoutThemeModel } from "../models/MikroOrmCheckoutThemeModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { ICheckoutThemeRepository } from "../../../domain/ports/repositories/ICheckoutThemeRepository.ts";
import type { ICheckoutTheme, ICheckoutThemeInsert, ICheckoutThemeUpdate } from "../../../domain/models/CheckoutTheme.ts";

export class MikroOrmCheckoutThemeRepository
  extends MikroOrmBaseRepository<
    ICheckoutTheme,
    ICheckoutThemeInsert,
    ICheckoutThemeUpdate
  >(MikroOrmCheckoutThemeModel)
  implements ICheckoutThemeRepository { }
