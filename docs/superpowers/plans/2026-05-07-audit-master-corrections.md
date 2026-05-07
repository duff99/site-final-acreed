# Audit Master — Plan de corrections globales

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger tous les findings de l'Audit Master du 2026-05-07 (frontend, backend, sécurité, RGPD, wiring) pour rendre le site Acreed Consulting prêt au lancement officiel et propre techniquement.

**Architecture:** Plan en 5 jalons séquentiels. Jalon 1 = bloquants launch. Jalon 2 = sécurité/RGPD. Jalon 3 = cohérence produit & câblage. Jalon 4 = tests backend. Jalon 5 = nettoyage code mort. Chaque jalon est commitable indépendamment et laisse le site dans un état déployable.

**Tech Stack:** React 18 + Vite + TS + Tailwind + shadcn/ui + Framer Motion + React Hook Form + Zod (front) ; Express 4 + Drizzle ORM + libsql/SQLite + JWT + bcrypt + nodemailer (back) ; nginx + Docker (infra).

**Source des findings :** rapports de 4 subagents (Frontend UI/UX, Backend API, Sécurité/RGPD, Wiring & Features) — synthèse dans la conversation du 2026-05-07.

---

## Conventions

- **Branch model :** une branche par jalon (`fix/jalon-1-blockers`, `fix/jalon-2-security`, etc.). Merge dans `main` à chaque fin de jalon.
- **Commits :** Conventional Commits (`fix:`, `feat:`, `chore:`, `refactor:`, `test:`).
- **Vérif avant commit :** `npx tsc --noEmit` (front) + `cd server && npx tsc --noEmit` (back) + `npm run lint` doivent passer.
- **Aucune modif de la règle "monochrome strict"** sans demander à Tdufr — la couleur `#dbcca5` (doré) est déjà partout, l'arbitrage est dans Jalon 3.
- **Aucune action irréversible** (UFW prod, DNS, push force) sans confirmation.

---

# JALON 1 — Bloquants launch (1-2 j)

Branche : `fix/jalon-1-blockers`. Doit produire un site déployable sans bug bloquant.

---

### Task 1.1 — Fix build backend cassé (`noEmit`)

**Files:**
- Modify: `server/tsconfig.json`

**Why:** `"noEmit": true` empêche `tsc` de générer `dist/`. `npm start` (`node dist/index.js`) échoue en prod. Aujourd'hui le serveur tourne via `tsx` ; il faut soit corriger le build TS, soit assumer le mode `tsx` en prod et retirer le script `build` mensonger.

- [ ] **Step 1 :** Lire `server/tsconfig.json` et confirmer ligne `"noEmit": true`.

- [ ] **Step 2 :** Choisir option A (compile to dist) ou B (assume tsx). Recommandé : **A** pour avoir un fallback sans tsx.

- [ ] **Step 3 (option A) :** Modifier `server/tsconfig.json` :
  ```json
  {
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": "./src",
      // retirer ou mettre à false :
      "noEmit": false,
      "declaration": false,
      "sourceMap": true
    },
    "include": ["src/**/*", "../shared/**/*"]
  }
  ```

- [ ] **Step 4 :** Vérifier le résultat :
  ```bash
  cd server && rm -rf dist && npm run build && ls dist/
  ```
  Attendu : `index.js`, dossier `routes/`, `db/`, etc.

- [ ] **Step 5 :** Tester le démarrage compilé :
  ```bash
  cd server && NODE_ENV=production node dist/index.js
  ```
  Attendu : "API listening on :3001". Ctrl+C.

- [ ] **Step 6 :** Commit
  ```bash
  git add server/tsconfig.json
  git commit -m "fix(server): enable tsc emit so npm run build produces dist/"
  ```

---

### Task 1.2 — Fix bug hooks React `ParticleCanvas`

**Files:**
- Modify: `src/components/ParticleCanvas.tsx`

**Why:** `if (skip) return null;` (ligne ~31) se trouve **entre deux appels `useEffect`**. Violation de la rule of hooks → "Rendered fewer hooks than expected" potentiel quand `skip` flippe.

- [ ] **Step 1 :** Lire `src/components/ParticleCanvas.tsx` lignes 1-60. Localiser le `return null` problématique.

- [ ] **Step 2 :** Refactor — déplacer la condition à l'**intérieur** des effets, ou tout en bas du composant après tous les hooks. Pattern correct :
  ```tsx
  export function ParticleCanvas({ ... }) {
    const skip = isMobile || prefersReducedMotion;
    const ref = useRef(null);

    useEffect(() => {
      if (skip) return;
      // logique...
    }, [skip, ...]);

    useEffect(() => {
      if (skip) return;
      // autre logique...
    }, [skip, ...]);

    if (skip) return null; // OK ici, après tous les hooks
    return <canvas ref={ref} ... />;
  }
  ```

- [ ] **Step 3 :** Type-check
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 4 :** Commit
  ```bash
  git add src/components/ParticleCanvas.tsx
  git commit -m "fix(particles): move early-return after hooks to respect rules-of-hooks"
  ```

---

### Task 1.3 — Câbler la candidature spontanée bout-en-bout

