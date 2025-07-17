import { ResendEmailService } from "./services/email/index.ts";
import type { EmailService } from "./services/email/index.ts";

const RESEND_API_KEY = process.env["RESEND_API_KEY"];
const FROM_EMAIL = process.env["FROM_EMAIL"] || "noreply@ripste.com";
const FROM_NAME = process.env["FROM_NAME"] || "Ripste";

console.log("📧 Initialisation du service d'email avec Resend", {
	apiKey: RESEND_API_KEY ? "✅" : "❌",
	fromEmail: FROM_EMAIL,
	fromName: FROM_NAME,
});

let emailService: EmailService;

if (!RESEND_API_KEY && process.env["NODE_ENV"] === "test") {
	emailService = {
		async sendRegistrationConfirmation() {
			console.log("Mock: sendRegistrationConfirmation called");
		},
		async sendPlatformAcceptance() {
			console.log("Mock: sendPlatformAcceptance called");
		},
		async sendPlatformRejection() {
			console.log("Mock: sendPlatformRejection called");
		},
		async sendCustomEmail() {
			console.log("Mock: sendCustomEmail called");
		},
	};
} else {
	if (!RESEND_API_KEY) {
		throw new Error("RESEND_API_KEY environment variable is required");
	}

	emailService = new ResendEmailService({
		apiKey: RESEND_API_KEY,
		fromEmail: FROM_EMAIL,
		fromName: FROM_NAME,
	});
}

export { emailService };
