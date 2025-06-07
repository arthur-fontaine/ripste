import type {
	IInsertOAuth2Client,
	IOAuth2Client,
} from "../models/IOAuth2Client.ts";

export interface IOAuth2ClientRepository {
	findById(id: string): Promise<IOAuth2Client | null>;
	findByClientId(clientId: string): Promise<IOAuth2Client | null>;
	findByCredentialId(credentialId: string): Promise<IOAuth2Client | null>;
	create(clientData: IInsertOAuth2Client): Promise<IOAuth2Client>;
	update(id: string, clientData: IInsertOAuth2Client): Promise<IOAuth2Client>;
	delete(id: string): Promise<void>;
	deleteByCredentialId(credentialId: string): Promise<void>;
}
