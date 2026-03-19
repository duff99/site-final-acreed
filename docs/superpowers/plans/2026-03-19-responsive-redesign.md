# Responsive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Acreed Consulting landing page perfectly responsive across all phone sizes (320px-430px+), fixing broken layouts, hover-only interactions, mirrored cards, and underutilized hero video on mobile.

**Architecture:** CSS-first approach — most tasks are pure CSS media query additions. Two components (ServicesSection, TeamSection) need React state for tap-to-toggle. The `useIsMobile` hook gets a parameterized version to support custom breakpoints. Each section is independent and can be committed separately.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3, Framer Motion, CSS custom properties, existing `useIsMobile` hook (parameterized).

**Spec:** `docs/superpowers/specs/2026-03-19-responsive-redesign-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `index.html` | Add `viewport-fit=cover` to meta viewport |
| Modify | `src/index.css` | Add `prefers-reduced-motion` media query |
| Modify | `src/hooks/use-mobile.tsx` | Accept optional breakpoint parameter |
| Modify | `src/components/HeroSection.tsx` | Responsive video position, gradient, padding, typography, pills |
| Modify | `src/components/HeroSection.css` | New 480px breakpoint for hero typography (CSS file rules) |
| Modify | `src/components/Navigation.tsx` | Smaller logo, improved mobile menu, safe area, reduced height |
| Modify | `src/components/ServicesSection.tsx` | Tap-to-toggle state + `.is-active` class |
| Modify | `src/components/ServicesSection.css` | Mobile panel styles, remove cursor:pointer, active state styles |
| Modify | `src/components/TeamSection.tsx` | Tap-to-toggle state + `.is-active` class |
| Modify | `src/components/TeamSection.css` | Mobile panel styles, remove cursor:pointer, active state styles |
| Modify | `src/components/AboutSection.css` | Fix card mirror, 2x2 grid layout, mobile card sizing |
| Modify | `src/components/HistorySection.css` | Left-aligned timeline on mobile, spacing, font sizes |
| Modify | `src/components/ContactSection.css` | Remove 100vw glow, 480px breakpoint, button border fix |
| Modify | `src/components/ExpertiseSection.css` | Card height, show description, title sizing |
| Modify | `src/components/PartnersMarquee.tsx` | Responsive gradient masks and logo sizing |
| Modify | `src/components/Footer.css` | Padding, safe area, nav gap |

---

## Task 1: Global Foundations (index.html + index.css + useIsMobile hook)

**Files:**
- Modify: `index.html` (meta viewport tag)
- Modify: `src/index.css` (add at end of file)
- Modify: `src/hooks/use-mobile.tsx`

- [ ] **Step 1: Add viewport-fit=cover to index.html**

In `index.html`, find the existing `<meta name="viewport"` tag and add `viewport-fit=cover`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

- [ ] **Step 2: Add prefers-reduced-motion to index.css**

Append at the end of `src/index.css`:

```css
/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Parameterize useIsMobile hook**

Modify `src/hooks/use-mobile.tsx` to accept an optional breakpoint parameter while keeping the default at 768:

```tsx
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isMobile;
}
```

- [ ] **Step 4: Verify dev server starts cleanly**

Run: `npm run dev` — check no errors in console. Ctrl+C to stop.

- [ ] **Step 5: Commit**

```bash
git add index.html src/index.css src/hooks/use-mobile.tsx
git commit -m "feat: add global responsive foundations — viewport-fit, reduced-motion, parameterized useIsMobile"
```

---

