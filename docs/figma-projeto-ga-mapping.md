# Figma "Projeto GA" → Code mapping & implementation plan

Source: https://www.figma.com/design/SsW1I5w2VIx0z8R90165kS/Projeto-GA

Scope: full Figma file — implement site-wide visual and structural changes to match the Figma screens across Header, Hero, Professionals catalog, Footer, forms and any reusable components.

This document is a living plan. I will implement changes incrementally on branch `feat/figma-professionals-ui` and push small commits for review.

---

Assumptions / notes
- Figma is public and uses Open Sans (we already applied Open Sans). I will extract color tokens and spacing from visible frames and map them to Tailwind tokens.
- I'll prioritize visible homepage and professionals screens, then iterate on smaller pages/components.
- We'll keep API integration out of scope for now and use mock data until you approve wiring to the real API.

---

High-level mapping (frames → files)
- Global
  - Tailwind tokens: `tailwind.config.js` — add colors, radii, font sizes if needed
  - `src/index.css` — global font import and minor utilities (already updated)

- Header / Navigation
  - `src/components/Header/index.tsx`
  - Mobile menu: `src/components/Mobile/Menu/index.tsx`

- Footer
  - `src/components/Footer/index.tsx` (already exists)

- Home / Hero / InitialSection
  - `src/components/Sections/InitialSection/index.tsx`
  - `src/components/Cards/CardHome/index.tsx`

- Professionals catalog
  - `src/screens/Professionals/index.tsx`
  - `src/screens/Professionals/ProfessionalCard.tsx`
  - `src/screens/Professionals/mockProfessionals.ts`

- Forms / Modals
  - `src/components/Modals/*` (ModalLogin, ModalCreateProfessional, ModalCreateUser, etc.)

- Reusable UI tokens/components
  - Buttons: use utility classes + small local components if needed (we'll avoid adding a design system library)
  - Badges/chips: create small reusable classes using Tailwind tokens

---

Priority implementation batches (small commits)

1. Tokens & global styles
   - Extract main colors and spacing from Figma; add to `tailwind.config.js` (primary, accent, neutral scales).
   - Ensure `fontFamily.sans` is Open Sans and loaded (done).
   - Add any small CSS variables if needed under `:root`.

2. Header & Footer
   - Align nav spacing, active states, and mobile menu to the Figma.
   - Add subtle background or divider as in Figma.

3. Hero / InitialSection + Cards
   - Ensure hero layout, H1 scale, CTA styles match Figma.
   - Adjust `CardHome` and other cards for consistent shadows and radii.

4. Professionals catalog
   - Match grid layout, spacing, professional card layout, search/filter UI, and empty states.
   - Add micro-interactions: hover elevation, focus rings, button states.

5. Forms and modals
   - Align form inputs, validations styles, and modal layout (widths and spacing).

6. Accessibility & polish
   - Add ARIA attributes, keyboard focus visuals, color contrast checks.
   - Add `:focus-visible` rules where necessary.

7. Validation, tests & PR
   - Run `npm run lint` and `npm run build`.
   - Add small component tests or snapshots if requested.
   - Open PR with screenshots and notes.

---

Implementation cadence and delivery
- I will implement 1–2 small commits per day (or faster if you want). After each commit I will run the build and push.
- When the main visual pass is complete across site, I will create a PR and include before/after screenshots and a checklist of remaining small items.

---

Next immediate actions (I'll take these now)
1. Extract color/spacing tokens from the Figma frames I can access and add them to `tailwind.config.js`.
2. Tweak Header and Footer to match global spacing in the Figma.

If you want to prioritize a specific page/frame from the Figma (e.g., a particular dashboard or form), tell me which frame ID or name and I’ll tackle that first.

If this plan looks good, I’ll begin by extracting token values and applying them in a commit now.