**Files:**
- Modify: `src/pages/Jobs.tsx` (CTA mailto à remplacer)
- Modify: `src/components/SpontaneousApplicationModal.tsx` OU supprimer + réutiliser `ApplicationModal`
- Verify: `server/src/routes/applications.ts` accepte `jobId === 'spontaneous'` ou équivalent

**Why:** `Jobs.tsx:457` envoie un `mailto:` brut → leads non tracés. `SpontaneousApplicationModal.tsx:120` mock avec `setTimeout`. Le candidat dépose son CV (lien) sans qu'il atteigne ni la DB ni l'email recruitment.

- [ ] **Step 1 :** Décider stratégie. **Recommandé :** étendre `ApplicationModal` avec un mode `mode: "spontaneous" | "job"` plutôt que maintenir 2 composants. Option B : câbler `SpontaneousApplicationModal` proprement.

- [ ] **Step 2 (option A) :** Modifier `ApplicationModal.tsx` pour accepter `job?: Job` optionnel. Si `job` absent → mode spontané (cacher le titre du job, ajouter champ "secteur souhaité" si utile).

- [ ] **Step 3 :** Vérifier `shared/schemas.ts` `createApplicationSchema` — `jobId` doit être optionnel ou accepter une valeur sentinelle :
  ```ts
  jobId: z.string().min(1).optional(), // ou .nullable()
  ```

