# Logic & Data Architect Memory

## Project Structure
- Root: `C:\Users\trist\Documents\Outil\Export Lovable\Site Acreed Consulting\monochrome-elegance`
- Framework: React + Vite + TypeScript (strict mode)
- Styling: Tailwind CSS with CSS custom properties (HSL-based)
- Fonts: Playfair Display (display) + Inter (body)
- Design: Ultra-premium monochrome (pure black background, white foreground)

## Key File Locations
- `src/config/navigation.ts` - Nav links and CTA config (plain TS interfaces, not Zod)
- `src/data/partners.ts` - Partners list with Zod schema + inferred types
- `src/index.css` - Design system CSS variables and component classes
- `tailwind.config.ts` - Tailwind config using shadcn/ui pattern with CSS vars
- `index.html` - SEO metadata (lang="fr", Acreed Consulting branding)

## CSS Variables (confirmed)
- `--background: 0 0% 0%` (pure black)
- `--foreground: 0 0% 100%` (pure white)
- All colors are HSL triplets consumed via `hsl(var(--name))`

## Schemas Created
- `partnerSchema` in `src/data/partners.ts` - z.object with name (string) and category (enum: telecom, esn, soutien)
- `serviceSchema` in `src/data/services.ts` - z.object { icon, title, description } (5 sectors: Telecoms, IT, Cyber, Energy, Industry)
- `expertiseSchema` in `src/data/expertise.ts` - z.object { icon, title, description, features: string[] } (4 pillars: Consulting, Internalisation, Recrutement, Gestion de Projets)
- `teamMemberSchema` in `src/data/team.ts` - z.object { name, role, bio, image, linkedin? } (1 member: Steven Breuil)
- `valueSchema` in `src/data/values.ts` - z.object { icon, title, description } (4 values) + `keyFigures` array + `philosophy` string

## Navigation Anchors
- `#services` -> Expertise
- `#team` -> L'Equipe
- `#jobs` -> Nos Offres
- `#contact` -> Contact
- CTA: "Candidature Spontanee" -> #contact

## Conventions
- SEO/meta content is in French
- Zod validation messages should be in French for user-facing forms
- Hero section is READ-ONLY, never modify
- `scroll-smooth` class on html element
- Custom cursor: `cursor: none !important` globally
