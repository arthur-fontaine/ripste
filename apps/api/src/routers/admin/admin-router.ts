import { Hono } from "hono";
import { emailService } from "../../email.ts";
import { database } from "../../database.ts";

const adminRouter = new Hono();

adminRouter.post("/users/:userId/approve", async (c) => {
	try {
		const userId = c.req.param("userId");
		const { loginUrl } = await c.req.json();

		const user = await database.user.findOne(userId);

		if (!user) {
			return c.json({ error: "Utilisateur non trouvé" }, 404);
		}

		// Ici on peut ajouter une logique pour marquer l'utilisateur comme approuvé
		// Par exemple, mettre à jour un champ "approved" ou "status" dans la base de données
		// await database.user.update(userId, { status: "approved" });

		await emailService.sendPlatformAcceptance({
			userEmail: user.email,
			userName: user.profile?.fullName || user.profile?.firstName || user.email,
			loginUrl: loginUrl || `${process.env["FRONTEND_URL"]}/login`,
		});

		return c.json({
			message: "Utilisateur approuvé et email envoyé",
			userId: user.id,
		});
	} catch (error) {
		console.error("Erreur lors de l'approbation de l'utilisateur:", error);
		return c.json(
			{
				error: "Erreur interne du serveur",
			},
			500,
		);
	}
});

adminRouter.post("/users/:userId/reject", async (c) => {
	try {
		const userId = c.req.param("userId");
		const { reason } = await c.req.json();

		const user = await database.user.findOne(userId);

		if (!user) {
			return c.json({ error: "Utilisateur non trouvé" }, 404);
		}

		// Ici on peut ajouter une logique pour marquer l'utilisateur comme refusé
		// Par exemple, mettre à jour un champ "status" dans la base de données
		// await database.user.update(userId, { status: "rejected", rejectionReason: reason });

		await emailService.sendPlatformRejection({
			userEmail: user.email,
			userName: user.profile?.fullName || user.profile?.firstName || user.email,
			reason: reason,
			supportEmail: process.env["SUPPORT_EMAIL"] || "support@ripste.com",
		});

		return c.json({
			message: "Utilisateur refusé et email envoyé",
			userId: user.id,
		});
	} catch (error) {
		console.error("Erreur lors du refus de l'utilisateur:", error);
		return c.json(
			{
				error: "Erreur interne du serveur",
			},
			500,
		);
	}
});

export { adminRouter };