## Task 2: HeroSection — Video, Gradient, Typography, Pills

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/HeroSection.css`

- [ ] **Step 1: Make video position and gradient responsive**

In `src/components/HeroSection.tsx`, import the hook and add mobile detection:

```tsx
import { useIsMobile } from '@/hooks/use-mobile';
```

Inside the component, add:

```tsx
const isMobile = useIsMobile();
```

Update the `<video>` element's style to use responsive object-position:

```tsx
style={{
  objectPosition: isMobile ? 'center 30%' : 'center center',
  opacity: 0.25,
  filter: 'saturate(.3) brightness(.8) blur(0.5px)',
}}
```

Update the gradient overlay div's style for mobile:

```tsx
style={{
  background: isMobile
    ? 'linear-gradient(180deg, rgba(10,10,10,.15) 0%, rgba(10,10,10,.2) 35%, rgba(10,10,10,.75) 55%, rgba(10,10,10,1) 100%)'
    : 'linear-gradient(180deg, rgba(10,10,10,.5) 0%, rgba(10,10,10,.15) 40%, rgba(10,10,10,.6) 80%, rgba(10,10,10,1) 100%)',
}}
```

- [ ] **Step 2: Reduce padding and scroll indicator on mobile**

Update the content wrapper div's `style` prop:

```tsx
style={{ paddingTop: isMobile ? '12vh' : '22vh' }}
```

Update the scroll indicator's className to use responsive bottom:

```tsx
className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-[10px]"
```

- [ ] **Step 3: Add 480px typography breakpoint via Tailwind**

The TSX uses Tailwind inline classes, NOT the `.hero-main-title` CSS classes. So we use Tailwind's arbitrary breakpoint syntax `min-[480px]:` for the 480px breakpoint.

Update the `<motion.h1>` className:

```tsx
className="font-light text-[32px] min-[480px]:text-[40px] md:text-[65px] lg:text-[85px] leading-[0.9] tracking-[-2px] text-white"
```

Update the `<em>` className:

```tsx
className="block font-display text-[52px] min-[480px]:text-[64px] md:text-[100px] lg:text-[130px] font-normal text-[#dbcca5] pl-0 italic"
```

No changes needed in `HeroSection.css` for title sizing — the CSS `.hero-main-title` rules are unused by this TSX component.

- [ ] **Step 4: Compact value pills on mobile**

Update the pills' className to use responsive sizing. Change from:

```tsx
className="inline-flex items-center justify-center py-[18px] px-[45px] rounded-[50px] text-[13px] font-medium uppercase tracking-[3px] text-[#dbcca5] bg-[#0a0a0a]/60 border border-[#dbcca5] backdrop-blur-[5px] transition-all duration-400 ease-[cubic-bezier(0.2,1,0.3,1)] hover:bg-[#dbcca5] hover:text-[#0A0A0A] hover:-translate-y-[4px] hover:shadow-[0_15px_30px_rgba(219,204,165,0.2)]"
```

To:

```tsx
className="inline-flex items-center justify-center py-[10px] px-[20px] md:py-[18px] md:px-[45px] rounded-[50px] text-[11px] md:text-[13px] font-medium uppercase tracking-[1.5px] md:tracking-[3px] text-[#dbcca5] bg-[#0a0a0a]/60 border border-[#dbcca5] backdrop-blur-[5px] transition-all duration-400 ease-[cubic-bezier(0.2,1,0.3,1)] hover:bg-[#dbcca5] hover:text-[#0A0A0A] hover:-translate-y-[4px] hover:shadow-[0_15px_30px_rgba(219,204,165,0.2)]"
```

- [ ] **Step 5: Verify in browser**

Run: `npm run dev`
Open browser at `http://localhost:8081`, use DevTools responsive mode.
Check at 375px (iPhone), 390px (iPhone 14), 320px (iPhone SE), 768px (tablet).
Verify: video centered on logo, gradient lighter on top, text readable, pills compact.

- [ ] **Step 6: Commit**

```bash
git add src/components/HeroSection.tsx src/components/HeroSection.css
git commit -m "feat: responsive HeroSection — recentered video, mobile gradient, typography scaling, compact pills"
```

---

## Task 3: Navigation — Smaller Logo + Improved Mobile Menu

**Files:**
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Reduce logo size and nav height on mobile**

In `src/components/Navigation.tsx`, change the logo `<img>` className:

From: `className="h-12 w-auto rounded-md"`
To: `className="h-8 lg:h-12 w-auto rounded-md"`

Change the nav bar height from `h-[76px]`:

From: `className="relative flex items-center h-[76px] px-8"`
To: `className="relative flex items-center h-[60px] lg:h-[76px] px-4 lg:px-8"`

- [ ] **Step 2: Add safe area support**

