# Layout Refresh Plan

**Date:** Nov 19, 2025  
**Scope:** Align all app shells (Main, Simple, Minimal) with shared spacing/elevation tokens, ensure headers/footers/mobile bars use consistent structure, and remove stray layout logic from views.

---

## 1. Goals

1. Single source of truth for shell spacing/margins (`theme.layoutSpacing.shell`).
2. Ensure `AppBar`, `Footer`, and `MobileBottomMenu` share the same padding/ elevation rules across breakpoints.
3. Eliminate view-level wrappers (`Container`, inline padding) that duplicate shell spacing.
4. Confirm marketing/auth layouts (Simple/Minimal) follow the same theme tokens or have documented deviations.

---

## 2. Current Inventory

| Component | File | Notes |
|-----------|------|-------|
| `MainLayout` | `layout/MainLayout/index.tsx` | Desktop AppBar + `MainContentStyled` using `layoutSpacing`. |
| `Header` | `layout/MainLayout/Header/**` | Inline nav, notifications, fullscreen, profile; expects `Toolbar` padding from layoutSpacing. |
| `Footer` | `layout/MainLayout/Footer.tsx` | Uses `shellSpacing.padding` but no horizontal padding (inherits from `MainContent`). |
| `MobileBottomMenu` | `layout/MainLayout/MobileBottomMenu.tsx` | Uses `shellSpacing.marginX.xs` for placement; custom blur/elevation. |
| `SimpleLayout` | `layout/SimpleLayout/index.tsx` | Marketing pages w/ custom header background; no layoutSpacing. |
| `MinimalLayout` | `layout/MinimalLayout/index.tsx` | Auth & maintenance pages; just `Outlet + Customization`. |

---

## 3. Phase Plan

### Phase A – Audit & Documentation

- [x] Map every AppBar/Toolbar usage (landing page, UI components) and note whether layoutSpacing applies.
- [x] List views still wrapping content in `Container`/`Box` with hard-coded padding.
- [x] Decide on elevation standards for shell components (header, footer, mobile menu).

### Phase B – Main Shell Alignment

- [x] Update `Header` / `Toolbar` to use shared elevation + sticky border shadow.
- [x] Ensure `Footer` mirrors `Toolbar` padding horizontally (`shellSpacing.marginX`).
- [x] Normalize `MobileBottomMenu` width/padding to `shellSpacing` and share elevation token (e.g., `theme.customShadows`).
- [x] Refine `MainContentStyled` top/bottom spacing for both desktop and mobile app bars.

### Phase C – Variant Layouts

- [x] Apply layoutSpacing to `SimpleLayout` (marketing) where feasible; document exceptions (hero background).
- [x] Review Minimal layout (auth) for consistent padding / background color tokens.

### Phase D – View Cleanup

- [x] Remove redundant `Container` / `Box` padding from high-traffic views (Dashboard, Guarantees, Electors).
- [x] Replace hard-coded `padding: 24px` with `theme.layoutSpacing.shell.padding.md` where shell-level overrides are still needed (e.g., modals).

---

## 4. Success Metrics

1. No inline `padding: '24px'` or stray `Container` wrappers in views for base spacing.
2. All shell components (header/footer/mobile menu) reference layoutSpacing + shared elevation tokens.
3. Layout variants documented with rationale (Simple/Minimal differences).
4. Visual QA: consistent gutters on desktop & mobile across dashboard and marketing pages.

---

## 5. Next Steps

1. Execute Phase A audit (AppBar instances, view wrappers).  
2. Prioritize fixes based on visual impact (start with MainLayout shell, then marketing/auth).  
3. Implement fixes, verify on desktop + mobile, update documentation accordingly.

---

## Phase A Findings (Nov 19)

### AppBar / Toolbar usage

- `layout/MainLayout/index.tsx` – desktop AppBar uses `Toolbar` with `theme.layoutSpacing.shell` for padding (good).
- `layout/SimpleLayout/index.tsx` – marketing pages rely on `ui-component/extended/AppBar` with fixed header background; no layoutSpacing reference yet.
- `layout/MainLayout/HorizontalBar.tsx` – horizontal menu variant has its own AppBar; inherits theme spacing but should be cross-checked.
- Landing-page sections (`views/pages/landing/HeaderSection.tsx`) embed a marketing AppBar variant with custom gradients; currently independent of layoutSpacing.
- `ui-component/extended/AppBar.tsx` – shared component used by SimpleLayout and some marketing pages; candidate for injecting layoutSpacing tokens.

### Container / Hard-coded padding usage

- Guarantees (`views/guarantees/Guarantees.tsx`) – tables and card views wrapped in `Paper` + `Box` with inline padding; rely on `Stack` spacing but no layoutSpacing reference.
- Dashboard management tabs (`views/dashboard/components/management/tabs/*.tsx`) – multiple `Container` and `Grid` wrappers with fixed padding (24px).
- Attendance (`views/attendance/components/AttendanceList.tsx`, Quick dialogs) – `Container` usage for column layout.
- Electors (`views/electors/components/ElectorTableView.tsx`, dialogs) – use `TableContainer` + `Box` padding.
- Sorting (vote counting) tabs (`views/sorting/components/*.tsx`) – wrap sections in `Container`, manual `sx={{ p: 2 }}`.
- Other marketing/landing sections heavily rely on `Container` for hero layouts; acceptable if documented as exceptions.

