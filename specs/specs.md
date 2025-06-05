# Ripste – Cahier des charges

## Contexte

### Paiements en ligne

Au XXIe siècle, le paiement digital est devenu incontournable avec une accélération massive du e-commerce, renforcée par les habitudes prises lors des confinements successifs. Les consommateurs exigent rapidité, simplicité, et sécurité. Les marchands, eux, cherchent à contrôler précisément leur expérience client tout en maintenant une intégration facile et sécurisée des paiements.

### Stripe

Stripe est une référence mondiale dans le domaine du paiement en ligne. Toutefois, son approche « tout-en-un » montre certaines limites. Pour utiliser sa célèbre page Checkout, les marchands sont obligés d'intégrer leur catalogue produit directement dans Stripe, en créant systématiquement des objets « produits » et « prix ». Bien que cette solution soit simple à intégrer, elle limite fortement la personnalisation visuelle de la page de paiement. Stripe restreint la personnalisation à quelques options telles que le logo ou la couleur principale.

### Notre solution : Ripste

Ripste est un projet d’école développé par quatre étudiants : Hyppolite Pernot, Jules Roche, Thierry Maignan et Arthur Fontaine.

Notre projet répond directement à ces deux problématiques :
1. Contrairement à Stripe, nous ne demandons aucune intégration obligatoire d’un catalogue produit. Notre API est simple et directe : un marchand crée une transaction, indique le montant, la devise et les informations client nécessaires, et reçoit immédiatement une URL de paiement.
2. Nous proposons une page Checkout totalement personnalisable via CSS. Notre HTML structuré avec des classes BEM permet aux développeurs d’intégrer aisément leur propre feuille de style afin d’obtenir une expérience client cohérente et fidèle à leur marque.

---

## Objectifs

### Objectifs techniques

- Taux de disponibilité ≥ 99.99%
- Score Lighthouse de 100 (hors SEO) pour la page Checkout
- Couverture de tests ≥ 90%
- Poids max au chargement initial : 200 Ko (gzip)
  - JS bundle principal (incluant Vue.js) ≤ 150 Ko
  - Polices et assets médias chargés via CDN ou en différé

### Objectifs d’usage et de satisfaction

- 60% des marchands personnalisent la page Checkout
- 80% des intégrations non-tech se font sans support
- Taux de satisfaction ≥ 90%

---

## Personas

### Persona 1 : Clara

- 34 ans, gérante d’une boutique de bijoux artisanaux
- Veut une forte cohérence visuelle, même sur la page de paiement
- Besoin de contrôle total sur le checkout
- Douleur : Perte d'identité avec Stripe

### Persona 2 : Alexandre

- 29 ans, développeur freelance
- Cherche une solution simple, rapide, personnalisable
- Besoin : CSS custom simple à intégrer
- Douleur : Intégrations trop complexes avec Stripe

---

## Besoins et Fonctionnalités

### Administrateur

#### Suivi de KPIs

- Objectifs via graphiques
- Usage en temps réel

#### Administration

- Gestion des marchands
- Recherche et impersonation de transactions

---

### Marchand

#### Suivi de KPIs

- Usage : nb de transactions, montant moyen, etc.

#### Administration

- Gestion des tokens
- Remboursements, recherches

#### Inscription

- Nom société, KBIS, contact
- Notification par email à l’acceptation

#### Page Checkout

- Génération d’une URL via API (`checkout.ripste.com`)
- Paramètres : montant, redirection, produits (optionnels)
- CSS customisé
- Génération automatique de style via LLM et branding
- Version test : `test.checkout.ripste.com`

---

### Consommateur

- Paiement via formulaire (carte bancaire)

---

## Contraintes

### Techniques

- API en Node.js avec Hono
- Développement orienté-objet
- TDD avec Vitest
- Inversion de dépendances
- Validation stricte des entrées
- Auth : JWT + OAuth2
- DB principale : PostgreSQL via Sequelize
- Tracing : Open Telemetry + Grafana
- Front démo : Vue.js
- CI/CD GitHub Actions
- Commits signés
- Feature flags via tokens
- Checkout stylisable via BEM
- Traitements asynchrones via système de queue

### Réglementaire

- Consentement requis pour données
- Suppression possible
- Données chiffrées en transit et au repos
- Pas de stockage direct des données CB
- Hébergement UE ou RGPD compliant
- Tiers (mail, monitoring…) RGPD compliant
- Déclaration de fuite < 72h

---

## Limites actuelles

- Cas d’usage simples uniquement
- Pas optimisé pour très grande échelle
- Scalabilité horizontale non priorisée mais anticipée
- Pas de paiement récurrent (non PCI DSS) mais conception compatible

---

## Planning

- Deadline : Mercredi 23 juillet 2025

---

## Livrables

- Code source sur GitHub
- API : `api.ripste.com`
- Démo : `demo.ripste.com`
- Dashboard admin
- Dashboard marchand

---

## Critères de notation

| Critère                                     | Pondération     |
|---------------------------------------------|-----------------|
| Respect des fonctionnalités                | 30 points max   |
| Respect des livrables                      | 30 points max   |
| Respect des contraintes techniques         | 30 points max   |
| Répartition de l’organisation              | 5 points max    |
| Innovation et propositions supplémentaires | 5 points max    |
