# Configuration du Service d'Email avec Resend

## 1. Création du compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit
3. Vérifiez votre email

## 2. Configuration du domaine

### Option A: Utiliser un domaine personnalisé (recommandé pour la production)

1. Dans le dashboard Resend, allez dans "Domains"
2. Cliquez sur "Add Domain"
3. Entrez votre domaine (ex: `ripste.com`)
4. Suivez les instructions pour configurer les enregistrements DNS :
   - SPF
   - DKIM
   - DMARC
5. Attendez la vérification (peut prendre quelques heures)

### Option B: Utiliser le domaine de test (pour le développement)

Resend fournit un domaine de test que vous pouvez utiliser immédiatement :
- Domaine : `onboarding.resend.dev`
- Email : `delivered@resend.dev` (pour tester la livraison)

## 3. Obtenir la clé API

1. Dans le dashboard Resend, allez dans "API Keys"
2. Cliquez sur "Create API Key"
3. Donnez un nom à votre clé (ex: "Ripste Production")
4. Sélectionnez les permissions appropriées :
   - `Sending access` pour envoyer des emails
   - `Full access` si vous voulez également gérer les domaines via l'API
5. Copiez la clé API (elle ne sera plus visible après)

## 4. Configuration des variables d'environnement

Créez un fichier `.env` dans le dossier `apps/api/` :

```bash
# Configuration Email - Resend
RESEND_API_KEY=re_YourApiKeyHere

# Configuration domaine
FROM_EMAIL=noreply@votre-domaine.com  # ou delivered@resend.dev pour les tests
FROM_NAME=Ripste

# Autres configurations
SUPPORT_EMAIL=support@votre-domaine.com
FRONTEND_URL=http://localhost:3000
```

## 5. Test de la configuration

### Test avec le script de démonstration

```bash
# Avec votre propre email pour voir les résultats
RESEND_API_KEY=your_key TEST_EMAIL=votre@email.com node scripts/test-email.ts

# Ou avec l'email de test de Resend
RESEND_API_KEY=your_key TEST_EMAIL=delivered@resend.dev node scripts/test-email.ts
```

### Test via l'API

```bash
# Démarrer l'API
pnpm dev

# Dans un autre terminal, tester l'endpoint
curl -X POST http://localhost:8000/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "registration",
    "email": "delivered@resend.dev",
    "name": "Test User"
  }'
```

## 6. Vérification des emails envoyés

1. Dans le dashboard Resend, allez dans "Logs"
2. Vous verrez tous les emails envoyés avec leur statut
3. Cliquez sur un email pour voir les détails complets

## 7. Limites du plan gratuit

- 3,000 emails/mois
- 100 emails/jour
- 1 domaine personnalisé
- Support par email

Pour la production, considérez une mise à niveau vers un plan payant.

## 8. Bonnes pratiques

### Sécurité
- Ne jamais exposer votre clé API dans le code
- Utilisez des variables d'environnement
- Rotez régulièrement vos clés API

### Delivrabilité
- Configurez correctement SPF, DKIM et DMARC
- Utilisez un domaine dédié pour les emails transactionnels
- Surveillez votre réputation d'expéditeur

### Monitoring
- Surveillez les logs dans le dashboard Resend
- Implémentez des alertes pour les échecs d'envoi
- Testez régulièrement vos templates

## 9. Troubleshooting

### Erreur "Domain not verified"
- Vérifiez que tous les enregistrements DNS sont correctement configurés
- Attendez la propagation DNS (jusqu'à 48h)

### Erreur "Invalid API key"
- Vérifiez que la clé API est correcte
- Assurez-vous qu'elle n'a pas expiré

### Emails non reçus
- Vérifiez les dossiers spam/indésirables
- Consultez les logs dans le dashboard Resend
- Testez avec `delivered@resend.dev`

### Rate limiting
- Respectez les limites du plan gratuit
- Implémentez une file d'attente pour les gros volumes
- Considérez une mise à niveau de plan
