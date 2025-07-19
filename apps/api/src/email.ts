import { ResendEmailService } from "./services/email/index.ts";

const RESEND_API_KEY = process.env["RESEND_API_KEY"];
const FROM_EMAIL = process.env["FROM_EMAIL"] || "noreply@ripste.com";
const FROM_NAME = process.env["FROM_NAME"] || "Ripste";

if (!RESEND_API_KEY) {
	throw new Error("RESEND_API_KEY environment variable is required");
}

const emailService: ResendEmailService = new ResendEmailService({
	apiKey: RESEND_API_KEY,
	fromEmail: FROM_EMAIL,
	fromName: FROM_NAME,
});

export { emailService };
