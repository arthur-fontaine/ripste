import { Entity, Property, t, ManyToOne } from "@mikro-orm/core";
import { BaseModel } from "./utils/MikroOrmBaseModel.ts";
import type {
	IThemeCustomization,
	IInsertThemeCustomization,
} from "../../../domain/models/IThemeCustomization.ts";
import { MikroOrmCheckoutThemeModel } from "./MikroOrmCheckoutThemeModel.ts";

@Entity()
export class MikroOrmThemeCustomizationModel
	extends BaseModel
	implements IThemeCustomization
{
	constructor(params: IInsertThemeCustomization) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: t.string })
	customizationType!: "css";

	@Property({ type: t.string, nullable: true })
	content!: string | null;

	@ManyToOne(() => MikroOrmCheckoutThemeModel)
	theme!: MikroOrmCheckoutThemeModel;

	get themeId(): string {
		return this.theme.id;
	}
}