On the fixed nav wrapper div, add a style for safe area inset. Change:

From: `className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none"`
To: `className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}`

- [ ] **Step 3: Upgrade mobile menu overlay**

Update the mobile menu container from:

```tsx
className="fixed inset-0 z-40 bg-background pt-28"
```

To:

```tsx
className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24"
```

Add the Acreed logo at the top of the mobile menu. Inside the menu overlay div, before the nav links mapping, add:

```tsx
<img
  src="/images/favicon_navbar.jpg"
  alt="Acreed"
  className="h-10 w-auto rounded-md mb-8 opacity-60"
/>
```

Replace each mobile nav `<motion.button>` (the ones inside the mobile menu overlay map) with the updated version that includes active state + underline indicator:

```tsx
<motion.button
  key={link.href}
  onClick={() => scrollToSection(link.href)}
  className={`text-xl font-display transition-colors relative ${
    activeSection === link.href
      ? 'text-[#dbcca5]'
      : 'text-foreground hover:text-muted-foreground'
  }`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.08 }}
>
  {link.label}
  {activeSection === link.href && (
    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#dbcca5]" />
  )}
</motion.button>
```

- [ ] **Step 4: Verify in browser**

Open DevTools responsive mode. Check: logo smaller, menu overlay has blur, active link highlighted, safe area padding visible.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "feat: responsive Navigation — smaller logo, glassmorphism menu, active indicator, safe area"
```

---

## Task 4: ServicesSection — Tap-to-Toggle Accordion

**Files:**
- Modify: `src/components/ServicesSection.tsx`
- Modify: `src/components/ServicesSection.css`

- [ ] **Step 1: Add tap-to-toggle state in TSX**

In `src/components/ServicesSection.tsx`, add imports and state:

```tsx
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
```

Inside the component:

```tsx
const [activePanel, setActivePanel] = useState<number | null>(null);
const isMobile = useIsMobile(900);

const handlePanelClick = (index: number) => {
  if (!isMobile) return;
  setActivePanel(prev => prev === index ? null : index);
};
```

Update the `.gallery-container` div to add a conditional class:

```tsx
<div className={`gallery-container${activePanel !== null ? ' has-active' : ''}`}>
```

`ServicesSection.tsx` renders 5 inline `<div className="panel" ...>` divs (Telecoms, IT/Digital, Cybersecurite, Energie, Industrie) inside a `.gallery-container`. Each panel needs the click handler and active class added individually.

Add `onClick={() => handlePanelClick(N)}` and dynamic className to each of the 5 panel divs (N = 0 through 4).

For panel 0 (Telecoms), change:

```tsx
<div className="panel"
  style={{ backgroundImage: "url('/images/service-recrutement.jpg')" }}>
```

To:

```tsx
<div className={`panel${isMobile && activePanel === 0 ? ' is-active' : ''}`}
  onClick={() => handlePanelClick(0)}
  style={{ backgroundImage: "url('/images/service-recrutement.jpg')" }}>