- [ ] **Step 4 :** Vérifier `server/src/routes/applications.ts` — gérer `jobId` absent (insérer null + flag `is_spontaneous` si on veut filtrer dans l'admin).

- [ ] **Step 5 :** Modifier le schéma DB `server/src/db/schema.ts` :
  ```ts
  jobId: text('job_id'), // nullable
  isSpontaneous: integer('is_spontaneous', { mode: 'boolean' }).default(false),
  ```
  Ajouter migration idempotente dans `db/index.ts` (try/catch ALTER).

- [ ] **Step 6 :** Modifier `Jobs.tsx:457` — remplacer le `<motion.a href="mailto:...">` par un bouton qui ouvre `<ApplicationModal mode="spontaneous">`.

- [ ] **Step 7 :** Si option A retenue : supprimer `src/components/SpontaneousApplicationModal.tsx`.

- [ ] **Step 8 :** Test manuel
  ```bash
  npm run dev # terminal 1
  cd server && npm run dev # terminal 2
  ```
  - Aller sur `/offres`, cliquer "Candidature spontanée"
  - Remplir, soumettre
  - Vérifier en DB : `sqlite3 server/data/acreed.db "SELECT * FROM applications WHERE job_id IS NULL OR is_spontaneous = 1"`
  - Vérifier que l'admin panel `/admin/candidatures` affiche la candidature

- [ ] **Step 9 :** Commit
  ```bash
  git add -A
  git commit -m "fix(applications): wire spontaneous application end-to-end (replace mailto + remove mocked modal)"
  ```

---

### Task 1.4 — Ajouter section "Nos clients" au menu

**Files:**
- Modify: `src/components/PartnersMarquee.tsx` (ajouter `id`)
- Modify: `src/config/navigation.ts` (ajouter entrée)

**Why:** `PartnersMarquee` est rendu dans `Index.tsx` mais absent du menu nav. Section sans `id` donc non ancrable. ClientsSection.tsx existe mais orpheline (sera supprimée Jalon 5).

- [ ] **Step 1 :** Modifier `src/components/PartnersMarquee.tsx:10` :
  ```tsx
  <section id="clients" className="py-20 overflow-hidden scroll-mt-24">
  ```

- [ ] **Step 2 :** Modifier `src/config/navigation.ts` — ajouter dans `navLinks` à la position cohérente avec l'ordre DOM (après `#histoire`, avant `#contact`) :
  ```ts
  { href: '#clients', label: 'Nos clients' },
  ```

- [ ] **Step 3 :** Test manuel : `npm run dev`, cliquer "Nos clients" dans la nav, vérifier le scroll smooth jusqu'à la section.

- [ ] **Step 4 :** Commit
  ```bash
  git add src/components/PartnersMarquee.tsx src/config/navigation.ts
  git commit -m "feat(nav): add 'Nos clients' menu entry pointing to PartnersMarquee section"
  ```

---

### Task 1.5 — Aligner domaine SEO

**Files:**
- Modify: `public/sitemap.xml`
- Modify: `public/robots.txt`
- Verify: `src/components/SEO.tsx`

**Why:** `sitemap.xml` et `robots.txt` référencent `www.acreedconsulting.com` ; `SEO.tsx:3` utilise `https://site.acreedconsulting.com`. Google va voir 2 origines distinctes → dilution.

**DÉCISION TDUFR (2026-05-07) :** garder `site.acreedconsulting.com` pour l'instant — l'ancien site tourne encore sur `www.`. Bascule sur `www.` à faire **avant déploiement final** (cf. tâche post-launch dédiée).

- [ ] **Step 2 :** Modifier `public/sitemap.xml` pour utiliser `https://site.acreedconsulting.com/...` (aligner sur `SEO.tsx`).

- [ ] **Step 3 :** Vérifier `public/robots.txt` — sitemap et host alignés sur `site.`.

- [ ] **Step 5 :** Vérifier qu'il n'y a pas d'autres références hardcodées :
  ```bash
  grep -rn "site.acreedconsulting.com\|www.acreedconsulting.com" src/ public/ server/ nginx.conf
  ```

- [ ] **Step 6 :** Mettre à jour `nginx.conf` / `site.acreedconsulting.com.nginx` si besoin (server_name + redirect 301 du non-canonical vers le canonical).

- [ ] **Step 7 :** Commit
  ```bash
  git add -A
  git commit -m "fix(seo): unify canonical domain to www.acreedconsulting.com across sitemap, robots, SEO component"
  ```

---

### Task 1.6 — Sécuriser exposition réseau API/frontend (UFW + docker-compose)

**Files:**
- Modify: `docker-compose.yml`

**Why:** API mappée sur `0.0.0.0:3001` et frontend sur `0.0.0.0:8888` → joignables hors nginx, bypass HSTS + CSP + tous les headers du host.

- [ ] **Step 1 :** Lire `docker-compose.yml` actuel, repérer les `ports:` mappings.

- [ ] **Step 2 :** Modifier en bindant explicitement sur loopback :
  ```yaml
  services:
    api:
      ports:
        - "127.0.0.1:3001:3001"
    frontend:
      ports:
        - "127.0.0.1:8888:80"
  ```
  nginx host (qui tourne sur la VM, pas dans Docker) accède via 127.0.0.1.

- [ ] **Step 3 :** Vérifier que la conf nginx host (`site.acreedconsulting.com.nginx`) `proxy_pass` pointe bien vers `127.0.0.1:8888` et `127.0.0.1:3001`.

- [ ] **Step 4 :** Sur la VM prod (action manuelle, à exécuter avec Tdufr) :
  ```bash
  sudo ufw status
  sudo ufw deny 3001
  sudo ufw deny 8888
  sudo ufw status numbered
  ```

- [ ] **Step 5 :** Redéployer le stack Docker :
  ```bash
  docker-compose down && docker-compose up -d --build
  curl http://VM_PUBLIC_IP:3001/api/health  # doit timeout / refuse connection
  curl https://www.acreedconsulting.com/api/health  # doit fonctionner
  ```

- [ ] **Step 6 :** Commit
  ```bash
  git add docker-compose.yml
  git commit -m "fix(infra): bind api and frontend to 127.0.0.1 to force traffic through nginx"
  ```

---

### Task 1.7 — Activer CSP en mode bloquant

**Files:**
- Modify: `nginx.conf` (ligne ~22)

**Why:** CSP toujours en `Report-Only` "le temps d'observer". L'observation est passée. Garder Report-Only en prod laisse XSS exploitables non bloqués.

- [ ] **Step 1 :** Lire `nginx.conf` lignes 18-25.

- [ ] **Step 2 :** Renommer le header :
  ```nginx
  # Avant :
  add_header Content-Security-Policy-Report-Only "...";
  # Après :
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
  ```
  (Garder le contenu de la directive existante, juste retirer `-Report-Only`.)

- [ ] **Step 3 :** Test local :
  ```bash
  docker-compose restart frontend
  curl -I https://www.acreedconsulting.com | grep -i content-security
  ```
  Attendu : `Content-Security-Policy:` (pas `-Report-Only`).

- [ ] **Step 4 :** Smoke test du site complet en navigateur — surveiller la console pour des `Refused to load` qui n'apparaissaient pas en mode Report-Only.

- [ ] **Step 5 :** Commit
  ```bash
  git add nginx.conf
  git commit -m "fix(security): enforce CSP (move from Report-Only to blocking mode)"
  ```

---

### 🔁 Fin Jalon 1 — Merge

- [ ] `git checkout main && git merge --no-ff fix/jalon-1-blockers && git push`

---

# JALON 2 — Sécurité & RGPD (1 j)

Branche : `fix/jalon-2-security-rgpd`.

---

### Task 2.1 — Renforcer password policy admin

**Files:**
- Modify: `shared/schemas.ts` (createAdminSchema, ~ligne 73)

**Why:** Min 8 chars actuel, sans complexité. Insuffisant pour un compte admin.

- [ ] **Step 1 :** Modifier `createAdminSchema` :
  ```ts
  password: z.string()
    .min(12, 'Le mot de passe doit faire au moins 12 caractères')
    .regex(/[a-z]/, 'Doit contenir une minuscule')
    .regex(/[A-Z]/, 'Doit contenir une majuscule')
    .regex(/[0-9]/, 'Doit contenir un chiffre')
    .regex(/[^a-zA-Z0-9]/, 'Doit contenir un caractère spécial'),
  ```

- [ ] **Step 2 :** Vérifier que `changePasswordSchema` (auth.ts:227) applique aussi cette règle au nouveau password.

- [ ] **Step 3 :** Tester via formulaire admin de création utilisateur (`/admin/users/new`) — un password "azerty12" doit être refusé avec message clair.

- [ ] **Step 4 :** Commit
  ```bash
  git add shared/schemas.ts
  git commit -m "fix(security): require strong admin passwords (12 chars + 4 char classes)"
  ```

---

### Task 2.2 — Échapper `</script>` dans JobJsonLd

**Files:**
- Modify: `src/components/JobJsonLd.tsx` (ligne ~43)

**Why:** `JSON.stringify` n'échappe pas `</script>` ni `<!--`. Si un champ job contient `</script>`, sortie du contexte JSON-LD → XSS.

- [ ] **Step 1 :** Lire `JobJsonLd.tsx:30-50`.

- [ ] **Step 2 :** Modifier la sérialisation :
  ```tsx
  const safeJsonLd = JSON.stringify(jsonLd)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd }}
    />
  );
  ```

- [ ] **Step 3 :** Vérifier visuellement que Google's Rich Results Test (https://search.google.com/test/rich-results) accepte toujours le JSON-LD avec ces escapes Unicode (réponse : oui, c'est du JSON valide).

