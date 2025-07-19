import type { IPlatformAcceptanceData } from "../domain/ports/IPlatformAcceptanceData.ts";

export function platformAcceptance(data: IPlatformAcceptanceData): {
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
