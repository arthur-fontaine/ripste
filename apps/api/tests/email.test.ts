import { describe, it, expect, beforeEach, vi } from "vitest";
import { ResendEmailService } from "../src/services/email/resend-email.service.ts";
import type { EmailTemplate } from "../src/services/email/email-service.interface.ts";

vi.mock("resend", () => ({
	Resend: vi.fn().mockImplementation(() => ({
		emails: {
			send: vi.fn(),
		},
	})),
}));

describe("ResendEmailService", () => {
	let emailService: ResendEmailService;
	let mockResendSend: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.clearAllMocks();

		emailService = new ResendEmailService({
			apiKey: "test-api-key",
			fromEmail: "test@example.com",
			fromName: "Test Service",
		});

		// @ts-expect-error - Accessing private property for testing
		mockResendSend = emailService.resend.emails.send;
	});

	describe("sendRegistrationConfirmation", () => {
		it("should send registration confirmation email", async () => {
			mockResendSend.mockResolvedValue({ data: { id: "email-id" } });

			await emailService.sendRegistrationConfirmation({
				userEmail: "user@example.com",
				userName: "John Doe",
				confirmationUrl: "https://example.com/confirm",
			});

			expect(mockResendSend).toHaveBeenCalledWith({
				from: "Test Service <test@example.com>",
				to: "user@example.com",
				subject: "Confirmez votre inscription - Ripste",
				html: expect.stringContaining("John Doe"),
				text: expect.stringContaining("John Doe"),
			});
		});

		it("should handle resend errors", async () => {
			mockResendSend.mockResolvedValue({
				error: { message: "Invalid API key" },
			});

			await expect(
				emailService.sendRegistrationConfirmation({
					userEmail: "user@example.com",
					userName: "John Doe",
					confirmationUrl: "https://example.com/confirm",
				}),
			).rejects.toThrow("Failed to send email: Invalid API key");
		});
	});

	describe("sendPlatformAcceptance", () => {
		it("should send platform acceptance email", async () => {
			mockResendSend.mockResolvedValue({ data: { id: "email-id" } });

			await emailService.sendPlatformAcceptance({
				userEmail: "user@example.com",
				userName: "John Doe",
				loginUrl: "https://example.com/login",
			});

			expect(mockResendSend).toHaveBeenCalledWith({
				from: "Test Service <test@example.com>",
				to: "user@example.com",
				subject:
					"Félicitations ! Votre accès à la plateforme Ripste a été approuvé",
				html: expect.stringContaining("John Doe"),
				text: expect.stringContaining("John Doe"),
			});
		});
	});

	describe("sendPlatformRejection", () => {
		it("should send platform rejection email", async () => {
			mockResendSend.mockResolvedValue({ data: { id: "email-id" } });

			await emailService.sendPlatformRejection({
				userEmail: "user@example.com",
				userName: "John Doe",
				reason: "Incomplete information",
				supportEmail: "support@example.com",
			});

			expect(mockResendSend).toHaveBeenCalledWith({
				from: "Test Service <test@example.com>",
				to: "user@example.com",
				subject: "Mise à jour de votre demande d'accès - Ripste",
				html: expect.stringContaining("John Doe"),
				text: expect.stringContaining("John Doe"),
			});
		});
	});

	describe("sendCustomEmail", () => {
		it("should send custom email", async () => {
			mockResendSend.mockResolvedValue({ data: { id: "email-id" } });

			const template: EmailTemplate = {
				to: "user@example.com",
				subject: "Custom Subject",
				htmlContent: "<h1>Custom Content</h1>",
				textContent: "Custom Content",
			};

			await emailService.sendCustomEmail(template);

			expect(mockResendSend).toHaveBeenCalledWith({
				from: "Test Service <test@example.com>",
				to: "user@example.com",
				subject: "Custom Subject",
				html: "<h1>Custom Content</h1>",
				text: "Custom Content",
			});
		});

		it("should send custom email without text content", async () => {
			mockResendSend.mockResolvedValue({ data: { id: "email-id" } });

			const template: EmailTemplate = {
				to: "user@example.com",
				subject: "Custom Subject",
				htmlContent: "<h1>Custom Content</h1>",
			};

			await emailService.sendCustomEmail(template);

			expect(mockResendSend).toHaveBeenCalledWith({
				from: "Test Service <test@example.com>",
				to: "user@example.com",
				subject: "Custom Subject",
				html: "<h1>Custom Content</h1>",
			});
		});
	});
});
