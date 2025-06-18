import type { Insertable } from "../../types/insertable.ts";
import type { IJwtToken } from "./IJwtToken.ts";
import type { IOAuth2Client } from "./IOAuth2Client.ts";
import type { IStore } from "./IStore.ts";
import type { ITransaction } from "./ITransaction.ts";
import type { IUser } from "./IUser.ts";

export interface IApiCredential {
	id: string;
	name: string;
	credentialType: "jwt" | "oauth2";
	isActive: boolean;
	createdBy: string;
	createdAt: Date;
	expiresAt: Date | null;
	lastUsedAt: Date | null;
	deletedAt: Date | null;

	store: IStore | null;
	createdByUser: IUser | null;
	jwtToken: IJwtToken | null;
	oauth2Client: IOAuth2Client | null;
	transactions: ITransaction[];
}

export type IInsertApiCredential = Insertable<
	IApiCredential,
	"store" | "createdByUser" | "jwtToken" | "oauth2Client" | "transactions"
> & {
	storeId: IStore["id"];
	createdByUserId: IUser["id"] | null;
	jwtTokenId?: IJwtToken["id"] | null;
	oauth2ClientId?: IOAuth2Client["id"] | null;
};
