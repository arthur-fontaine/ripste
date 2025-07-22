import type { IPlatformAcceptanceData } from "../models/IPlatformAcceptanceData.ts";
import type { IPlatformRejectionData } from "../models/IPlatformRejectionData.ts";
import type { IRegistrationConfirmationData } from "../models/IRegistrationConfirmationData.ts";

export interface IEmailService {
	/**
	 * Envoie un email de confirmation d'inscription
	 */
	sendRegistrationConfirmation(
		data: IRegistrationConfirmationData,
	): Promise<void>;

	/**
	 * Envoie un email d'acceptation sur la plateforme
	 */
	sendPlatformAcceptance(data: IPlatformAcceptanceData): Promise<void>;

	/**
	 * Envoie un email de refus sur la plateforme
	 */
	sendPlatformRejection(data: IPlatformRejectionData): Promise<void>;
}
