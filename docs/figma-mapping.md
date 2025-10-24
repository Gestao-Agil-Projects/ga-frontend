# Figma → Code mapping (draft)

Source: https://www.figma.com/design/1gjMVETwbVAK94ih2NYYC9/Gest%C3%A3o-%C3%81gil

NOTE: The Figma file is public; I inspected the repo and current components and created this draft mapping and implementation plan. I made a few reasonable assumptions about exact color hexes and typographic scale — I list them below. If you want exact tokens from Figma, I can copy exact color/typography values in a follow-up commit.

---

## Goal
Make the Home hero + Professionals section visually approximate the Figma design (layout, hierarchy, spacing, color accents, CTA styling) while keeping components reusable and responsive.

## High-level mapping (Figma section → code file)

- Header (top nav)
  - Code: `src/components/Header/index.tsx`
  - Notes: active link color should be `theme('colors.primary')`; keep current scroll-to-section behavior.

- Hero / Initial Section
  - Code: `src/components/Sections/InitialSection/index.tsx`
  - Notes: large H1, 2 CTAs, subtle gradient background, supporting feature cards (CardHome). We already added a gradient and CTAs — we'll refine spacing, sizes and button styles to match Figma.

- Feature cards (beneath hero)
  - Code: `src/components/Cards/CardHome/index.tsx`
  - Notes: adjust icon color, card shadow (softer), padding and heading typography to match Figma.

- Professionals (catalog)
  - Code: `src/screens/Professionals/index.tsx`
  - Notes: title, subtitle, search + select filters aligned on wide screens; grid 1/2/3 columns at sm/md/lg. Ensure empty state and no-results UI.

- Professional Card
  - Code: `src/screens/Professionals/ProfessionalCard.tsx`
  - Notes: avatar circular, name/title styling, specialties chips, availability badges, primary CTA matching hero primary color.

- Tailwind config / tokens
  - Code: `tailwind.config.js`
  - Notes: add/update tokens to match Figma: primary, secondary, shades, radii and spacing tokens where useful.

---

## Suggested tokens / assumptions (these are approximate)

- Primary color: #2F7CD1 (used in hero H1 and accents in existing files)
- Primary-600: #2563EB (Tailwind `blue-600` / repo has `neutral-20` / `neutral-21` etc.)
- Accent light: #EEF6FF (soft blue background for badges)
- Text (muted): #6B7280 (current `neutral-19`)
- Card background: #FFFFFF
- Shadow: `shadow-lg` but slightly muted (e.g. `shadow-md` with rgba(15,23,42,0.06)`)

I recommend adding explicit names to `tailwind.config.js` (if you want more fidelity):
- `primary: '#2F7CD1'`
- `primary-50: '#EEF6FF'`
- `primary-600: '#2563EB'`

I'll keep using the existing `EnvConfig.PRIMARY_COLOR` unless you want hard-coded tokens in commits.

---

## Concrete UI improvements (what I'll implement next)

1) `InitialSection` refinements
  - Increase H1 font size on lg, adjust line-height.
  - Make primary CTA use primary token and have a stronger shadow and rounded `md` radius.
  - Replace emoji icons with small SVG or `lucide-react` icons for better consistency (optional).
  - Add accessible attributes (aria-labels) to hero CTAs.

2) `CardHome` adjustments
  - Make icon container circular with background `primary-50`.
  - Use `text-primary` for titles and `text-neutral-19` for description.
  - Reduce padding slightly to match Figma density.

3) `Professionals` page layout
  - Improve search input visual (left icon inside input, rounded full on desktop maybe 12px radius in Figma)
  - Align select size with input; keep both horizontally side-by-side on md and up.
  - Add `No results` state with an inline illustration or message.

4) `ProfessionalCard` changes
  - Avatar: `w-16 h-16 rounded-full` with `object-cover`.
  - Name: `text-lg font-semibold text-gray-800`.
  - Title: `text-sm text-gray-500`.
  - Specialties: show as small pill chips (bg-gray-50, border, text-sm, rounded-full) under the bio.
  - Times: keep as badges but use `primary-50` bg and `primary-600` text.
  - CTA: full-width primary button with slightly larger vertical padding and `focus:ring`.

5) Header
  - Ensure `text-primary` is applied to active nav; reduce nav spacing to match Figma.
  - Mobile menu: ensure 'Profissionais' scrolls to section instead of navigating if home route and section exists.

---

## Implementation plan / commits

I will implement in small commits on branch `feat/figma-professionals-ui`:

- Commit 1: docs/figma-mapping.md (this file) and update todos — quick non-code commit.
- Commit 2: small Tailwind token additions (if needed) and small CSS helpers.
- Commit 3: `InitialSection` polish — spacing, H1, CTAs and accessibility.
- Commit 4: `CardHome` polish.
- Commit 5: `ProfessionalCard` polish and `Professionals` layout tweaks.
- Commit 6: run lint/build, fix issues, and update docs.

Each commit will be small and isolated so you can review easily.

---

## Edge cases and accessibility notes

- Inputs should have `sr-only` labels (search already has sr-only span).
- Make sure `aria-pressed`/`aria-label` for CTA buttons if they toggle anything.
- Buttons should have visible focus rings (Tailwind `focus:outline-none focus:ring-2 focus:ring-primary-300`).
- For long bios, keep `line-clamp-4` but ensure it degrades gracefully.

---

## Next step (I will wait for your go-ahead)

I can start now and implement Commit 3: refine `InitialSection` (hero) and `CardHome` to better match the Figma. This is a low-risk change and easy to review.

Please confirm:
- Proceed now with `InitialSection` + `CardHome` changes? (yes/no)
- Any exact color hex or font family you want me to use from the Figma file (if you prefer exact tokens, I can fetch them and apply them in `tailwind.config.js`)?

If you confirm, I'll implement the hero + card polish in a single commit and run the TypeScript build/lint checks after changes and report results.