```

Repeat the same pattern for panels 1 (service-telecom.jpg), 2 (service-cybersecurite.jpg), 3 (service-energie.jpg), 4 (service-digital.jpg) with their respective indices.

- [ ] **Step 2: Update ServicesSection.css for mobile active state**

In `src/components/ServicesSection.css`, first remove `cursor: pointer` from `.panel` (line 27).

Then update the `@media (max-width: 900px)` block. Replace the existing block entirely:

```css
@media (max-width: 900px) {
    .gallery-container {
        flex-direction: column;
        height: auto;
    }

    .panel {
        border-right: none !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        min-height: 80px;
        transition: min-height 0.6s cubic-bezier(0.25, 1, 0.5, 1),
                    flex 0.8s cubic-bezier(0.25, 1, 0.5, 1),
                    filter 0.5s ease,
                    opacity 0.5s ease;
    }

    /* IMPORTANT: Hover neutralization MUST come before .has-active rules
       to avoid CSS cascade issues on touch devices where :hover persists */

    /* 1. Neutralize all desktop hover effects on mobile */
    .panel:hover {
        flex: 1;
        filter: none;
    }

    .panel:hover::after {
        background: rgba(0, 0, 0, 0.5);
    }

    .panel:hover .collapsed-content {
        opacity: 1;
        pointer-events: auto;
    }

    .panel:hover .expanded-content {
        opacity: 0;
        pointer-events: none;
    }

    .gallery-container:hover .panel:not(:hover) {
        filter: none;
    }

    /* 2. Active panel state (higher specificity overrides hover reset) */
    .panel.is-active {
        min-height: 350px;
        flex: 5;
    }

    .panel.is-active::after {
        background: rgba(0, 0, 0, 0.25);
    }

    .panel.is-active .collapsed-content {
        opacity: 0;
        pointer-events: none;
    }

    .panel.is-active .expanded-content {
        opacity: 1;
        pointer-events: auto;
    }

    /* .is-active has higher specificity than :hover, so these win */
    .panel.is-active:hover {
        flex: 5;
    }

    .panel.is-active:hover .collapsed-content {
        opacity: 0;
        pointer-events: none;
    }

    .panel.is-active:hover .expanded-content {
        opacity: 1;
        pointer-events: auto;
    }

    /* 3. Dim non-active panels (comes AFTER hover neutralization) */
    .gallery-container.has-active .panel:not(.is-active) {
        filter: blur(3px);
        opacity: 0.5;
    }

    .vertical-text {
        writing-mode: horizontal-tb;
        transform: none;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .glass-card {
        padding: 20px;
        width: auto;
        max-width: 100%;
    }

    .glass-card-title {
        font-size: 24px;
    }
}
```

- [ ] **Step 3: Verify tap-to-toggle in browser**

Run: `npm run dev`
Open DevTools at 375px width. Tap a panel — it should expand. Tap again — it should close. Tap another — previous closes, new opens. On desktop width, hover should still work normally.

- [ ] **Step 4: Commit**

```bash
git add src/components/ServicesSection.tsx src/components/ServicesSection.css
git commit -m "feat: ServicesSection tap-to-toggle on mobile, remove cursor:pointer, fix layout"
```

---

## Task 5: TeamSection — Tap-to-Toggle Panels

**Files:**
- Modify: `src/components/TeamSection.tsx`
- Modify: `src/components/TeamSection.css`

- [ ] **Step 1: Add tap-to-toggle state in TSX**

In `src/components/TeamSection.tsx`, add imports:

```tsx
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
```

Inside the component:

```tsx
const [activePanel, setActivePanel] = useState<number | null>(null);
const isMobile = useIsMobile();

const handlePanelClick = (index: number) => {
  if (!isMobile) return;
  setActivePanel(prev => prev === index ? null : index);
};
```

Update the `.ecosystem-container` div:

```tsx
<div className={`ecosystem-container${activePanel !== null ? ' has-active' : ''}`}>
```

Add click handler and active class to each of the 3 panel divs. For Tristan (index 0):

```tsx
<div
  className={`panel${isMobile && activePanel === 0 ? ' is-active' : ''}`}
  style={{ backgroundImage: "url('/images/tristan.jpg')" }}
  onClick={() => handlePanelClick(0)}
>
```

Repeat for Steven (index 1) and Maxime (index 2).

- [ ] **Step 2: Update TeamSection.css for mobile active state and fixes**

First, remove `cursor: pointer` from `.ecosystem-container .panel` (line 46).

Then update the existing `@media (max-width: 768px)` block and add active state rules. Replace the existing block:

```css
@media (max-width: 768px) {
    .ecosystem-container {
        flex-direction: column;
        height: auto;
        min-height: auto;
    }

    .ecosystem-container .panel {
        min-height: 220px;
        width: 100%;
        transition: all 0.6s cubic-bezier(0.25, 1, 0.2, 1);
    }

    .ecosystem-container .title {
        white-space: normal;
        font-size: 1.5rem;
    }

    .ecosystem-container .step-number {
        font-size: 0.75rem;
    }

    .ecosystem-container .custom-tags {
        flex-wrap: wrap;
    }

    .ecosystem-container .tag {
        font-size: 0.55rem;
        padding: 4px 8px;
    }

    /* IMPORTANT: Hover neutralization MUST come before .has-active/.is-active rules
       to avoid CSS cascade issues on touch devices where :hover persists */

    /* 1. Neutralize desktop hover effects on mobile */
    .ecosystem-container:hover .panel {
        transform: none;
        filter: none;
        opacity: 1;
    }

    .ecosystem-container .panel:hover {
        flex: 1;
        border-color: #2a2a2a;
        box-shadow: inset 0 -150px 100px -30px rgba(0, 0, 0, 0.6);
    }

    .ecosystem-container .panel:hover .details {
        grid-template-rows: 0fr;
        opacity: 0;
    }

    .ecosystem-container .panel:hover::after {
        background: rgba(0, 0, 0, 0.3);
    }

    /* 2. Active panel state (higher specificity overrides hover reset) */
    .ecosystem-container .panel.is-active {
        flex: 1.8;
        transform: scale(1);
        filter: brightness(1);
        opacity: 1;
        z-index: 10;
        border-color: #dbcca5;
        box-shadow: 0 0 50px rgba(219, 204, 165, 0.45),
                    inset 0 -350px 200px -20px rgba(0, 0, 0, 0.95);
    }

    .ecosystem-container .panel.is-active::after {
        background: rgba(0, 0, 0, 0.1);
    }

    .ecosystem-container .panel.is-active .details {
        grid-template-rows: 1fr;
        opacity: 1;
    }

    /* 3. Dim non-active panels (comes AFTER hover neutralization) */
    .ecosystem-container.has-active .panel:not(.is-active) {
        transform: scale(0.95);
        filter: brightness(0.6);
        opacity: 0.7;
        border-color: #2a2a2a;
    }

    /* Re-apply for active even when hovered */
    .ecosystem-container .panel.is-active:hover {
        flex: 1.8;
        border-color: #dbcca5;
        box-shadow: 0 0 50px rgba(219, 204, 165, 0.45),
                    inset 0 -350px 200px -20px rgba(0, 0, 0, 0.95);
    }

    .ecosystem-container .panel.is-active:hover .details {
        grid-template-rows: 1fr;
        opacity: 1;
    }

    .ecosystem-container .panel.is-active:hover::after {
        background: rgba(0, 0, 0, 0.1);
    }
}
```

- [ ] **Step 3: Verify in browser**

Open DevTools at 375px. Tap each team member — panel expands with details. Tap again — closes. Others dim when one is active. Desktop hover still works.

- [ ] **Step 4: Commit**

```bash
git add src/components/TeamSection.tsx src/components/TeamSection.css
git commit -m "feat: TeamSection tap-to-toggle on mobile, fix tags wrapping and text overflow"
```

---

## Task 6: AboutSection — Fix Mirrored Cards + Mobile Layout

**Files:**
- Modify: `src/components/AboutSection.css`

- [ ] **Step 1: Fix the card mirror bug and update mobile layout**

In `src/components/AboutSection.css`, replace the entire `@media (max-width: 900px)` block (lines 308-353) with:

```css
@media (max-width: 900px) {
    /* Credo cards — stack vertically */
    .credo-cards-container {
        flex-direction: column;
        align-items: center;
    }

    .credo-card {
        max-width: 400px;
        width: 100%;
        min-width: 240px;
    }

    /* Playing cards — 2x2 grid, no flip */
    .hand-of-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        height: auto;
        perspective: none;
    }

    .card-wrapper {
        width: auto;
        height: auto;
        transform: none !important;
        margin-left: 0 !important;
    }

    .card-wrapper:not(:first-child) {
        margin-left: 0;
    }

    /* Kill the flip — show back content directly */
    .card-inner {
        transform: none;
        transform-style: flat;
    }

    .card-wrapper:hover .card-inner {
        transform: none;
    }

    .card-front {
        display: none;
    }

    .card-back {
        position: relative;
        transform: none;
        backface-visibility: visible;
        padding: 20px;
        min-height: 200px;
    }

    .card-back-title {
        font-size: 1rem;
    }

    .card-back-desc {
        font-size: 0.75rem;
    }

    /* Transition text */
    .transition-text {
        font-size: 1rem;
        white-space: normal;
        text-align: center;
    }
}

