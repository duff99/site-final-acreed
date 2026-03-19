# Responsive Redesign — Acreed Consulting

**Date:** 2026-03-19
**Status:** Approved
**Scope:** Complete mobile responsive overhaul (320px-430px+), all landing page sections

---

## Context

The Acreed Consulting website is a premium monochrome marketing site with glassmorphism effects, Framer Motion animations, and complex interactive components (accordions, 3D card flips, hover-expand panels). While the desktop experience is polished, mobile has critical issues: broken layouts, hover-only interactions, unreadable content (mirrored cards), missing breakpoints below 480px, and a hero video that doesn't showcase the animated logo.

## Design Decisions

### Breakpoint Strategy

Standardize on 3 mobile breakpoints while keeping existing 900px breakpoints intact:
- `480px` — very small phones (iPhone SE, small Androids)
- `768px` — tablets / large phones (existing)
- `900px` — keep for components already using it (ServicesSection, ExpertiseSection, AboutSection, HistorySection)

### Touch Interaction Pattern

All hover-expand components (ServicesSection accordion, TeamSection panels) will use a **tap-to-toggle** pattern on mobile:
- State: `activePanel: number | null` (null = rest state)
- Tap a panel to open it, tap again to close
- Tap another panel: closes current, opens new
- CSS hover selectors replaced by `.is-active` class on mobile
- Desktop hover behavior unchanged

---

## Section-by-Section Specification

### 1. HeroSection

**Files:** `src/components/HeroSection.tsx`, `src/components/HeroSection.css`

**Changes:**

a) **Video recentering:**
- Add responsive `object-position` on the video element: `center 30%` on mobile (< 768px) to move the focal point toward the animated logo area. Keep `center center` on desktop.

b) **Gradient overlay reinforcement on mobile:**
- Current gradient: `rgba(10,10,10,.5) 0%, rgba(10,10,10,.15) 40%, rgba(10,10,10,.6) 80%, rgba(10,10,10,1) 100%`
- Mobile gradient (< 768px): lighter top half (`rgba(10,10,10,.15) 0%` to `rgba(10,10,10,.2) 35%`) so the logo shows through, darker bottom half (`rgba(10,10,10,.75) 55%` to `rgba(10,10,10,1) 100%`) for text readability
- Implement via conditional className or inline style using `useIsMobile()` hook

c) **Padding reduction:**
- `paddingTop: '22vh'` becomes `paddingTop: '12vh'` on mobile (< 768px)

d) **Typography scaling — new 480px breakpoint:**
- Title (`text-[50px]` at < 900px via Tailwind) needs further reduction:
  - `< 480px`: title 32px, "simplicite" em 52px
  - `480-768px`: title 40px, em 64px
  - Keep existing responsive classes for 768px+

e) **Value pills (Expertise/Transparence/Excellence) compacted:**
- Mobile: `py-[10px] px-[20px]`, `text-[11px]`, `tracking-[1.5px]`
- Keep `flex-wrap: wrap` so they can break to 2 lines on very small screens

f) **Scroll indicator:**
- Reduce `bottom-10` to `bottom-6` on mobile to avoid overlap

### 2. Navigation

**Files:** `src/components/Navigation.tsx`

**Changes:**

a) **Logo size:**
- Change `h-12` to `h-8 lg:h-12` (32px on mobile, 48px on desktop)

b) **Mobile menu overlay upgrade:**
- Replace `bg-background` with glassmorphism: `bg-background/95 backdrop-blur-xl`
- Reduce link font size from `text-2xl` to `text-xl`
- Add active section indicator: golden underline on current section link
- Add Acreed logo image at top of overlay menu (small, centered)

c) **Safe area support:**
- Add `pt-[env(safe-area-inset-top)]` on the fixed nav wrapper for notched iPhones (via CSS, not Tailwind utility)

d) **Nav bar height on mobile:**
- Reduce from `h-[76px]` to `h-[60px] lg:h-[76px]`

### 3. ServicesSection (Accordion — "Nos Domaines d'Expertise")

**Files:** `src/components/ServicesSection.tsx`, `src/components/ServicesSection.css`

