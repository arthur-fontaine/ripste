export interface EmailTemplate {
	to: string;
	subject: string;
	htmlContent: string;
	textContent?: string;
}

export interface RegistrationConfirmationData {
	userEmail: string;
	userName: string;
	confirmationUrl: string;
}

export interface PlatformAcceptanceData {
	userEmail: string;
	userName: string;
	loginUrl: string;
}

export interface PlatformRejectionData {
	userEmail: string;
	userName: string;
	reason?: string;
	supportEmail: string;
}

export interface EmailService {
	/**
	 * Envoie un email de confirmation d'inscription
	 */
	sendRegistrationConfirmation(
		data: RegistrationConfirmationData,
	): Promise<void>;

	/**
	 * Envoie un email d'acceptation sur la plateforme
	 */
	sendPlatformAcceptance(data: PlatformAcceptanceData): Promise<void>;

	/**
	 * Envoie un email de refus sur la plateforme
	 */
	sendPlatformRejection(data: PlatformRejectionData): Promise<void>;

	/**
	 * Envoie un email personnalisé
	 */
	sendCustomEmail(template: EmailTemplate): Promise<void>;
}
