# PLAN DE MIGRATION : Contenu ancien site → Design monochrome-elegance

## Contexte
- **Source** : `../acreed-consulting/src/` (ancien design, contenu réel Acreed)
- **Cible** : `monochrome-elegance/src/` (nouveau design monochrome premium, contenu placeholder)
- **Règle** : On garde le design monochrome-elegance, on injecte le contenu Acreed
- **Note** : L'ancien projet est un hybride WRLDS/Acreed. Seul le contenu Acreed (FR) est à migrer.

---

## ÉTAPE 1 — Navigation (`src/components/Navigation.tsx`)
Remplacer les liens du menu par :
- Accueil → `/`
- À propos → `/about`
- Nos Services → `/#services`
- Clients → `/clients`
- Actualités → `/blog`
- Recrutement → `/careers`
- CTA : "Nous Contacter" → `#contact`

---

## ÉTAPE 2 — Hero (`src/components/HeroSection.tsx`)
- Headline : "Partenaire du futur des entreprises"
- Subtitle : "ACREED Consulting vous accompagne dans les télécoms, l'IT, la transformation digitale et la cybersécurité."
- CTA 1 : "Découvrir nos références" → `#projects`
- CTA 2 : "Nous Contacter" → `#contact`
- Vidéo hero : `https://res.cloudinary.com/dnuf2gvk7/video/upload/v1758808090/video_test_entete_acreed_w9y7ly.mp4`

---

## ÉTAPE 3 — Partenaires Marquee (`src/components/PartnersMarquee.tsx`)
Remplacer les logos/noms par les vrais clients :
- **ESN Télécoms** : Rhon Telecom, SPIE, TIBCO, ERT, Axians, SFR, Circet
- **ESN Consulting** : Amaris Consulting, Davidson Consulting, Fusion Groupe
- **Soutiens** : Michelin, La Brasserie du Digital

---

## ÉTAPE 4 — Services (`src/components/ServicesSection.tsx`)
Badge : "Secteurs d'Intervention"
Titre : "Nos Domaines d'Expertise"
Sous-titre : "ACREED Consulting intervient dans 5 secteurs clés avec une expertise reconnue et une approche sur-mesure."

5 cartes :
1. **Télécoms** (icône Radio) — Solutions télécoms avancées avec expertise pointue du fondateur.
2. **IT/Digital** (icône Code) — Transformation digitale et développement IT adapté à vos besoins.
3. **Cybersécurité** (icône Shield) — Protection avancée et sécurisation de vos infrastructures critiques.
4. **Énergie Renouvelable** (icône Zap) — Expertise technique pour la transition énergétique durable.
5. **Industrie** (icône Factory) — Solutions industrielles et optimisation des processus métier.

---

## ÉTAPE 5 — Expertise / Offres & Services (`src/components/ExpertiseSection.tsx`)
Badge : "Nos Services"
Titre : "Offres & Services"
Sous-titre : "ACREED Consulting propose une gamme complète de services pour accompagner votre croissance."

4 offres :
1. **Consulting Externe sur Mesure** — Mise à dispo de consultants spécialisés. Features : Consultants experts, Missions flexibles, Accompagnement personnalisé
2. **Prestation + Internalisation** — Intégrer nos consultants après mission réussie. Features : Transition fluide, Intégration progressive, Formation continue
3. **Recrutement Interne** — Assistance au recrutement de talents qualifiés. Features : Sourcing expert, Évaluation technique, Processus rigoureux
4. **Gestion de Projets** — Création d'outils personnalisés, pilotage, coordination. Features : Outils sur-mesure, Pilotage expert, Coordination complète

---

## ÉTAPE 6 — Équipe (`src/components/TeamSection.tsx`)
Seul membre Acreed confirmé :
- **Steven Breuil** — PDG — "Passionné par les télécoms depuis 2011, avec une expérience confirmée en missions de consulting auprès de PME et de grands comptes."
- Image : `/lovable-uploads/acreed-steven.jpg`
- Les autres membres (Niek, Chengjie, Love) sont des restes WRLDS → à supprimer ou demander au user s'il veut ajouter d'autres membres Acreed

---

## ÉTAPE 7 — Valeurs / About (`src/components/AboutSection.tsx`)
Badge : "Notre Force"
Titre : "Valeurs & Atouts"

