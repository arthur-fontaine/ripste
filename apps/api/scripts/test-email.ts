#!/usr/bin/env node --experimental-strip-types

/**
 * Script de démonstration pour tester le service d'email
 *
 * Usage:
 * RESEND_API_KEY=your_key node scripts/test-email.ts
 */

import { ResendEmailService } from "../src/services/email/resend-email.service.ts";

async function main() {
	const apiKey = process.env["RESEND_API_KEY"];
	const testEmail = process.env["TEST_EMAIL"] || "test@example.com";

	if (!apiKey) {
		console.error("❌ RESEND_API_KEY environment variable is required");
		console.error(
			"Usage: RESEND_API_KEY=your_key TEST_EMAIL=your@email.com node scripts/test-email.ts",
		);
		process.exit(1);
	}

	const emailService = new ResendEmailService({
		apiKey,
		fromEmail: "test@example.com", // Remplacez par votre domaine vérifié
		fromName: "Test Ripste",
	});

	console.log("🚀 Test du service d'email avec Resend");
	console.log(`📧 Email de test: ${testEmail}`);
	console.log("");

	try {
		// Test 1: Email de confirmation d'inscription
		console.log("1️⃣ Test de l'email de confirmation d'inscription...");
		await emailService.sendRegistrationConfirmation({
			userEmail: testEmail,
			userName: "Utilisateur Test",
			confirmationUrl: "https://example.com/verify?token=test123",
		});
		console.log("✅ Email de confirmation envoyé avec succès");
		console.log("");

		// Test 2: Email d'acceptation
		console.log("2️⃣ Test de l'email d'acceptation...");
		await emailService.sendPlatformAcceptance({
			userEmail: testEmail,
			userName: "Utilisateur Test",
			loginUrl: "https://example.com/login",
		});
		console.log("✅ Email d'acceptation envoyé avec succès");
		console.log("");

		// Test 3: Email de refus
		console.log("3️⃣ Test de l'email de refus...");
		await emailService.sendPlatformRejection({
			userEmail: testEmail,
			userName: "Utilisateur Test",
			reason: "Documents incomplets pour la vérification",
			supportEmail: "support@example.com",
		});
		console.log("✅ Email de refus envoyé avec succès");
		console.log("");

		// Test 4: Email personnalisé
		console.log("4️⃣ Test de l'email personnalisé...");
		await emailService.sendCustomEmail({
			to: testEmail,
			subject: "Email de test personnalisé",
			htmlContent: `
				<h1>Test réussi !</h1>
				<p>Ce message confirme que le service d'email fonctionne correctement.</p>
				<p>Tous les types d'emails ont été envoyés avec succès.</p>
			`,
			textContent:
				"Test réussi ! Ce message confirme que le service d'email fonctionne correctement.",
		});
		console.log("✅ Email personnalisé envoyé avec succès");
		console.log("");

		console.log("🎉 Tous les tests d'email ont été exécutés avec succès !");
		console.log(`📬 Vérifiez votre boîte mail: ${testEmail}`);
	} catch (error) {
		console.error("❌ Erreur lors de l'envoi des emails:", error);
		process.exit(1);
	}
}

main().catch(console.error);
