import type {
	RegistrationConfirmationData,
	PlatformAcceptanceData,
	PlatformRejectionData,
} from "./email-service.interface.ts";

export class EmailTemplates {
	static registrationConfirmation(data: RegistrationConfirmationData): {
		subject: string;
		html: string;
		text: string;
	} {
		const subject = "Confirmez votre inscription - Ripste";

		const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Confirmation d'inscription</title>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background-color: #ffffff; padding: 30px; border: 1px solid #dee2e6; }
		.footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
		.btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
		.btn:hover { background-color: #0056b3; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Bienvenue sur Ripste !</h1>
		</div>
		<div class="content">
			<p>Bonjour ${data.userName},</p>
			<p>Merci de vous être inscrit sur notre plateforme. Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
			<p style="text-align: center; margin: 30px 0;">
				<a href="${data.confirmationUrl}" class="btn">Confirmer mon email</a>
			</p>
			<p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
			<p style="word-break: break-all; color: #007bff;">${data.confirmationUrl}</p>
			<p>Ce lien est valide pendant 24 heures.</p>
		</div>
		<div class="footer">
			<p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
			<p>© 2025 Ripste. Tous droits réservés.</p>
		</div>
	</div>
</body>
</html>`;

		const text = `
Bonjour ${data.userName},

Merci de vous être inscrit sur Ripste. Pour finaliser votre inscription, veuillez confirmer votre adresse email en visitant ce lien :

${data.confirmationUrl}

Ce lien est valide pendant 24 heures.

Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.

© 2025 Ripste. Tous droits réservés.
		`;

		return { subject, html, text };
	}

	static platformAcceptance(data: PlatformAcceptanceData): {
		subject: string;
		html: string;
		text: string;
	} {
		const subject =
			"Félicitations ! Votre accès à la plateforme Ripste a été approuvé";

		const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Accès approuvé</title>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background-color: #d1edff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background-color: #ffffff; padding: 30px; border: 1px solid #dee2e6; }
		.footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
		.btn { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
		.btn:hover { background-color: #1e7e34; }
		.success-icon { font-size: 48px; color: #28a745; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<div class="success-icon">✅</div>
			<h1>Accès approuvé !</h1>
		</div>
		<div class="content">
			<p>Bonjour ${data.userName},</p>
			<p>Excellente nouvelle ! Votre demande d'accès à la plateforme Ripste a été <strong>approuvée</strong>.</p>
			<p>Vous pouvez maintenant vous connecter et profiter de tous les services disponibles sur notre plateforme.</p>
			<p style="text-align: center; margin: 30px 0;">
				<a href="${data.loginUrl}" class="btn">Se connecter maintenant</a>
			</p>
			<p>Nous sommes ravis de vous compter parmi nos utilisateurs et espérons que vous trouverez notre plateforme utile et agréable à utiliser.</p>
			<p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
		</div>
		<div class="footer">
			<p>Bienvenue dans la communauté Ripste !</p>
			<p>© 2025 Ripste. Tous droits réservés.</p>
		</div>
	</div>
</body>
</html>`;

		const text = `
Bonjour ${data.userName},

Excellente nouvelle ! Votre demande d'accès à la plateforme Ripste a été approuvée.

Vous pouvez maintenant vous connecter et profiter de tous les services disponibles sur notre plateforme.

Connectez-vous ici : ${data.loginUrl}

Nous sommes ravis de vous compter parmi nos utilisateurs et espérons que vous trouverez notre plateforme utile et agréable à utiliser.

Si vous avez des questions, n'hésitez pas à nous contacter.

Bienvenue dans la communauté Ripste !

© 2025 Ripste. Tous droits réservés.
		`;

		return { subject, html, text };
	}

	static platformRejection(data: PlatformRejectionData): {
		subject: string;
		html: string;
		text: string;
	} {
		const subject = "Mise à jour de votre demande d'accès - Ripste";

		const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Mise à jour de votre demande</title>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background-color: #fff3cd; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
		.content { background-color: #ffffff; padding: 30px; border: 1px solid #dee2e6; }
		.footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
		.btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
		.btn:hover { background-color: #0056b3; }
		.warning-icon { font-size: 48px; color: #ffc107; }
		.reason-box { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<div class="warning-icon">⚠️</div>
			<h1>Mise à jour de votre demande</h1>
		</div>
		<div class="content">
			<p>Bonjour ${data.userName},</p>
			<p>Nous vous remercions pour votre intérêt pour la plateforme Ripste.</p>
			<p>Après examen de votre demande d'accès, nous ne pouvons malheureusement pas l'approuver pour le moment.</p>
			${
				data.reason
					? `
			<div class="reason-box">
				<strong>Raison :</strong><br>
				${data.reason}
			</div>
			`
					: ""
			}
			<p>Nous vous encourageons à renouveler votre demande ultérieurement. Entre-temps, si vous avez des questions ou souhaitez des clarifications, n'hésitez pas à nous contacter.</p>
			<p style="text-align: center; margin: 30px 0;">
				<a href="mailto:${data.supportEmail}" class="btn">Nous contacter</a>
			</p>
			<p>Nous apprécions votre compréhension.</p>
		</div>
		<div class="footer">
			<p>Merci pour votre intérêt pour Ripste.</p>
			<p>© 2025 Ripste. Tous droits réservés.</p>
		</div>
	</div>
</body>
</html>`;

		const text = `
Bonjour ${data.userName},

Nous vous remercions pour votre intérêt pour la plateforme Ripste.

Après examen de votre demande d'accès, nous ne pouvons malheureusement pas l'approuver pour le moment.

${data.reason ? `Raison : ${data.reason}` : ""}

Nous vous encourageons à renouveler votre demande ultérieurement. Entre-temps, si vous avez des questions ou souhaitez des clarifications, n'hésitez pas à nous contacter à ${data.supportEmail}.

Nous apprécions votre compréhension.

Merci pour votre intérêt pour Ripste.

© 2025 Ripste. Tous droits réservés.
		`;

		return { subject, html, text };
	}
}
