import type { IRegistrationConfirmationData } from "../domain/ports/IRegistrationConfirmationData.ts";

export function registrationConfirmation(data: IRegistrationConfirmationData): {
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
            <a style="word-break: break-all; color: #007bff;">${data.confirmationUrl}</a>
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