- [ ] **Step 4 :** Commit
  ```bash
  git add src/components/JobJsonLd.tsx
  git commit -m "fix(security): escape <, >, & in JobJsonLd to prevent script breakout"
  ```

---

### Task 2.3 — Définir durée de conservation RGPD + script de purge

**Files:**
- Create: `server/src/lib/data-retention.ts`
- Modify: `server/src/index.ts` (lancer la purge périodique)
- Modify: `src/pages/Confidentialite.tsx` (documenter durées)

**Why:** RGPD impose une durée définie. Aujourd'hui aucune purge des `applications` ni `contact_messages`.

- [ ] **Step 1 :** Définir les durées (à valider Tdufr) :
  - `contact_messages` : 3 ans après réception
  - `applications` (CV externe) : 24 mois après dernier contact

- [ ] **Step 2 :** Créer `server/src/lib/data-retention.ts` :
  ```ts
  import { db } from '../db';
  import { contactMessages, applications } from '../db/schema';
  import { lt } from 'drizzle-orm';

  const THREE_YEARS_MS = 3 * 365 * 24 * 60 * 60 * 1000;
  const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

  export async function purgeExpiredData() {
    const now = Date.now();
    const messagesCutoff = new Date(now - THREE_YEARS_MS);
    const applicationsCutoff = new Date(now - TWO_YEARS_MS);

    const [m] = await db.delete(contactMessages)
      .where(lt(contactMessages.createdAt, messagesCutoff))
      .returning({ id: contactMessages.id });

    const [a] = await db.delete(applications)
      .where(lt(applications.createdAt, applicationsCutoff))
      .returning({ id: applications.id });

    console.log(`[retention] Purged ${m?.length ?? 0} messages, ${a?.length ?? 0} applications`);
  }
  ```

- [ ] **Step 3 :** Dans `server/src/index.ts`, lancer la purge au boot + tous les jours :
  ```ts
  import { purgeExpiredData } from './lib/data-retention';
  // ...après app.listen :
  purgeExpiredData().catch(console.error);
  setInterval(() => purgeExpiredData().catch(console.error), 24 * 60 * 60 * 1000);
  ```

- [ ] **Step 4 :** Modifier `src/pages/Confidentialite.tsx` — ajouter section "Durées de conservation" :
  ```tsx
  <h2>Durées de conservation</h2>
  <ul>
    <li>Messages de contact : 3 ans à compter de la réception</li>
    <li>Candidatures : 24 mois à compter du dernier contact</li>
    <li>Comptes administrateurs : durée de la collaboration + 1 an</li>
  </ul>
  ```

- [ ] **Step 5 :** Commit
  ```bash
  git add server/src/lib/data-retention.ts server/src/index.ts src/pages/Confidentialite.tsx
  git commit -m "feat(rgpd): add automated data retention (3y messages, 24mo applications) + document policy"
  ```

---

### Task 2.4 — Compléter placeholder téléphone Mentions Légales

**Files:**
- Modify: `src/pages/MentionsLegales.tsx` (ligne 62)

**DÉCISION TDUFR :** pas de téléphone public — supprimer la ligne entière.

- [ ] **Step 2 :** Retirer la ligne `['Téléphone', '[À COMPLÉTER]']` du tableau dans `MentionsLegales.tsx:62`.

- [ ] **Step 3 :** Commit
  ```bash
  git add src/pages/MentionsLegales.tsx
  git commit -m "fix(legal): complete or remove telephone placeholder in mentions légales"
  ```

---

### 🔁 Fin Jalon 2 — Merge

- [ ] `git checkout main && git merge --no-ff fix/jalon-2-security-rgpd && git push`

---

# JALON 3 — Cohérence produit & câblage (1-2 j)

Branche : `fix/jalon-3-product-consistency`.

---

### Task 3.1 — Refactor formulaire de contact (RHF + Zod)

**Files:**
- Modify: `src/pages/Contact.tsx`

**Why:** Le form utilise `useState` + `fetch` brut. Convention CLAUDE.md = `react-hook-form` + `zodResolver` exclusif. Risque de divergence avec backend.

- [ ] **Step 1 :** Importer dépendances :
  ```tsx
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
  import { createContactSchema, type CreateContactInput } from '@shared/schemas';
  import { apiClient } from '@/lib/api';
  ```

- [ ] **Step 2 :** Remplacer le bloc `useState` + handlers par :
  ```tsx
  const form = useForm<CreateContactInput>({
    resolver: zodResolver(createContactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '', consent: true, website: '' },
  });

  const onSubmit = async (data: CreateContactInput) => {
    try {
      await apiClient.sendContact(data);
      form.reset();
      toast({ title: 'Message envoyé !', description: 'Nous vous répondons sous 48h.' });
    } catch (err) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    }
  };
  ```

