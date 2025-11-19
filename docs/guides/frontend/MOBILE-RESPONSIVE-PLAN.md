# Mobile Responsive Remediation Plan

_Last updated: 2025-11-15_

This document tracks the action plan for fixing the mobile experience across the frontend application. All teams should reference this plan before starting mobile-specific work.

## Phase 1 – Layout Shell (kickoff task: `MainContentStyled`)

**Status:** In progress — `MainContentStyled` spacing + container padding updated (2025-11-15).

**Goal:** make the global layout responsive so pages can use the full viewport on phones without horizontal scrolling.

- Gate drawer offsets/padding behind `md` breakpoints in `frontend/src/layout/MainLayout/MainContentStyled.ts`.
- Reduce `padding`/`margin` to `{ xs: 10–12px, sm: 16px, md+: 20px }` and let the layout span the full width on `xs`.
- Allow `<Container>` in `MainLayout/index.tsx` to use `maxWidth={false}` + responsive `px` for the shell when `container` setting is disabled.
- (Optional) expose an `isMobile` context/helper so deeply nested components can toggle layouts consistently.
s
## Phase 2 – Header & Card Actions

**Status:** In progress — `PremiumPageHeader` & `PremiumCard` action stacks updated for mobile (2025-11-15).

- Update `PremiumPageHeader` and `PremiumCard` to:
  - Switch header layout to `Stack direction={{ xs: 'column', md: 'row' }}`.
  - Wrap action buttons with `flexWrap="wrap"` and add gaps so buttons stack on narrow widths.
  - Provide an overflow menu (speed dial or three-dot menu) when more than three actions exist on `xs`.
  - Shrink icon tiles/paddings at `xs` to avoid wasted space.

## Phase 3 – Filter Surfaces

- Rebuild filter bars (e.g., `ElectorFilterBar`, guarantees filters) with CSS grid or stacked layout:
  - Inputs use `xs=12` so they take full width on phones.
  - Action buttons become a wrap-enabled row; also expose an icon-only compact variant.
  - Move rarely used advanced chips into accordions to minimize vertical bloat.

## Phase 4 – Data Views (Tables → Responsive Variants)

- For each data-heavy view (Electors, Guarantees, etc.):
  - Decide between a responsive table (hide columns + expandable rows) or a dedicated mobile card list.
  - If keeping `<Table>`, hide non-critical columns via `display: { xs: 'none', md: 'table-cell' }` and add stacked detail rows.
  - If switching to cards, reuse typography tokens and move action clusters into kebab menus or bottom sheets.

## Phase 5 – Dialogs & Secondary Cards

- Apply `fullScreen={isMobile}` to all dialogs (`ViewElectorDialog`, guarantee modals, etc.).
- Collapse multi-column grids in dialogs/stat cards to a single-column `Stack` on `xs`.
- Trim gradient paddings and massive icon sizes for mobile comfort.

## Execution Notes

- Each phase should include regression testing at 360 px, 414 px, 768 px via Chrome DevTools.
- Update related documentation (`DASHBOARD-REFACTORING-SUMMARY.md`, component READMEs) after implementing each phase.
- Prioritize `MainContentStyled` changes first; downstream components depend on the shell being mobile-friendly.