**Changes:**

a) **Tap-to-toggle interaction:**
- Add `activePanel` state in `ServicesSection.tsx`
- Detect mobile via `useIsMobile()` hook (already exists in the project)
- On mobile: clicking a `.panel` sets it as active. Clicking again resets to null (rest state).
- Add `.is-active` class to the active panel
- Desktop: unchanged (CSS `:hover` still works)

b) **CSS changes for mobile (< 900px):**
- `.gallery-container`: `height: auto` (remove `height: 1200px`)
- `.panel` default: `min-height: 80px`, shows collapsed content (number + horizontal title)
- `.panel.is-active`: `min-height: 300px`, shows expanded content
- `.glass-card`: remove `width: 440px`, use `max-width: 100%` with `width: auto`
- `.glass-card-title`: already reduces to 24px at 900px — OK
- `.collapsed-content` on mobile: horizontal layout (number left, title right) instead of vertical
- `.vertical-text` on mobile: already switches to horizontal-tb — OK

c) **Blur on non-active panels:**
- `.gallery-container.has-active .panel:not(.is-active)`: apply `filter: blur(3px); opacity: 0.5;`
- This mirrors the desktop hover blur behavior

### 4. TeamSection (Ecosystem panels)

**Files:** `src/components/TeamSection.tsx`, `src/components/TeamSection.css`

**Changes:**

a) **Tap-to-toggle interaction:**
- Same pattern as ServicesSection: `activePanel` state, `.is-active` class on mobile
- On mobile, tapping a panel opens it (shows description + tags), tapping again closes it

b) **CSS changes for mobile (< 768px):**
- `.ecosystem-container .panel`: `min-height: 220px` (down from 300px)
- `.title`: `white-space: normal` (allow wrapping)
- `.custom-tags`: `flex-wrap: wrap`
- `.tag`: `font-size: 0.55rem`, `padding: 4px 8px`
- `.step-number`: `font-size: 0.75rem` (up from 0.7rem for readability)

c) **Active state mirrors hover:**
- `.panel.is-active`: same styles as `.panel:hover` (flex: 1.8, border-color gold, details visible)
- `.ecosystem-container.has-active .panel:not(.is-active)`: dimmed + scaled

### 5. AboutSection — Playing Cards ("Notre Credo" Atouts)

**Files:** `src/components/AboutSection.tsx`, `src/components/AboutSection.css`

**Changes:**

a) **Fix broken mirror issue on mobile:**
- Root cause: `.card-inner { transform: rotateY(180deg); transform-style: flat; }` on mobile causes the back face to render mirrored because the parent is rotated but `transform-style: flat` prevents children from being in 3D space
- Fix: On mobile (< 900px), completely abandon the flip mechanism:
  - `.card-inner`: `transform: none; transform-style: flat;`
  - `.card-front`: `display: none;`
  - `.card-back`: `position: relative; transform: none; backface-visibility: visible;`
  - This ensures the back content renders normally, not mirrored

b) **Layout on mobile:**
- `.hand-of-cards` on mobile: `display: grid; grid-template-columns: 1fr 1fr; gap: 16px;` (2x2 grid)
- `.card-wrapper`: `width: auto; height: auto; margin-left: 0;`
- `.card-back`: padding reduced to `20px`, content centered
- `.card-back-title`: `font-size: 1rem`
- `.card-back-desc`: `font-size: 0.75rem`

c) **Very small screens (< 400px):**
- Fall back to single column: `grid-template-columns: 1fr`

d) **Credo cards:**
- Already responsive (flex-wrap with min-width: 280px) — minimal changes
- Add `min-width: 240px` for very small screens

### 6. HistorySection (Timeline — "A propos")

**Files:** `src/components/HistorySection.tsx`, `src/components/HistorySection.css`

**Changes:**

a) **Show timeline on mobile:**
- Remove `display: none` on `.timeline-track` at 900px
- Reposition timeline: `left: 15px` instead of `left: 50%` (left-aligned rail)
- `.timeline-track` width stays 2px, glow animation unchanged