These findings guide Phase B: focus on replacing fixed paddings in the main app views (dashboard, guarantees, attendance, sorting) with layoutSpacing-derived values, while documenting intentional deviations for marketing layouts.

---

## Phase A Elevation Standards (Nov 19)

### Shell Component Elevation Standards

**Standardized elevation tokens for consistent visual hierarchy:**

#### 1. Header (AppBar)

- **Shadow**: `theme.customShadows.z8` (fallback: `theme.shadows[4]`)
  - `z8` = `0 8px 16px 0 ${transparent}` (8px blur, 16px spread)
- **Backdrop**: `blur(10px)` for glassmorphism effect
- **Border**: `1px solid ${theme.palette.divider}` (bottom border)
- **Elevation prop**: `0` (using custom shadow instead)
- **Z-index**: `theme.zIndex.drawer + 1`

**Usage**: Fixed header at top of main layout, provides subtle elevation above content.

#### 2. Footer

- **Shadow**: None (no elevation)
- **Border**: `1px solid ${theme.palette.divider}` (top border only)
- **Purpose**: Minimal visual separation, no elevation needed

**Usage**: Static footer at bottom of main content, uses border-only separation.

#### 3. Mobile Bottom Menu

- **Shadow**: `theme.customShadows.z20` (fallback: `theme.shadows[8]`)
  - `z20` = `0 0 3px 0 ${transparent} 0 18px 36px -5px ${transparent}` (dual-layer shadow)
- **Backdrop**: `blur(18px)` for stronger glassmorphism effect
- **Border**: `1px solid ${theme.palette.divider}` (full border)
- **Elevation prop**: `0` (using custom shadow instead)
- **Z-index**: `theme.zIndex.drawer + 2` (above header)

**Usage**: Floating navigation menu on mobile, requires higher elevation for prominence.

### Custom Shadow Definitions

Custom shadows are defined in `themes/shadows.tsx`:

- **z8**: `0 8px 16px 0 ${transparent}` - Medium elevation (header)
- **z20**: `0 0 3px 0 ${transparent} 0 18px 36px -5px ${transparent}` - High elevation (mobile menu)
- Shadows adapt to theme mode (dark/light) using `alpha(color, 0.24)`

### Implementation Pattern

All shell components follow this pattern:

```typescript
const shadow = theme.customShadows?.z{level} ?? theme.shadows[fallback];
sx={{
  elevation: 0, // Use custom shadow instead
  boxShadow: shadow,
  backdropFilter: 'blur({amount}px)', // For glassmorphism
  border: `1px solid ${theme.palette.divider}` // Visual separation
}}
```

**Rationale**: Custom shadows provide better control over elevation levels and visual consistency across light/dark modes. Backdrop blur adds modern glassmorphism effect. Borders provide clear visual separation without relying solely on shadows.

---

## Phase C Findings (Nov 19)

### SimpleLayout Updates

- **`ui-component/extended/AppBar.tsx`** – Updated to use `layoutSpacing.shell.padding.sm` for Toolbar vertical padding, ensuring consistency with MainLayout's Toolbar spacing.
- **`layout/SimpleLayout/index.tsx`** – Uses `HeaderWrapper` with custom hero background image (`/assets/images/landing/bg-header.jpg`). This full-screen background is intentional for marketing pages and doesn't require shell-level spacing.
- **Exception documented**: Marketing pages (contact-us, faqs, privacy-policy) use full-screen hero backgrounds with custom padding. The AppBar now uses layoutSpacing tokens, but the page content itself intentionally deviates from shell spacing for visual impact.

### MinimalLayout Review

- **`layout/MinimalLayout/index.tsx`** – Intentionally minimal (just `Outlet + Customization`). No shell spacing needed.
- **Auth pages structure**: Auth pages (login, register, etc.) use:
  - `AuthWrapper1` – Full-screen background with fixed attachment (intentional for centered card layout)
  - `AuthCardWrapper` – Centered card with custom margins (`xs: 2.5, md: 3`) and backdrop blur
- **Exception documented**: Auth pages are intentionally full-screen with centered content cards. They don't use shell-level spacing as they're designed to be immersive, full-viewport experiences. The card margins are component-level and don't conflict with shell spacing standards.

---

## Phase D Findings (Nov 19)

### View Padding Standardization

- **`views/sorting/Sorting.tsx`** – Replaced hard-coded `p: 3` with `layoutSpacing.shell.padding.md` tokens in content Box wrappers (2 instances).
- **`views/attendance/Attendance.tsx`** – Replaced hard-coded `p: 3` with `layoutSpacing.shell.padding.md` token in content Box wrapper.
- **`views/dashboard/components/management/tabs/*.tsx`** – Updated all 4 tabs (PartiesTab, CandidatesTab, CommitteesTab, UsersTab) to use `layoutSpacing.shell.padding.md` instead of hard-coded `p: 3`.

### Remaining Views

- **`views/guarantees/Guarantees.tsx`** – Uses `TableContainer` and `Paper` components with intentional content padding. These are not redundant with shell spacing as they provide internal content grouping.
- **`views/electors/ElectorsList.tsx`** – Uses `TableContainer` and `Paper` components with intentional content padding. These are not redundant with shell spacing.

**Note**: Internal content padding (like `p: 3` inside `PremiumCard` with `padding={0}`) is intentional for content spacing and not redundant with shell padding. The shell provides outer spacing, while internal padding provides content grouping within components.
