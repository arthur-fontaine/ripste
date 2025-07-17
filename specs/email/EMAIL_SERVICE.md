# Service d'Email avec Resend

Ce service gère l'envoi d'emails pour l'application Ripste en utilisant l'API Resend.

## Configuration

### Variables d'environnement requises

```bash
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@ripste.com
FROM_NAME=Ripste
SUPPORT_EMAIL=support@ripste.com
FRONTEND_URL=http://localhost:3000
```

### Configuration de Resend

1. Créez un compte sur [Resend](https://resend.com)
2. Obtenez votre clé API depuis le dashboard
3. Configurez votre domaine pour l'envoi d'emails

## Types d'emails supportés

### 1. Confirmation d'inscription
Envoyé automatiquement lors de l'inscription d'un nouvel utilisateur via Better Auth.

```typescript
await emailService.sendRegistrationConfirmation({
  userEmail: "user@example.com",
  userName: "John Doe",
  confirmationUrl: "https://yourapp.com/verify-email?token=xxx"
});
```

### 2. Acceptation sur la plateforme
Envoyé quand un administrateur approuve l'accès d'un utilisateur.

```typescript
await emailService.sendPlatformAcceptance({
  userEmail: "user@example.com",
  userName: "John Doe",
  loginUrl: "https://yourapp.com/login"
});
```

### 3. Refus sur la plateforme
Envoyé quand un administrateur refuse l'accès d'un utilisateur.

```typescript
await emailService.sendPlatformRejection({
  userEmail: "user@example.com",
  userName: "John Doe",
  reason: "Documents incomplets",
  supportEmail: "support@ripste.com"
});
```

### 4. Email personnalisé
Pour envoyer des emails avec un contenu personnalisé.

```typescript
await emailService.sendCustomEmail({
  to: "user@example.com",
  subject: "Sujet personnalisé",
  htmlContent: "<h1>Contenu HTML</h1>",
  textContent: "Contenu texte" // optionnel
});
```

## API Endpoints

### Administration des utilisateurs

#### Approuver un utilisateur
```http
POST /admin/users/:userId/approve
Content-Type: application/json

{
  "loginUrl": "https://yourapp.com/login"
}
```

#### Refuser un utilisateur
```http
POST /admin/users/:userId/reject
Content-Type: application/json

{
  "reason": "Raison du refus"
}
```

#### Envoyer un email personnalisé
```http
POST /admin/send-email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Sujet",
  "htmlContent": "<h1>Contenu HTML</h1>",
  "textContent": "Contenu texte"
}
```

#### Tester l'envoi d'emails
```http
POST /admin/test-email
Content-Type: application/json

{
  "type": "registration|acceptance|rejection",
  "email": "test@example.com",
  "name": "Nom de test"
}
```

## Intégration avec Better Auth

Le service est automatiquement intégré avec Better Auth pour l'envoi d'emails de vérification lors de l'inscription :

```typescript
export const auth = betterAuth({
  // ... autres configurations
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await emailService.sendRegistrationConfirmation({
        userEmail: user.email,
        userName: user.name || user.email,
        confirmationUrl: url,
      });
    },
  },
});
```

## Templates d'emails

Les templates sont définis dans `src/services/email/email-templates.ts` et incluent :

- Styles CSS responsives
- Contenu HTML et texte
- Personnalisation avec les données utilisateur
- Design cohérent avec l'identité de la marque

## Tests

Pour exécuter les tests du service d'email :

```bash
pnpm test tests/email.test.ts
```

## Développement local

Pour tester les emails en développement, vous pouvez utiliser l'endpoint de test :

```bash
curl -X POST http://localhost:8000/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "registration",
    "email": "test@example.com",
    "name": "Test User"
  }'
```

## Gestion des erreurs

Le service gère automatiquement les erreurs de l'API Resend et les remonte avec des messages d'erreur appropriés. Toutes les erreurs sont loggées pour le débogage.

## Sécurité

- Les clés API sont stockées dans les variables d'environnement
- Validation des données d'entrée
- Gestion des erreurs sans exposition d'informations sensibles