- [ ] **Step 3 :** Reconvertir le JSX en `<Form {...form}><form onSubmit={form.handleSubmit(onSubmit)}>...</form></Form>` avec `<FormField>` pour chaque champ (réutiliser le pattern d'`ApplicationModal.tsx`).

- [ ] **Step 4 :** Vérifier que `apiClient.sendContact` existe ; sinon l'ajouter dans `src/lib/api.ts`.

- [ ] **Step 5 :** Test manuel : soumettre un formulaire vide → erreurs Zod par champ. Soumettre un email invalide → erreur ciblée.

- [ ] **Step 6 :** Commit
  ```bash
  git add src/pages/Contact.tsx src/lib/api.ts
  git commit -m "refactor(contact): use react-hook-form + zodResolver per project convention"
  ```

---

### Task 3.2 — Enrichir Dashboard admin (KPI messages/candidatures)

**Files:**
- Modify: `src/pages/admin/AdminDashboard.tsx`

- [ ] **Step 1 :** Ajouter hooks :
  ```tsx
  const { data: messages } = useAdminContactMessages();
  const { data: applications } = useAdminApplications();
  const unreadMessages = messages?.filter(m => !m.read).length ?? 0;
  const newApplications = applications?.filter(a => a.status === 'new').length ?? 0;
  ```

- [ ] **Step 2 :** Ajouter 2 cards KPI à côté des stats jobs.

- [ ] **Step 3 :** Commit
  ```bash
  git add src/pages/admin/AdminDashboard.tsx
  git commit -m "feat(admin): show unread messages and new applications counts on dashboard"
  ```

---

### Task 3.3 — Corriger Footer "Contact" → contact@ (au lieu de recrutement@)

**Files:**
- Modify: `src/components/Footer.tsx` (ligne ~47)

- [ ] **Step 1 :** Remplacer `mailto:recrutement@acreedconsulting.com` par `mailto:contact@acreedconsulting.com` sur le lien "Contact" du footer.

- [ ] **Step 2 :** Vérifier qu'aucun autre lien "Contact" du site ne pointe vers recrutement par erreur.

- [ ] **Step 3 :** Commit
  ```bash
  git add src/components/Footer.tsx
  git commit -m "fix(footer): point 'Contact' link to contact@ instead of recrutement@"
  ```

---

### Task 3.4 — Page détail offre `/offres/:id`

**Files:**
- Create: `src/pages/JobDetail.tsx`
- Modify: `src/App.tsx` (ajouter route)
- Modify: `src/components/JobsSection.tsx` (link vers /offres/:id au lieu de #anchor)
- Modify: `src/pages/Jobs.tsx` (link vers /offres/:id)
- Modify: `src/components/JobJsonLd.tsx` (canonical URL par offre)

**Why:** Aujourd'hui `JobJsonLd` rend tous les `JobPosting` sur une seule URL `/offres`. Pas de partage social ciblé.

- [ ] **Step 1 :** Créer `src/pages/JobDetail.tsx` :
  ```tsx
  import { useParams, Navigate } from 'react-router-dom';
  import { useJob } from '@/hooks/use-jobs';
  import { JobJsonLd } from '@/components/JobJsonLd';
  import { SEO } from '@/components/SEO';
  import { Navigation } from '@/components/Navigation';
  import { Footer } from '@/components/Footer';
  import { ApplicationModal } from '@/components/ApplicationModal';
  // ... (réutiliser le rendu de Jobs.tsx pour une carte unique)

  export default function JobDetail() {
    const { id } = useParams();
    const { data: job, isLoading, error } = useJob(id!);
    if (error) return <Navigate to="/offres" replace />;
    if (isLoading || !job) return <RouteFallback />;
    return (
      <>
        <SEO title={`${job.title} — Acreed Consulting`} description={job.description.slice(0, 160)} />
        <JobJsonLd job={job} canonicalUrl={`https://www.acreedconsulting.com/offres/${job.id}`} />
        <Navigation />
        {/* rendu fiche détaillée + bouton Postuler */}
        <Footer />
      </>
    );
  }
  ```

- [ ] **Step 2 :** Ajouter le hook `useJob(id)` dans `src/hooks/use-jobs.ts` si absent.

- [ ] **Step 3 :** Ajouter route dans `src/App.tsx` :
  ```tsx
  <Route path="/offres/:id" element={<JobDetail />} />
  ```

- [ ] **Step 4 :** Modifier `JobsSection.tsx:43` : remplacer `to={\`/offres#\${job.id}\`}` par `to={\`/offres/\${job.id}\`}`.

- [ ] **Step 5 :** Modifier `Jobs.tsx` carte job : ajouter un lien "Voir l'offre" vers `/offres/:id`.

- [ ] **Step 6 :** Modifier `JobJsonLd.tsx` pour accepter un prop `canonicalUrl` et l'inclure dans le JSON.

- [ ] **Step 7 :** Vérifier que le sitemap est généré dynamiquement OU ajouter une route `/sitemap.xml` côté Express qui retourne le sitemap dynamique. **Décision rapide :** garder le sitemap statique pour le launch, ajouter la génération dynamique en post-launch.

- [ ] **Step 8 :** Commit
  ```bash
  git add -A
  git commit -m "feat(jobs): add /offres/:id detail page for SEO and social sharing"
  ```

---

### Task 3.5 — NotFound en français + chrome cohérent

**Files:**
- Modify: `src/pages/NotFound.tsx`

- [ ] **Step 1 :** Remplacer textes anglais → français : "Oops! Page not found" → "Page introuvable", "Return to Home" → "Retour à l'accueil".

- [ ] **Step 2 :** Ajouter `<Navigation />` et `<Footer />` autour du contenu pour préserver l'identité.

- [ ] **Step 3 :** Commit
  ```bash
  git add src/pages/NotFound.tsx
  git commit -m "fix(404): translate to French and add Navigation/Footer chrome"
  ```

---

### Task 3.6 — Arbitrer la règle "monochrome strict" vs `#dbcca5`

**Files:**
- Modify: `CLAUDE.md` (mettre à jour la règle si on garde le doré)
- OU: refactor du doré vers un gris (si on garde la règle stricte)

**Why:** La règle CLAUDE.md dit "noir/blanc/gris uniquement". Le code utilise massivement `#dbcca5` (doré). Soit la règle est obsolète, soit le code dévie.

**DÉCISION TDUFR :** on garde le doré là où il est. La règle "monochrome strict" du CLAUDE.md est un vestige obsolète.

- [ ] **Step 2 :** Modifier CLAUDE.md section "Styling Conventions" :
  ```
  Palette : noir, blanc, gris + accent doré (#dbcca5) pour les CTA et accents premium.
  ```

- [ ] **Step 3 :** Corriger `cursor: pointer` dans `Footer.css:101` et `HistorySection.css:257` — supprimer les déclarations.

- [ ] **Step 4 :** Commit
  ```bash
  git add CLAUDE.md src/components/Footer.css src/components/HistorySection.css
  git commit -m "chore(style): clarify color rule (gold accent allowed) + remove forbidden cursor:pointer"
  ```

---

### Task 3.7 — Image OG 1200×630

**Files:**
- Add: `public/og-image.jpg` (ou `.png`)
- Modify: `src/components/SEO.tsx` (default image path)

**DÉCISION TDUFR :** l'agent génère l'OG image à partir des assets existants (pas d'asset fourni externe).

- [ ] **Step 1 :** Choisir la photo source la plus représentative dans `public/images/` (recommandé : `photo-chapelle.png` ou `service-telecom.jpg` — image landscape avec branding Acreed). À défaut, composer une image branded (logo + tagline sur fond foncé).

- [ ] **Step 2 :** Générer via ImageMagick (déjà installé sur la VM) :
  ```bash
  convert public/images/photo-chapelle.png \
    -resize 1200x630^ -gravity center -extent 1200x630 \
    -quality 85 \
    public/og-image.jpg
  identify public/og-image.jpg  # vérifier 1200x630
  ```
  Optionnel — overlay logo en bas-droite :
  ```bash
  convert public/og-image.jpg \
    \( public/images/favicon_footer.png -resize 120x120 \) \
    -gravity southeast -geometry +30+30 -composite \
    public/og-image.jpg
  ```

- [ ] **Step 3 :** Modifier `SEO.tsx` `DEFAULT_OG_IMAGE` pour pointer vers `/og-image.jpg`.

- [ ] **Step 4 :** Tester via https://www.opengraph.xyz/ ou https://cards-dev.twitter.com/validator.

- [ ] **Step 5 :** Commit
  ```bash
  git add public/og-image.jpg src/components/SEO.tsx
  git commit -m "feat(seo): add 1200x630 OG image for social previews"
  ```

---

### 🔁 Fin Jalon 3 — Merge

- [ ] `git checkout main && git merge --no-ff fix/jalon-3-product-consistency && git push`

---

# JALON 4 — Tests backend (1 j)

Branche : `fix/jalon-4-backend-tests`.

**Why:** Refresh rotation, lockout, RBAC sont complexes et non testés. Risque régression élevé sur des flux sécurité.

---

### Task 4.1 — Setup Vitest côté serveur

**Files:**
- Modify: `server/package.json`
- Create: `server/vitest.config.ts`
- Create: `server/src/test-utils/db.ts` (helper DB en mémoire)

- [ ] **Step 1 :** Installer
  ```bash
  cd server && npm i -D vitest supertest @types/supertest
  ```

- [ ] **Step 2 :** Ajouter scripts :
  ```json
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
  ```

- [ ] **Step 3 :** Créer `server/vitest.config.ts` :
  ```ts
  import { defineConfig } from 'vitest/config';
  export default defineConfig({
    test: { environment: 'node', globals: true, setupFiles: ['./src/test-utils/setup.ts'] },
    resolve: { alias: { '@shared': '../shared' } },
  });
  ```

- [ ] **Step 4 :** Helper DB en mémoire libsql `:memory:` dans `test-utils/db.ts` (cloner `db/index.ts` mais avec URL mémoire).

- [ ] **Step 5 :** Commit
  ```bash
  git add server/package.json server/vitest.config.ts server/src/test-utils/
  git commit -m "chore(server): setup vitest + supertest infrastructure"
  ```

---

### Task 4.2 — Tests auth (login, lockout, refresh rotation)

**Files:**
- Create: `server/src/routes/auth.test.ts`

- [ ] **Step 1 :** Test login OK :
  ```ts
  it('login returns access token + sets refresh cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/acreed_session=/);
  });
  ```

- [ ] **Step 2 :** Test lockout après 5 échecs.

- [ ] **Step 3 :** Test refresh rotation : refresh → ancien jti revoked → reuse de l'ancien doit revoke tous les tokens de l'admin (replay detection).

- [ ] **Step 4 :** Test logout → cookie cleared, jti revoked.

- [ ] **Step 5 :** Test change-password → toutes les sessions actives révoquées.

- [ ] **Step 6 :** Run + commit
  ```bash
  cd server && npm test
  git add server/src/routes/auth.test.ts
  git commit -m "test(auth): cover login, lockout, refresh rotation, logout, change-password"
  ```

---

### Task 4.3 — Tests RBAC

**Files:**
- Create: `server/src/middleware/authorize.test.ts`
- Create: `server/src/routes/admin-users.test.ts`

- [ ] **Step 1 :** Tester `requireRole('admin')` rejette un editor avec 403.

- [ ] **Step 2 :** Tester qu'un editor peut créer/modifier un job mais pas le supprimer.

- [ ] **Step 3 :** Tester qu'un editor reçoit 403 sur `/api/admin/users/*`.

- [ ] **Step 4 :** Run + commit
  ```bash
  cd server && npm test
  git add server/src/
  git commit -m "test(rbac): cover role gates on admin endpoints"
  ```

---

### Task 4.4 — Tests validation Zod sur endpoints publics

**Files:**
- Create: `server/src/routes/contact.test.ts`
- Create: `server/src/routes/applications.test.ts`

- [ ] **Step 1 :** Test honeypot rempli → message rejeté silencieusement.

- [ ] **Step 2 :** Test consent absent → 400.

- [ ] **Step 3 :** Test rate-limit dépassé → 429.

- [ ] **Step 4 :** Run + commit
  ```bash
  git add server/src/routes/
  git commit -m "test(public): cover contact and applications validation + honeypot + rate limit"
  ```

---

### 🔁 Fin Jalon 4 — Merge

- [ ] `git checkout main && git merge --no-ff fix/jalon-4-backend-tests && git push`

---

# JALON 5 — Nettoyage code mort & dette (0.5 j)

Branche : `chore/jalon-5-cleanup`.

---

### Task 5.1 — Supprimer composants frontend morts

**Files à supprimer :**
- `src/components/ClientsSection.tsx`
- `src/components/ParallaxImage.tsx`
- `src/components/SectionDivider.tsx`
- `src/components/HeroSection.css`
- `src/App.css`

- [ ] **Step 1 :** Vérifier zéro import sur chacun :
  ```bash
  for f in ClientsSection ParallaxImage SectionDivider; do
    echo "=== $f ==="
    grep -rn "from.*$f" src/ || echo "(no imports)"
  done
  grep -rn "HeroSection.css\|App.css" src/
  ```
  Tous doivent être sans import (sauf leurs propres fichiers).

- [ ] **Step 2 :** Supprimer
  ```bash
  rm src/components/ClientsSection.tsx src/components/ParallaxImage.tsx src/components/SectionDivider.tsx src/components/HeroSection.css src/App.css
  ```

- [ ] **Step 3 :** Type-check + lint
  ```bash
  npx tsc --noEmit && npm run lint
  ```

- [ ] **Step 4 :** Commit
  ```bash
  git add -A
  git commit -m "chore(cleanup): remove dead components ClientsSection, ParallaxImage, SectionDivider, HeroSection.css, App.css"
  ```

---

### Task 5.2 — Supprimer `/vision` (AcreedVisionPremium) — code mort

**DÉCISION TDUFR :** page jamais liée → code mort → suppression complète.

**Files à supprimer :**
- `src/pages/AcreedVisionPremium.tsx`
- `src/data/values.ts`

**Files à modifier :**
- `src/App.tsx` (retirer la route `/vision`)
- `public/sitemap.xml` (retirer l'entrée si présente)

- [ ] **Step 1 :** Vérifier qu'aucun lien interne ne pointe vers `/vision` :
  ```bash
  grep -rn "/vision\|AcreedVisionPremium\|values.ts\|@/data/values" src/ public/
  ```
  Seuls résultats attendus : la route dans `App.tsx`, l'import dans la page elle-même, et `data/values.ts` lui-même.

- [ ] **Step 2 :** Retirer la route dans `src/App.tsx` (line ~53) et l'import lazy associé.

- [ ] **Step 3 :** Supprimer les fichiers :
  ```bash
  rm src/pages/AcreedVisionPremium.tsx src/data/values.ts
  ```

- [ ] **Step 4 :** Vérifier qu'aucune entrée `/vision` n'existe dans `public/sitemap.xml` (la retirer si oui).

- [ ] **Step 5 :** Type-check + lint :
  ```bash
  npx tsc --noEmit && npm run lint
  ```

- [ ] **Step 6 :** Commit
  ```bash
  git add -A
  git commit -m "chore(cleanup): remove orphan /vision page (AcreedVisionPremium) and unused values data file"
  ```

---

### Task 5.3 — Câbler ou supprimer `services.ts` / `expertise.ts` orphelins

- [ ] **Step 1 :** Décider : refactorer `ServicesSection.tsx` et `ExpertiseSection.tsx` pour consommer leurs data files Zod-validés (préférable maintenance), ou supprimer les data files.

- [ ] **Step 2 (refactor recommandé) :** Importer les data files dans les sections, mapper sur le rendu existant. Avantage : modifier "Télécoms" devient un seul endroit.

- [ ] **Step 3 :** Commit
  ```bash
  git commit -m "refactor(sections): wire ServicesSection and ExpertiseSection to typed data files"
  ```

---

### Task 5.4 — Nettoyer hooks orphelins

**Files:**
- Modify: `src/hooks/use-admin-contact.ts`
- Modify: `src/hooks/use-admin-applications.ts`

- [ ] **Step 1 :** Vérifier si `useAdminContactMessage(id)` et `useAdminApplication(id)` sont consommés. Sinon supprimer leur export.

- [ ] **Step 2 :** Commit
  ```bash
  git commit -m "chore(hooks): remove unused detail hooks"
  ```

---

### Task 5.5 — Nettoyer schéma DB

**Files:**
- Modify: `server/src/db/schema.ts` (retirer `cv_filename`)
- Modify: `server/src/db/index.ts` (DDL initial — ajouter `failedLoginAttempts`/`lockedUntil` directement, retirer `cv_filename`)

- [ ] **Step 1 :** Retirer `cvFilename` du schéma `contactMessages` (jamais utilisé).

- [ ] **Step 2 :** Aligner DDL initial avec le schéma Drizzle :
  ```sql
  CREATE TABLE IF NOT EXISTS admins (
    ...
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER,
    ...
  );
  ```

- [ ] **Step 3 :** Garder les `ALTER` idempotents pour les bases existantes.

- [ ] **Step 4 :** Commit
  ```bash
  git commit -m "chore(db): align DDL with Drizzle schema and remove unused cv_filename column"
  ```

---

### Task 5.6 — Indexes SQLite + validation query `sector` + RBAC defense-in-depth

**Files:**
- Modify: `server/src/db/index.ts` (créer indexes)
- Modify: `server/src/routes/jobs.ts` (Zod sur sector)
- Modify: `server/src/routes/admin-users.ts` (router.use(requireRole('admin')))

- [ ] **Step 1 :** Ajouter indexes idempotents dans `db/index.ts` après les CREATE TABLE :
  ```ts
  await db.run(sql`CREATE INDEX IF NOT EXISTS idx_jobs_active_sector ON jobs(is_active, sector)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at)`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS idx_messages_created ON contact_messages(created_at)`);
  ```

- [ ] **Step 2 :** Dans `jobs.ts:11-18`, valider le query :
  ```ts
  const querySchema = z.object({ sector: z.string().max(50).optional() });
  const { sector } = querySchema.parse(req.query);
  ```

- [ ] **Step 3 :** Dans `admin-users.ts`, ajouter en tête du router :
  ```ts
  router.use(requireRole('admin'));
  ```

- [ ] **Step 4 :** Commit
  ```bash
  git commit -m "chore(server): add SQLite indexes, validate sector query, redundant RBAC on admin-users"
  ```

---

### Task 5.7 — Misc cleanup

- [ ] **Step 1 :** Corriger commentaire rate-limit `index.ts:38` ("60 per minute" au lieu de "30").

- [ ] **Step 2 :** Ajouter `engines.node` à `server/package.json` :
  ```json
  "engines": { "node": ">=20" }
  ```

- [ ] **Step 3 :** Vérifier la version `nodemailer ^8.0.7` :
  ```bash
  cd server && npm view nodemailer versions --json | tail -10
  ```
  Si mauvaise → corriger en `^6.x.x` stable.

- [ ] **Step 4 :** Aligner `alt="Acreed"` → `alt="Acreed Consulting"` dans `Navigation.tsx:182` (cohérence mobile/desktop).

- [ ] **Step 5 :** Retirer `aria-label="Espace pro"` redondant dans `Footer.tsx:74`.

- [ ] **Step 6 :** Commit
  ```bash
  git commit -m "chore(misc): fix rate-limit comment, add engines.node, fix nodemailer version, align alt texts"
  ```

---

### 🔁 Fin Jalon 5 — Merge

- [ ] `git checkout main && git merge --no-ff chore/jalon-5-cleanup && git push`

---

# Post-launch (hors plan, à arbitrer plus tard)

- Audit log admin (table `admin_audit_log`)
- 2FA admin (TOTP)
- HSTS preload submission
- `npm audit` en CI
- Admin panel responsive mobile (sidebar collapsible)
- PartnersMarquee : Framer Motion → CSS keyframes
- Découpage des fichiers >500 lignes (Contact.tsx, Jobs.tsx)
- Sitemap dynamique générant `/offres/:id`
- Upload CV multipart (multer) si décision produit

---

# Récap timing

| Jalon | Durée | Bloquant launch ? |
|-------|-------|-------------------|
| 1 — Bloquants | 1-2 j | ✅ |
| 2 — Sécurité/RGPD | 1 j | ⚠️ partiel |
| 3 — Cohérence | 1-2 j | ❌ |
| 4 — Tests backend | 1 j | ❌ |
| 5 — Cleanup | 0.5 j | ❌ |
| **Total** | **~5-7 j** | |

Launch minimal viable = Jalon 1 + Jalon 2 (Tasks 2.1, 2.2, 2.4) + Tasks 3.3, 3.5, 3.7. Le reste peut être post-launch immédiat.
