# Acreed UI Engineer Memory

## Project Structure
- shadcn/ui Button: `src/components/ui/button.tsx` (variants: default, destructive, outline, secondary, ghost, link; sizes: default, sm, lg, icon)
- Navigation config: `src/config/navigation.ts` (exports `navLinks: NavLink[]`, `ctaLink`)
- Partners data: `src/data/partners.ts` (exports `partners: Partner[]` with name+category, uses zod schema)
- AnimatedSection component: `src/components/AnimatedSection.tsx`

## Component Patterns
- Navigation uses `glass-nav`, `glass-button`, `glass-button-primary`, `glass-logo` CSS classes
- Mobile menu uses `btn-premium btn-premium-primary` classes
- PartnersMarquee uses `marquee-container`, `marquee-content`, `partner-logo` CSS classes
- Framer Motion `motion.div` wrapper pattern used for animating shadcn Button (since Button is a forwardRef component, wrap in motion.div for whileHover/whileTap)

## Constraints
- NEVER add `cursor: pointer` -- custom cursor system active globally
- Hero component is frozen -- never touch
- Logo text is "ACREED" (bold, tracking-tight), not "Acreed Consulting"
- Desktop CTA uses shadcn Button variant="outline" with classes: `text-sm font-medium border-white/20 bg-transparent hover:bg-white/5 text-foreground`
