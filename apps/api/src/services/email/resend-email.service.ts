import { Resend } from "resend";
import type {
	EmailService,
	EmailTemplate,
	RegistrationConfirmationData,
	PlatformAcceptanceData,
	PlatformRejectionData,
} from "./email-service.interface.ts";
import {
	registrationConfirmation,
	platformAcceptance,
	platformRejection,
} from "./email-templates.ts";
export interface ResendEmailServiceConfig {
	apiKey: string;
	fromEmail: string;
	fromName?: string;
}

interface ResendEmailData {
	from: string;
	to: string;
	subject: string;
	html: string;
	text?: string;
}

export class ResendEmailService implements EmailService {
	private resend: Resend;
	private fromEmail: string;
	private fromName: string;

	constructor(config: ResendEmailServiceConfig) {
		this.resend = new Resend(config.apiKey);
		this.fromEmail = config.fromEmail;
		this.fromName = config.fromName || "Ripste";
	}

	async sendRegistrationConfirmation(
		data: RegistrationConfirmationData,
	): Promise<void> {
		const template = registrationConfirmation(data);

		await this.sendEmail({
			to: data.userEmail,
			subject: template.subject,
			htmlContent: template.html,
			textContent: template.text,
		});
	}

	async sendPlatformAcceptance(data: PlatformAcceptanceData): Promise<void> {
		const template = platformAcceptance(data);

		await this.sendEmail({
			to: data.userEmail,
			subject: template.subject,
			htmlContent: template.html,
			textContent: template.text,
		});
	}

	async sendPlatformRejection(data: PlatformRejectionData): Promise<void> {
		const template = platformRejection(data);

		await this.sendEmail({
			to: data.userEmail,
			subject: template.subject,
			htmlContent: template.html,
			textContent: template.text,
		});
	}

	async sendCustomEmail(template: EmailTemplate): Promise<void> {
		await this.sendEmail(template);
	}

	private async sendEmail(template: EmailTemplate): Promise<void> {
		try {
			const emailData: ResendEmailData = {
				from: `${this.fromName} <${this.fromEmail}>`,
				to: template.to,
				subject: template.subject,
				html: template.htmlContent,
			};

			if (template.textContent) {
				emailData.text = template.textContent;
			}

			const result = await this.resend.emails.send(emailData);

			if (result.error) {
				throw new Error(`Failed to send email: ${result.error.message}`);
			}
		} catch (error) {
			console.error("Error sending email:", error);
			throw new Error(
				`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}