b) **Chapter rows on mobile:**
- All rows: `flex-direction: column` (remove row-reverse on even)
- Content aligned left with `padding-left: 40px` (to the right of the rail)
- `text-align: left` for all rows on mobile
- `.connector-dot`: show it, position at `left: 9px` (centered on the 15px rail)

c) **Spacing:**
- `.chapters-container`: `gap: 80px` on mobile (down from 150px)
- `.chapter-title`: `font-size: 28px` on mobile (down from 42px)
- `.section-title`: `font-size: 42px` on mobile (down from 64px)

d) **Glass stat cards on mobile:**
- `max-width: 100%` instead of 300px
- Padding: `30px 20px` instead of `50px 30px`

### 7. ContactSection

**Files:** `src/components/ContactSection.tsx`, `src/components/ContactSection.css`

**Changes:**

a) **Fix ambient-glow overflow:**
- Replace `width: 100vw` with `width: 100%` at 768px breakpoint

b) **New 480px breakpoint:**
- `.cta-title`: `font-size: 28px`
- `.cta-title em`: `font-size: 44px`
- `.cta-desc`: `font-size: 14px`

c) **Reduce spacers:**
- `.guide-line`: `height: 40px` on mobile (down from 80px)

d) **Button animated border fix:**
- `.btn-aura::before`: reduce from `500px` to `300px` width/height on mobile to prevent overflow

### 8. ExpertiseSection (Service Cards — "Offres & Services")

**Files:** `src/components/ExpertiseSection.tsx`, `src/components/ExpertiseSection.css`

**Changes:**

a) **Card height:**
- `.service-card` at 900px: `height: 300px` (down from 350px)

b) **Show description by default on mobile:**
- `.card-text-wrapper` at 900px: `grid-template-rows: 1fr` (always open)
- `.card-desc` at 900px: `opacity: 1` (always visible)
- `.divider` at 900px: `width: 40px` (always visible)

c) **Section title:**
- `.services-section .title` at 480px: `font-size: 36px` (down from 56px)

### 9. PartnersMarquee

**Files:** `src/components/PartnersMarquee.tsx`

**Changes:**

a) **Gradient mask width:**
- Change `w-32` to `w-16 md:w-32` on both fade elements

b) **Logo sizing:**
- Change `h-14 md:h-20` to `h-10 md:h-14 lg:h-20`
- Change `min-w-[100px] md:min-w-[140px]` to `min-w-[80px] md:min-w-[120px] lg:min-w-[140px]`

### 10. Footer

**Files:** `src/components/Footer.tsx`, `src/components/Footer.css`

**Changes:**

a) **Padding reduction on mobile:**
- Add 480px breakpoint: `padding: 50px 16px 30px`

b) **Safe area:**
- Add `padding-bottom: env(safe-area-inset-bottom)` to `.minimal-footer`

c) **Nav gap:**
- Reduce gap to `15px` at 600px breakpoint (from 25px)

### 11. Global Changes

**Files:** `src/index.css`

**Changes:**

a) **Reduced motion accessibility:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

b) **Safe area meta tag:**
- In `index.html`: ensure `<meta name="viewport">` includes `viewport-fit=cover`

---

## Implementation Approach

The work is organized by component independence. Each section can be modified independently since they share no state. The only shared changes are global (index.css, index.html).

**Order of implementation:**
1. Global fixes (index.css, index.html viewport meta) — foundation for everything else
2. HeroSection — highest visual impact, user's primary concern
3. Navigation — affects the entire experience
4. ServicesSection + TeamSection — both need tap-to-toggle, can share the pattern
5. AboutSection — critical card mirror bug fix
6. HistorySection — timeline mobile restoration
7. ContactSection, ExpertiseSection, PartnersMarquee, Footer — smaller fixes

**Key technical consideration:** ServicesSection and TeamSection need React state changes (not just CSS). All other sections are CSS-only changes.

---

## Out of Scope

- Video compression or format optimization for mobile bandwidth
- Lazy loading of video on slow connections
- Custom cursor behavior on mobile (already hidden via touch detection)
- Admin panel responsive (not mentioned by user)
- New visual designs or features — strictly fixing existing responsive issues
