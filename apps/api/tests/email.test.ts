import { describe, it, expect, beforeEach, vi } from "vitest";
import {
	ResendEmailService,
	type IEmailTemplate,
} from "../src/services/email/index.js";

const mockSend = vi.fn();
vi.mock("resend", () => ({
	Resend: vi.fn().mockImplementation(() => ({
		emails: {
			send: mockSend,
		},
	})),
}));

describe("ResendEmailService", () => {
	let emailService: ResendEmailService;

	beforeEach(() => {
		vi.clearAllMocks();
		mockSend.mockReset();

		emailService = new ResendEmailService({
			apiKey: "test-api-key",
			fromEmail: "test@example.com",
			fromName: "Test Service",
		});
	});

	describe("sendRegistrationConfirmation", () => {
		it("should send registration confirmation email", async () => {
			mockSend.mockResolvedValue({ data: { id: "email-id" } });

			await emailService.sendRegistrationConfirmation({
				userEmail: "user@example.com",
				userName: "John Doe",
				confirmationUrl: "https://example.com/confirm",
			});

			expect(mockSend).toHaveBeenCalledWith({
				from: "Test Service <test@example.com>",
				to: "user@example.com",
				subject: "Confirmez votre inscription - Ripste",
				html: expect.stringContaining("John Doe"),
				text: expect.stringContaining("John Doe"),
			});
		});

		it("should handle resend errors", async () => {
			mockSend.mockResolvedValue({
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
			mockSend.mockResolvedValue({ data: { id: "email-id" } });

			await emailService.sendPlatformAcceptance({
				userEmail: "user@example.com",
				userName: "John Doe",
				loginUrl: "https://example.com/login",
			});

			expect(mockSend).toHaveBeenCalledWith({
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
			mockSend.mockResolvedValue({ data: { id: "email-id" } });

			await emailService.sendPlatformRejection({
				userEmail: "user@example.com",
				userName: "John Doe",
				reason: "Incomplete information",
				supportEmail: "support@example.com",
			});

			expect(mockSend).toHaveBeenCalledWith({
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
			mockSend.mockResolvedValue({ data: { id: "email-id" } });

			const template: IEmailTemplate = {
				to: "user@example.com",
				subject: "Custom Subject",
				htmlContent: "<h1>Custom Content</h1>",
				textContent: "Custom Content",
			};

			await emailService.sendCustomEmail(template);

			expect(mockSend).toHaveBeenCalledWith({
				from: "Test Service <test@example.com>",
				to: "user@example.com",
				subject: "Custom Subject",
				html: "<h1>Custom Content</h1>",
				text: "Custom Content",
			});
		});

		it("should send custom email without text content", async () => {
			mockSend.mockResolvedValue({ data: { id: "email-id" } });

			const template: IEmailTemplate = {
				to: "user@example.com",
				subject: "Custom Subject",
				htmlContent: "<h1>Custom Content</h1>",
			};

			await emailService.sendCustomEmail(template);

			expect(mockSend).toHaveBeenCalledWith({
				from: "Test Service <test@example.com>",
				to: "user@example.com",
				subject: "Custom Subject",
				html: "<h1>Custom Content</h1>",
			});
		});
	});
});
