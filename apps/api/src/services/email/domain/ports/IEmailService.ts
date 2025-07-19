import type { IPlatformAcceptanceData } from "./IPlatformAcceptanceData.ts";
import type { IPlatformRejectionData } from "./IPlatformRejectionData.ts";
import type { IRegistrationConfirmationData } from "./IRegistrationConfirmationData.ts";
import type { IEmailTemplate } from "./IEmailTemplate.ts";

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

	/**
	 * Envoie un email personnalisé
	 */
	sendCustomEmail(template: IEmailTemplate): Promise<void>;
}