@media (max-width: 400px) {
    .hand-of-cards {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 2: Verify in browser**

Open DevTools at 375px. Check:
- Credo cards stack vertically, readable
- 4 Atout cards in 2x2 grid, text NOT mirrored, content readable
- At 320px, cards stack to single column

- [ ] **Step 3: Commit**

```bash
git add src/components/AboutSection.css
git commit -m "fix: AboutSection — fix mirrored cards on mobile, 2x2 grid layout, readable text"
```

---

## Task 7: HistorySection — Left-Aligned Timeline on Mobile

**Files:**
- Modify: `src/components/HistorySection.css`

- [ ] **Step 1: Replace the mobile media query**

In `src/components/HistorySection.css`, replace the entire `@media (max-width: 900px)` block (lines 286-315) with:

```css
@media (max-width: 900px) {
    .section-title {
        font-size: 42px;
    }

    .chapters-container {
        gap: 80px;
    }

    /* Left-aligned timeline rail */
    .timeline-track {
        left: 15px;
        transform: none;
    }

    .chapter-row,
    .chapter-row:nth-child(even) {
        flex-direction: column;
        align-items: flex-start;
        gap: 30px;
        padding-left: 40px;
    }

    .chapter-content {
        padding: 0;
        align-items: flex-start !important;
        text-align: left !important;
    }

    .chapter-text-block {
        text-align: left;
        max-width: 100%;
    }

    .chapter-title {
        font-size: 28px;
    }

    .chapter-visual {
        padding: 0;
        width: 100%;
    }

    .connector-dot {
        display: block;
        left: -31px !important;
        right: auto !important;
    }

    .glass-stat-card {
        max-width: 100%;
        padding: 30px 20px;
    }
}
```

- [ ] **Step 2: Verify in browser**

Open DevTools at 375px. Check: timeline rail visible on the left, dots appear at each chapter, content aligned to the right of the rail, all text readable.

- [ ] **Step 3: Commit**

```bash
git add src/components/HistorySection.css
git commit -m "feat: HistorySection — left-aligned timeline on mobile with visible progression rail"
```

---

## Task 8: ContactSection — Fix Overflow + Small Screen Breakpoint

**Files:**
- Modify: `src/components/ContactSection.css`

- [ ] **Step 1: Update the mobile media query and add 480px breakpoint**

In `src/components/ContactSection.css`, replace the entire `@media (max-width: 768px)` block with:

```css
@media (max-width: 768px) {
    .cta-title {
        font-size: 40px;
    }

    .cta-title em {
        font-size: 64px;
    }

    .btn-aura {
        width: 100%;
        justify-content: center;
    }

    /* Fix: remove 100vw override, keep desktop 400px — parent overflow:hidden clips it */
    .ambient-glow {
        width: 400px;
    }

    .guide-line {
        height: 40px;
        margin: 25px 0;
    }

    .btn-aura::before {
        width: 300px;
        height: 300px;
    }
}

@media (max-width: 480px) {
    .cta-title {
        font-size: 28px;
        letter-spacing: -1px;
    }

    .cta-title em {
        font-size: 44px;
    }

    .cta-desc {
        font-size: 14px;
    }
}
```

- [ ] **Step 2: Verify in browser**

Open DevTools at 375px. Check: no horizontal scroll, glow effect visible but contained, text readable, button centered.

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactSection.css
git commit -m "fix: ContactSection — remove 100vw overflow, add 480px breakpoint, reduce spacers"
```

---

## Task 9: ExpertiseSection — Card Height + Visible Description on Mobile

**Files:**
- Modify: `src/components/ExpertiseSection.css`

- [ ] **Step 1: Update the mobile media query and add 480px breakpoint**

In `src/components/ExpertiseSection.css`, replace the existing `@media (max-width: 900px)` block with:

```css
@media (max-width: 900px) {
    .services-grid {
        grid-template-columns: 1fr;
    }

    .service-card {
        height: 300px;
    }

    .service-card:hover {
        transform: translateY(-5px);
    }

    .service-card .card-title {
        font-size: 20px;
        white-space: normal;
    }

    /* Show description by default on mobile (no hover needed) */
    .card-text-wrapper {
        grid-template-rows: 1fr;
    }

    .service-card .card-desc {
        opacity: 1;
        color: rgba(255, 255, 255, 0.8);
    }

    .service-card .divider {
        width: 40px;
        margin-bottom: 8px;
    }
}

@media (max-width: 480px) {
    .services-section .title {
        font-size: 36px;
    }

    .services-section .header-desc {
        font-size: 14px;
    }
}
```

- [ ] **Step 2: Verify in browser**

Open DevTools at 375px. Check: cards are single column, descriptions always visible, title wraps properly.

- [ ] **Step 3: Commit**

```bash
git add src/components/ExpertiseSection.css
git commit -m "feat: ExpertiseSection — mobile card height, visible descriptions, 480px title scaling"
```

---

## Task 10: PartnersMarquee — Responsive Gradient Masks + Logo Sizing

**Files:**
- Modify: `src/components/PartnersMarquee.tsx`

- [ ] **Step 1: Update gradient masks and logo sizes**

In `src/components/PartnersMarquee.tsx`, update the gradient mask divs:

From: `className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10"`
To: `className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10"`

From: `className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10"`
To: `className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10"`

Update the logo image sizing:

From: `className="h-14 md:h-20 w-auto min-w-[100px] md:min-w-[140px] max-w-[180px] md:max-w-[220px] object-contain"`
To: `className="h-10 md:h-14 lg:h-20 w-auto min-w-[80px] md:min-w-[120px] lg:min-w-[140px] max-w-[150px] md:max-w-[180px] lg:max-w-[220px] object-contain"`

- [ ] **Step 2: Verify in browser**

Open DevTools at 375px. Check: gradient fades are narrower, logos smaller but still readable, marquee scrolls smoothly.

- [ ] **Step 3: Commit**

```bash
git add src/components/PartnersMarquee.tsx
git commit -m "feat: PartnersMarquee — responsive gradient masks and logo sizing for mobile"
```

---

## Task 11: Footer — Padding, Safe Area, Gap

**Files:**
- Modify: `src/components/Footer.css`

- [ ] **Step 1: Update Footer CSS**

In `src/components/Footer.css`, add `padding-bottom: env(safe-area-inset-bottom)` to `.minimal-footer`. Update the padding line:

From: `padding: 80px 20px 40px;`
To: `padding: 80px 20px calc(40px + env(safe-area-inset-bottom, 0px));`

Update the existing `@media (max-width: 600px)` block:

```css
@media (max-width: 600px) {
    .footer-nav {
        flex-direction: column;
        gap: 15px;
    }
}

@media (max-width: 480px) {
    .minimal-footer {
        padding: 50px 16px calc(30px + env(safe-area-inset-bottom, 0px));
    }
}
```

- [ ] **Step 2: Verify in browser**

Open DevTools at 375px. Check: footer looks clean, reduced padding, links stacked with smaller gap.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.css
git commit -m "feat: Footer — mobile padding reduction, safe area support, tighter nav gap"
```

---

## Task 12: Final Visual Verification

- [ ] **Step 1: Full scroll-through test**

Run: `npm run dev`
Open DevTools responsive mode. Test at these widths:
- **320px** (iPhone SE)
- **375px** (iPhone 12/13)
- **390px** (iPhone 14)
- **430px** (iPhone 14 Pro Max)
- **768px** (tablet)
- **1024px** (desktop)

Scroll through the entire page at each width. Check every section for:
- No horizontal overflow (no horizontal scrollbar)
- All text readable (not too small, not overflowing)
- Tap-to-toggle works on ServicesSection and TeamSection
- Cards in AboutSection are not mirrored
- Timeline visible in HistorySection
- Video shows logo in HeroSection
- Navigation menu is clean

- [ ] **Step 2: Run build to verify no TypeScript errors**

Run: `npm run build`
Expected: Clean build with no errors.

- [ ] **Step 3: Commit any final tweaks**

If any visual adjustments were needed during testing, commit them:

```bash
git add -u
git commit -m "fix: responsive fine-tuning after visual verification"
```
