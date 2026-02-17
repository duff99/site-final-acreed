# REGLES DU JEU - Site Acreed Consulting (monochrome-elegance)

> Ce fichier est la reference absolue pour chaque session Claude Code.
> A lire en entier avant toute modification du projet.

---

## 1. QU'EST-CE QUE CE PROJET ?

**Acreed Consulting** est un cabinet de recrutement et de conseil specialise dans les **telecoms, l'IT, la transformation digitale et la cybersecurite**, base au Puy-en-Velay (Haute-Loire, France).

Ce site est leur **landing page marketing** : une single-page app React au design **monochrome premium** (noir/blanc/gris) avec des effets glassmorphism et des animations Framer Motion.

### Chiffres cles
- 30+ consultants (croissance 5 -> 30 en 4 ans)
- 2 000 000 EUR CA 2024
- Presence nationale
- Fonde par Steven Breuil (expert telecoms depuis 2011)

### Philosophie
> "Fantastique simplicite -- Creativite d'une startup, puissance d'un grand groupe, transparence et confiance dans chaque relation client-consultant."

---

## 2. STACK TECHNIQUE

| Techno | Version | Role |
|--------|---------|------|
| React | 18 | UI framework |
| TypeScript | 5.8 | Typage |
| Vite | 5 (SWC) | Bundler + dev server (port 8080) |
| Tailwind CSS | 3 | Utility-first CSS |
| shadcn/ui (Radix) | 60+ composants | Composants UI dans `src/components/ui/` |
| Framer Motion | 11 | Animations (scroll, hover, transitions) |
| React Router DOM | 6 | Routing client-side |
| React Hook Form + Zod | - | Validation formulaires |
| TanStack React Query | 5 | Server state (configure, pas d'API active) |
| Lucide React | - | Icones |

### Commandes
```bash
npm run dev          # Dev server port 8080
npm run build        # Build production
npm run lint         # ESLint
npm run preview      # Preview build
npm run test         # Vitest (single run)
```

---

## 3. ARCHITECTURE DU PROJET

### Structure des dossiers
```
monochrome-elegance/
  public/
    images/          # favicon.jpg, steven.jpg, maxime.jpg, tristan.jpg, favicon2.png
    videos/          # hero-video.mp4
    placeholder.svg
  src/
    components/      # Composants de section + utilitaires
      ui/            # 60+ composants shadcn/ui (NE PAS MODIFIER)
    config/
      navigation.ts  # Liens de navigation centralisee
    data/
      partners.ts    # Liste des partenaires (12 entrees)
      team.ts        # Equipe (3 membres : Steven, Maxime, Tristan)
      services.ts    # 5 secteurs d'intervention
      expertise.ts   # 4 offres de services
      values.ts      # 4 valeurs + chiffres cles + philosophie
    hooks/           # use-mobile.tsx, use-toast.ts
    lib/             # utils.ts (cn helper)
    pages/
      Index.tsx      # Page d'accueil (assemble les sections)
      NotFound.tsx   # 404
    index.css        # Design system complet (variables CSS HSL)
    App.tsx          # Router principal
    main.tsx         # Point d'entree
```

### Routing
- `/` -> `Index.tsx` (landing page complete)
- `*` -> `NotFound.tsx`
- Navigation interne par ancres : `#services`, `#expertise`, `#team`, `#jobs`, `#about`, `#contact`

### Import Alias
`@/` mappe vers `src/` (configure dans tsconfig + vite.config)

---

## 4. COMPOSITION DE LA PAGE (Index.tsx)

L'ordre des sections dans la page :

```
Navigation (navbar flottante Raycast-style, glass-nav-raycast)
  |
HeroSection (video background + titre "Fantastique simplicite" + stats)
  |
SectionDividerPremium
  |
PartnersMarquee (defilement infini des noms partenaires)
  |
SectionDividerPremium
  |
ServicesSection (5 cartes : Telecoms, IT, Cyber, Energie, Industrie)
  |
SectionDividerPremium
  |
ExpertiseSection (4 cartes : Consulting, Presta+Interna, Recrutement, Gestion)
  |
SectionDividerPremium
  |
TeamSection (3 cartes photo : Steven, Maxime, Tristan)
  |
SectionDividerPremium
  |
JobsSection (3 offres d'emploi en liste)
  |
SectionDividerPremium
  |
AboutSection (4 valeurs + 3 chiffres cles)
  |
SectionDividerPremium
  |
ContactSection (CTA + email + localisation)
  |
Footer (logo "A" + liens legaux + copyright)
```

---

## 5. DESIGN SYSTEM (NE PAS MODIFIER SAUF DEMANDE EXPLICITE)

### Palette monochrome
- Background : `hsl(0, 0%, 0%)` (noir pur)
- Foreground : `hsl(0, 0%, 100%)` (blanc pur)
- Card : `hsl(0, 0%, 3%)`
- Muted : `hsl(0, 0%, 12%)` / foreground `55%`
- Border : `hsl(0, 0%, 12%)`

### Typographie
- **Headings** : Playfair Display (serif, elegant)
- **Body** : Inter (sans-serif, lisible)

### Classes CSS custom cles
- `.premium-card` : Carte avec gradient subtil + hover translateY(-8px)
- `.btn-premium-primary` : Bouton blanc sur fond noir
- `.btn-premium-secondary` : Bouton transparent borde
- `.glass-nav-raycast` : Navbar flottante style Raycast
- `.glass-button` : Bouton glassmorphism
- `.premium-badge` : Badge/label en majuscules
- `.text-gradient` : Texte avec degrader blanc->gris
- `.spotlight-card` : Fond avec effet spotlight au survol
- `.job-tag` : Tag pour les offres d'emploi
- `.team-card` : Carte equipe avec ombre profonde

### Composants utilitaires
- `AnimatedSection` : Wrapper Framer Motion pour apparition au scroll (fade-in-up)
- `SpotlightCard` : Carte avec effet radial lumineux suivant la souris
- `SectionDividerPremium` : Ligne de separation animee avec glow
- `ParallaxImage` : Composant parallaxe (existe mais pas encore utilise)
- `CustomCursor` : Curseur SVG custom (desktop uniquement, cache le curseur natif)

---

## 6. DONNEES CENTRALISEES (src/data/)

Toutes les donnees textuelles sont dans des fichiers TypeScript avec schemas Zod :

| Fichier | Contenu |
|---------|---------|
| `partners.ts` | 12 partenaires (Orange, SFR, Free Pro, SPIE, Axians, Sogetrel, Circet, Davidson, Rhon Telecom, TIBCO, ERT, Amaris) |
| `team.ts` | 3 membres (Steven PDG, Maxime Business Manager, Tristan Business Developer) |
| `services.ts` | 5 secteurs (Telecoms, IT/Digital, Cybersecurite, Energie Renouvelable, Industrie) |
| `expertise.ts` | 4 offres (Consulting Externe, Presta+Internalisation, Recrutement, Gestion de Projets) |
| `values.ts` | 4 valeurs + keyFigures + philosophy string |
| `navigation.ts` | Liens nav + CTA "Candidature Spontanee" |

---

## 7. ASSETS DISPONIBLES (public/)

```
public/
  images/
    favicon.jpg          # Logo Acreed (utilise dans navbar)
    favicon2.png         # Variante du favicon
    steven.jpg           # Photo Steven Breuil (PDG)
    maxime.jpg           # Photo Maxime
    tristan.jpg          # Photo Tristan
  videos/
    hero-video.mp4       # Video en fond du hero
  placeholder.svg        # Placeholder generique
```

---

## 8. ETAT D'AVANCEMENT DE LA MIGRATION

Le contenu Acreed a ete migre depuis un ancien projet hybride WRLDS/Acreed.
Voici l'etat par section :

| Section | Contenu migre ? | Notes |
|---------|----------------|-------|
| Navigation | OUI | Liens en ancres, CTA "Candidature Spontanee" |
| HeroSection | OUI | Video, "Fantastique simplicite", stats |
| PartnersMarquee | OUI | 12 partenaires, texte uniquement (pas de logos images) |
| ServicesSection | OUI | 5 secteurs avec icones Lucide |
| ExpertiseSection | OUI | 4 offres de services |
| TeamSection | OUI | 3 membres (Steven, Maxime, Tristan) avec photos |
| JobsSection | PARTIEL | 3 offres (devrait en avoir 4), lien "voir toutes" pointe vers externe |
| AboutSection | OUI | 4 valeurs + 3 chiffres cles |
| ContactSection | PARTIEL | CTA pointe vers acreedconsulting.com (externe), localisation "Lyon" au lieu du Puy-en-Velay |
| Footer | PARTIEL | Logo "A" en texte (pas d'image), liens legaux en # |
| SEO (index.html) | OUI | lang="fr", title/meta OK, OG image encore lovable.dev |

---

## 9. TACHES EN ATTENTE (demandes utilisateur)

D'apres le fichier `Suite projet site Acreedtxt.txt` :

1. **Candidature spontanee** : Creer un popup (pas une page) avec formulaire (nom, prenom, email, message, raison du contact) + zone de depot CV. Le contenu ne doit PAS se perdre si clic hors du popup. Backend a ajouter plus tard.

2. **Page detaillee offres d'emploi** : Le bouton "Voir toutes les offres" doit ouvrir une NOUVELLE PAGE avec le detail complet de chaque offre (pas un lien externe).

3. **Logos partenaires** : Ajouter les vrais logos des clients/partenaires avec un effet noir/blanc -> couleur au survol de la souris.

4. **Casser la repetitivite des blocs** : La structure des sections est trop uniforme. Ajouter de la variete visuelle :
   - Photos en fond de certaines sections (avec fondu)
   - Positionnement alterne (haut-gauche, bas-droite)
   - Rompre la monotonie du scrolling

5. **Animations de mouvement** : Ajouter des animations de defilement/mouvement pour rendre le scroll plus dynamique.

---

## 10. REGLES DE DEVELOPPEMENT

### A FAIRE
- Garder le design monochrome noir/blanc/gris existant
- Utiliser les composants shadcn/ui deja installes
- Utiliser Framer Motion pour toutes les animations
- Centraliser les donnees dans `src/data/`
- Centraliser la navigation dans `src/config/navigation.ts`
- Utiliser les classes CSS custom existantes (.premium-card, .glass-nav, etc.)
- Tester avec `npm run build` apres chaque modification significative

### A NE PAS FAIRE
- NE PAS toucher au design system (index.css) sauf demande explicite
- NE PAS ajouter `cursor: pointer` (le site a un curseur custom)
- NE PAS modifier les composants `src/components/ui/` (shadcn)
- NE PAS ajouter de contenu WRLDS (ancien projet hybride, a ignorer)
- NE PAS creer de fichiers inutiles ou de documentation non demandee
- NE PAS changer les polices (Playfair Display + Inter)

---

## 11. AGENTS DISPONIBLES (Claude Code)

Cette session dispose de plusieurs agents specialises utilisables via l'outil Task :

| Agent | Quand l'utiliser |
|-------|-----------------|
| **acreed-frontend-architect** | Orchestration globale des modules frontend Acreed : refonte navbar, sections, design compliance, glassmorphism, animations. A utiliser proactivement pour tout ce qui touche la landing page. |
| **acreed-ui-motion-designer** | Creation/modification de composants visuels React avec style dark premium, Framer Motion, glassmorphism. Pour tout composant en dessous du Hero/Header. |
| **core-integration-engineer** | Logique fonctionnelle pure (pas de style) : fichiers de donnees, useState, validation formulaire, React Router, smooth scroll, assemblage de composants. |
| **Explore** | Exploration rapide du codebase (recherche de fichiers, patterns, mots-cles). |
| **Plan** | Architecture et planification d'implementation. |
| **Bash** | Execution de commandes terminal (git, npm, etc.). |

### Quand utiliser quel agent ?
- **Nouveau composant visuel** (section, carte, modal) -> `acreed-ui-motion-designer`
- **Logique / donnees / routing** -> `core-integration-engineer`
- **Refonte d'un module existant** -> `acreed-frontend-architect`
- **Recherche dans le code** -> `Explore`
- **Planifier avant de coder** -> `Plan`

---

## 12. CONTACTS & LIENS ACREED

- **Steven Breuil** (PDG) : steven.breuil@acreedconsulting.com
- **LinkedIn Steven** : https://www.linkedin.com/in/steven-breuil-824330110
- **LinkedIn Societe** : https://www.linkedin.com/company/acreedconsutling/
- **Email recrutement** : recrutement@acreedconsulting.com
- **Email general** : contact@acreedconsulting.com
- **Localisation** : Le Puy-en-Velay, Haute-Loire (France)

---

## 13. FICHIERS DE REFERENCE

- `CLAUDE.md` : Instructions techniques pour Claude Code
- `PLAN-MIGRATION-CONTENU.md` : Plan detaille de migration contenu ancien site
- `Suite projet site Acreedtxt.txt` : Liste des prochaines taches demandees par l'utilisateur
- `regles du jeu.md` : CE FICHIER - reference absolue pour chaque session

---

*Derniere mise a jour : 11 fevrier 2026*