Chiffres clés :
- 30 consultants (croissance 5→30 en 4 ans)
- 2 000 000 € CA 2024
- Présence nationale

4 valeurs :
1. Rapidité d'Intervention
2. Politique Tarifaire Compétitive
3. Expertise Télécoms Pointue
4. Transparence & Confiance

Philosophie : "Fantastique simplicité — Créativité d'une startup, puissance d'un grand groupe, transparence et confiance dans chaque relation client-consultant."

---

## ÉTAPE 8 — Offres d'emploi (`src/components/JobsSection.tsx`)
Badge : "Rejoignez-nous"
Titre : "Recrutement & Carrières"

4 offres :
1. **Support OMC Nokia/Huawei** — 4+ ans — National — CDI/Freelance
2. **Développeur Front-end Node.js/React** — 3+ ans — Remote/Lyon — CDI
3. **Chef de Projet Télécoms** — 5+ ans — Auvergne-Rhône-Alpes — CDI
4. **Spécialiste Déploiement Radio** — 3+ ans — National — CDI/Mission

Processus : Candidature → Entretien ACREED → Entretien Client → Déploiement
Email spontané : recrutement@acreedconsulting.com

---

## ÉTAPE 9 — Contact (`src/components/ContactSection.tsx`)
Badge : "Contactez-nous"
Titre : "Restons en contact"
Sous-titre : "Vous avez des questions sur nos services en télécoms, IT ou cybersécurité ?"

Contact principal :
- Steven Breuil — PDG
- Email : steven.breuil@acreedconsulting.com
- LinkedIn : https://www.linkedin.com/in/steven-breuil-824330110
- Image : `/lovable-uploads/acreed-steven.jpg`

Formulaire : garder React Hook Form + Zod (déjà en place)

---

## ÉTAPE 10 — Footer (`src/components/Footer.tsx`)
- Logo : `/lovable-uploads/logo-acreed-dark.jpg`
- Description : "ACREED Consulting accompagne les entreprises dans les télécoms, l'IT, la transformation digitale et la cybersécurité."
- Adresse : Le Puy-en-Velay, Haute-Loire (France)
- LinkedIn : https://www.linkedin.com/company/acreedconsutling/
- Liens : À propos, Carrières, Politique de confidentialité
- Newsletter : input email + "S'abonner"
- Copyright : "© ACREED Consulting — Tous droits réservés"

---

## ÉTAPE 11 — SEO & Meta (`index.html`)
- lang="fr"
- Title : "ACREED Consulting - Experts Télécoms, IT & Cybersécurité"
- Description : "Votre partenaire de croissance en télécommunications, IT, transformation digitale et cybersécurité. 30 consultants, 2M€ CA, présence nationale."
- OG image : à remplacer (actuellement pointe vers lovable.dev)

---

## ÉTAPE 12 — Pages additionnelles (OPTIONNEL, session ultérieure)
Ces pages existent dans l'ancien site et pourraient être ajoutées :
- `/about` — Mission, valeurs, histoire, équipe (contenu complet disponible)
- `/careers` — Page dédiée recrutement avec détails
- `/clients` — Page dédiée clients/références
- `/privacy-policy` — Politique RGPD complète
- `/blog` — Les articles actuels sont WRLDS (anglais) → à supprimer ou créer du contenu Acreed

---

## FICHIERS ASSETS À COPIER depuis l'ancien projet
Vérifier et copier dans `public/` :
- `lovable-uploads/logo-acreed.png`
- `lovable-uploads/logo-acreed-dark.jpg`
- `lovable-uploads/logo-acreed-white.jpg`
- `lovable-uploads/acreed-steven.jpg`

---

## ORDRE D'EXÉCUTION RECOMMANDÉ
1. Copier les assets (logos, photos)
2. SEO/Meta (index.html) — rapide
3. Navigation — impact global
4. Hero — première impression
5. Services → Expertise → Valeurs → Équipe → Jobs → Contact → Footer
6. Partenaires Marquee
7. Pages additionnelles si demandé

## ATTENTION
- Ne PAS toucher au design/CSS/animations — garder le monochrome-elegance tel quel
- Utiliser les composants shadcn/ui existants
- Ne PAS ajouter cursor: pointer
- Le contenu blog WRLDS est à ignorer complètement
- Demander au user pour les membres d'équipe au-delà de Steven Breuil
