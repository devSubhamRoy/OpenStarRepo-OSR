# design.md — "Open Source Alternatives to Popular Software"

## 1. Context and goals

### Design intent (one sentence)
A dark, token-governed dashboard web app that enables online shoppers and consumers to discover, compare, and adopt open-source alternatives to expensive commercial software with zero visual friction, strict WCAG 2.2 AA accessibility, and instant keyboard navigation across mobile, tablet, and desktop viewports.

### Goals
- Empower cost-conscious consumers and software shoppers to find verified open-source alternatives to paid SaaS and desktop tools.
- Enforce strict token consistency across all surfaces: components **must** reference semantic tokens, and raw color/spacing/typography values **must not** appear outside design token definitions.
- Achieve WCAG 2.2 AA compliance with testable acceptance criteria across keyboard navigation, contrast ratios, and screen reader announcements.
- Scale cleanly across the dashboard's component density: **inputs (1735), links (199), cards (70), lists (43), buttons (24), navigation (4)**.
- Guarantee full responsiveness and touch optimization across mobile (<640px), tablet (640px–1024px), and desktop (>1024px) viewports.

### Non-goals
- No local visual exceptions or hardcoded color palettes outside the specified brand tokens.
- No bespoke transitions or decorative animations beyond `motion.duration.instant=100ms`.
- No light-theme exceptions: `color.surface.base=#000000` is the invariant base surface across this product surface.
- No hover-dependent interactions that degrade touch or mobile user experiences.

---

## 2. Design tokens and foundations

### 2.1 Token table (source of truth)

| Token | Value | Semantic Role / Usage |
|---|---|---|
| `font.family.primary` | `Inter Variable` | Primary typographic family for all headings, copy, UI labels |
| `font.family.stack` | `Inter Variable, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji` | Comprehensive cross-platform fallback stack |
| `font.size.base` | `12px` | Default body copy, data cells, dense dashboard telemetry |
| `font.weight.base` | `400` | Standard body copy weight |
| `font.lineHeight.base` | `16px` | Standard compact line height for dashboard density |
| `font.size.xs` | `12px` | Badges, metadata tags, micro-labels, helper text |
| `font.size.sm` | `13px` | Secondary descriptors, table data, filter options |
| `font.size.md` | `14px` | Navigation links, form controls, card body excerpts |
| `font.size.lg` | `16px` | Sub-headings, alternative project titles, key metrics |
| `font.size.xl` | `18px` | Card section titles, modal headers, filter group titles |
| `font.size.2xl` | `20px` | Category titles, dashboard segment headers |
| `font.size.3xl` | `48px` | Main dashboard hero display heading (H1) |
| `color.text.primary` | `lab(72.74 0 0)` | Primary body text, labels, high-visibility interactive text |
| `color.text.secondary` | `lab(91.068 0 0)` | High-contrast emphasis headings, active states, key data values |
| `color.text.tertiary` | `lab(63.228 0 0)` | Muted copy, secondary metadata, inactive hints, placeholders |
| `color.text.inverse` | `oklab(0.922998 -0.00000905991 0.0000215769 / 0.5)` | Translucent text, subtle secondary markers, disabled text tint |
| `color.surface.base` | `#000000` | Invariant dashboard page canvas background |
| `color.surface.muted` | `lab(3.56288 0 0)` | Subtle recessed surfaces, table header rows, input backgrounds |
| `color.surface.raised` | `oklab(0.269999 -0.00000269711 0.00000631809 / 0.5)` | Elevated cards, flyout menus, dialog sheets, sticky navigation |
| `color.border.default` | `lab(15.32 0 0)` | Default structural borders, dividers, chip boundaries |
| `space.1` | `2px` | Hairline gaps, micro badge adjustments |
| `space.2` | `4px` | Icon-to-label gaps, focus outline offset, tight badge padding |
| `space.3` | `6px` | Form row gaps, tag vertical padding, list item gaps |
| `space.4` | `8px` | Standard component internal padding, control spacing unit |
| `radius.xs` | `4px` | Badges, tags, form input controls, focus rings |
| `radius.sm` | `6px` | Buttons, cards, modal dialogue panels, navigation tabs |
| `motion.duration.instant`| `100ms` | Unified duration for all UI state transitions (hover, focus, active) |

### 2.2 Semantic aliasing rules
- Components **must** use semantic token names in styling definitions; direct hex, RGB, or custom LAB values outside the token dictionary are strictly prohibited.
- The canvas surface **must** always be `color.surface.base` (`#000000`).
- Elevated surfaces (such as cards, filters, and sticky headers) **must** utilize `color.surface.raised` with `color.border.default` (`lab(15.32 0 0)`) borders.
- Recessed controls, inputs, and search fields **must** resolve their background to `color.surface.muted`.
- Focus outlines **must** measure exactly 2px solid `color.text.primary` (`lab(72.74 0 0)`) with an offset of `space.2` (`4px`).
- Transitions **must** only use `motion.duration.instant` (`100ms`). Under `prefers-reduced-motion: reduce`, transition durations **must** be set to `0ms`.
- Corner radius nesting rule: nested elements **must not** exceed their parent container's radius (`radius.xs` inside `radius.sm`).

### 2.3 Type ramp rules
- The page heading (H1) **must** use `font.size.3xl` (`48px`).
- Section headings **must** use `font.size.2xl` (`20px`).
- Alternative card titles **must** use `font.size.lg` (`16px`) or `font.size.xl` (`18px`).
- Default dashboard body text and data cells **must** adhere to `font.size.base` (`12px`) with `font.lineHeight.base` (`16px`).
- Meta tags, badges, and category chips **must** use `font.size.xs` (`12px`).
- Custom or non-token typography sizes **must not** be declared.

---

## 3. Component-level rules

This section defines the 6 core components across the dashboard density: **Inputs (×1735), Links (×199), Cards (×70), Lists (×43), Buttons (×24), Navigation (×4)**. Every component provides full anatomy, variants, 7 mandatory states (**default, hover, focus-visible, active, disabled, loading, error**), and responsive/edge-case behavior.

---

### 3.1 Inputs (×1735)

The dashboard contains 1735 interactive input instances across search fields, category filters, license selection, proprietary software comparison toggles, pricing ranges, and table facet checkboxes.

**Anatomy:** `label` (associated via `for`/`id`) → container (`color.surface.muted` + `color.border.default`) → leading icon slot (e.g. search magnifying glass) → `input` or `select` native element → trailing action/clear button → helper/error message slot (`span[id]` referenced by `aria-describedby`).

**Variants:**
1. `search` — full-width or auto-flex query input with instant debounced filtering.
2. `filter-checkbox` — compact facet checkbox (44×44px touch target) for software category, licensing, or commercial brand comparison.
3. `select` — native styled dropdown for sort order, platform filtering, and pagination limit.
4. `toggle-switch` — boolean comparison selector ("Show only free alternatives", "Self-hostable only").

**States (mandatory for all variants)**

| State | Rule |
|---|---|
| **default** | Fill: `color.surface.muted`; border: `1px solid color.border.default`; text: `color.text.primary`; placeholder: `color.text.tertiary`; radius: `radius.xs`; typography: `font.size.md`. |
| **hover** | Border shifts to `color.text.tertiary`; background remains `color.surface.muted`; transition: `motion.duration.instant`. |
| **focus-visible** | Border transitions to `color.text.secondary`; 2px solid outline in `color.text.primary` appears with `space.2` (`4px`) offset; outline **must never** be suppressed. |
| **active** | Background tints subtly to `color.surface.raised`; text caret active; border stays `color.text.secondary`. |
| **disabled** | Container opacity sets to 40%; `cursor: not-allowed`; native `disabled` and `aria-disabled="true"` set; helper text explains cause. |
| **loading** | Input retains user editability while results container marks `aria-busy="true"`; trailing slot renders a subtle pulse indicator. |
| **error** | Input sets `aria-invalid="true"`; error text renders immediately below with `id` linked by `aria-describedby`; text uses `color.text.secondary` with explicit warning copy. |

**Behavior**
- **Keyboard:** Tab navigates through inputs in sequential visual order. `Escape` clears text search. Spacebar/Enter toggles checkboxes and dropdown options.
- **Pointer:** Clicking anywhere inside the container focuses the input; clear button click clears text without losing field focus.
- **Touch:** All touch targets enforce a minimum bounding box of 44×44px via `min-h-[44px]` and padding `space.3`×`space.4`. Font size is ≥ 14px on mobile inputs to eliminate iOS safari auto-zoom.
- **Responsive:** Inputs stretch to 100% full width on mobile viewports (<640px) and stack vertically with `space.4` gap. On tablet and desktop, search and filters align into grid rows.
- **Edge cases:** Inputs with zero matches trigger the mandatory empty state (§5.4); long search strings scroll horizontally within the field without overflowing card or page containers.

---

### 3.2 Links (×199)

Links connect alternative projects to GitHub repositories, official documentation, commercial pricing comparisons, category archives, and platform downloads.

**Anatomy:** `a` tag → optional leading badge/icon → anchor text run → optional trailing external link indicator (`space.2` gap).

**Variants:**
1. `standalone` — navigation links, table cells, and category pills.
2. `inline` — contextual links within description copy and comparison notes.
3. `card-overlay` — primary link stretching over the alternative card surface using an accessible pseudo-overlay pattern.

**States (mandatory for all variants)**

| State | Rule |
|---|---|
| **default** | Text: `color.text.primary`; `inline` links display a persistent 1px underline in `color.border.default`; `standalone` links display without underline; typography: `font.size.sm` or `font.size.md`. |
| **hover** | Text shifts to `color.text.secondary`; underline appears or brightens to `color.text.primary`; transition: `motion.duration.instant`. |
| **focus-visible** | 2px solid outline in `color.text.primary` with `space.2` offset; for `card-overlay`, the focus ring surrounds the entire card boundary. |
| **active** | Text settles at `color.text.secondary`; underline tightens. |
| **disabled** | Navigation links representing unreleased features **must** set `aria-disabled="true"`, render in `color.text.tertiary`, and suppress pointer events while remaining focusable. |
| **loading** | Navigating links maintain visible text; page progress bar indicates navigation status without layout jump. |
| **error** | Dead or unresolvable links are blocked at authoring/data validation time; broken links **must not** ship. |

**Behavior**
- **Keyboard:** Enter triggers link navigation. All 199 link instances are reachable via Tab in visual DOM order.
- **Pointer:** Full hit area is active. For card links, inner actions (`button`, repository copy buttons) have `position: relative; z-index: 10` to preserve independent operation.
- **Touch:** Minimum 44px touch height guaranteed through inline padding and table row spacing.
- **Responsive:** Trailing external icon hides below 480px in dense comparison tables to conserve horizontal space. Text wraps strictly on word boundaries.
- **Edge cases:** Never use generic "Click here" or "Visit"; accessible name **must** include project and context (e.g. "Visit Supabase GitHub repository").

---

### 3.3 Cards (×70)

The primary data entity on the dashboard: 70 open-source alternative cards displaying project metrics, commercial software replaced, licensing, GitHub star counts, and direct action triggers.

**Anatomy:** `article` landmark → rank/license badge (`radius.xs`) → alternative title (H3) → commercial alternative comparison tag ("Alternative to: [Proprietary App]") → summary copy (clamped to 2 lines) → metadata row (stars, license, tech stack) → action button row (max 2 actions).

**Variants:**
1. `standard` — standard 3-column alternative card on desktop, 2-column on tablet, 1-column on mobile.
2. `featured` — spotlight alternative card with highlighted comparison metrics and verified status badge.
3. `compact` — dense horizontal list-view card for quick bulk comparison.

**States (mandatory for all variants)**

| State | Rule |
|---|---|
| **default** | Background: `color.surface.raised`; border: `1px solid color.border.default`; radius: `radius.sm`; padding: `space.4`; title: `color.text.secondary`; copy: `color.text.primary`. |
| **hover** | Border brightens to `color.text.tertiary`; background lightens slightly; no custom elevation shadows permitted; transition: `motion.duration.instant`. |
| **focus-visible** | 2px solid outline in `color.text.primary` offset `space.2` surrounding the card container when focused via keyboard. |
| **active** | Inner card actions transition to active; card background remains stable without scale transforms. |
| **disabled** | Archived or deprecated open-source projects display a permanent "Archived" badge; action buttons set `aria-disabled="true"`. |
| **loading** | Skeletons render matching geometric shape, displaying animated pulse blocks in `color.surface.muted` for title, summary, and tags. |
| **error** | Failed card data renders an inline error card with message "Alternative data unavailable" plus a retry button; card **must not** disappear silently. |

**Behavior**
- **Keyboard:** Tab lands sequentially: Card Title Link → Secondary Compare Action → Primary Visit Action.
- **Pointer:** Clicking card surface activates primary project link; secondary actions are independently clickable.
- **Touch:** Action buttons expand to full width below 480px with minimum 44px vertical touch height.
- **Responsive:**
  - Mobile (<640px): 1 column (100% width).
  - Tablet (640px–1024px): 2 columns.
  - Desktop (>1024px): 3 columns (grid auto-fill, no stretching for orphaned cards).
- **Edge cases:** Alternative names truncate after 1 line with ellipsis; descriptions clamp to exactly 2 lines; missing GitHub stars or license display explicit "Not reported" text instead of blank gaps.

---

### 3.4 Lists (×43)

43 list instances organize alternatives by category, feature comparisons, pro/con assessments, facet filter groups, and technical specifications.

**Anatomy:** Semantic `ul` or `ol` container → `li` elements → leading icon/marker slot → content block → trailing value or status badge.

**Variants:**
1. `feature-comparison` — checkmark or cross bulleted list comparing open source vs proprietary capabilities.
2. `filter-facets` — checklist list of categories, licenses (MIT, Apache, GPL), and tech stacks.
3. `ranked-alternatives` — numbered list showing top alternatives by community adoption.
4. `meta-spec` — key/value definition list (`dl`/`dt`/`dd`) inside detail panels.

**States (mandatory for all variants)**

| State | Rule |
|---|---|
| **default** | Item vertical padding: `space.3`; horizontal gap between marker and label: `space.3`; text: `color.text.primary`; typography: `font.size.base`. |
| **hover** | Interactive list items (containing links or filter inputs) tint background to `color.surface.muted`; non-interactive rows remain static. |
| **focus-visible** | Focus indicator applies to the nested interactive child (checkbox or link), never the static `li` element. |
| **active** | Interactive list items show active touch feedback without layout shift. |
| **disabled** | Discontinued or unselectable options render in `color.text.tertiary` with `aria-disabled="true"`. |
| **loading** | Minimum 3 skeleton item rows render while list data fetches. |
| **error** | When list data fails to load, render a single error row with "Unable to load list data" and a retry button; empty lists are prohibited. |

**Behavior**
- **Keyboard:** List navigation is driven by native child focus (links, inputs); lists with custom selection support `ArrowUp` and `ArrowDown`.
- **Pointer:** Row click toggles associated checkbox or triggers link.
- **Touch:** Item rows maintain minimum 44px touch height on coarse pointer devices.
- **Responsive:** Two-column pro/con comparison lists collapse into a single stacked column below 640px.
- **Edge cases:** Text wraps gracefully without truncating mid-word; empty search results trigger empty-state guidance (§5.4).

---

### 3.5 Buttons (×24)

24 high-visibility buttons manage primary dashboard actions: alternative submission, filter reset, compare drawer toggle, JSON export, and quick-copy repo clone commands.

**Anatomy:** `button` or `a[role="button"]` → optional leading icon (`space.2` gap) → descriptive text label → optional trailing badge.

**Variants:**
1. `primary` — high-emphasis conversion action ("Submit alternative", "View on GitHub"): background `color.text.secondary`, text `color.surface.base`, radius `radius.sm`, padding `space.3`×`space.4`.
2. `secondary` — comparison and filter control: transparent fill, `1px solid color.border.default`, text `color.text.primary`, radius `radius.sm`.
3. `ghost` — inline utility actions (copy clone URL, share alternative): text `color.text.primary`, transparent background, hover tint.

**States (mandatory for all variants)**

| State | Primary | Secondary | Ghost |
|---|---|---|---|
| **default** | Fill: `color.text.secondary`; text: `color.surface.base`; radius: `radius.sm`. | Fill: transparent; border: `1px solid color.border.default`; text: `color.text.primary`. | Fill: transparent; text: `color.text.primary`; border: none. |
| **hover** | Fill: `color.text.primary`; text: `color.surface.base`; transition: `motion.duration.instant`. | Border: `color.text.tertiary`; text: `color.text.secondary`. | Fill: `color.surface.muted`; text: `color.text.secondary`. |
| **focus-visible** | 2px solid outline `color.text.primary`, offset `space.2`. | Same focus outline. | Same focus outline. |
| **active** | Fill shifts darker; no scale down or transform. | Background tints with `color.surface.muted`. | Background tints with `color.surface.raised`. |
| **disabled** | Opacity 40%; `cursor: not-allowed`; `aria-disabled="true"`. | Same disabled styling. | Same disabled styling. |
| **loading** | Label replaced with "Loading…" text; button width pinned to prevent layout shift; `aria-live="polite"`. | Same loading state. | Same loading state. |
| **error** | Label transitions to "Action failed"; `aria-live="assertive"`; resets on click. | Same error state. | Same error state. |

**Behavior**
- **Keyboard:** Native button activates via `Enter` or `Space`. Anchor-button activates via `Enter`.
- **Pointer:** Entire bounding box is clickable.
- **Touch:** 44×44px minimum hit area enforced.
- **Responsive:** Primary card action buttons stretch to full width on mobile viewports (<480px).
- **Edge cases:** Long labels truncate with ellipsis after 24 characters with visible `title` attribute; button labels **must not** wrap onto two lines.

---

### 3.6 Navigation (×4)

The application provides exactly 4 semantic navigation landmark regions:
1. `Header Navigation` (`nav[aria-label="Primary"]`) — sticky top bar with logo, core sections, and search access.
2. `Filter & Category Navigation` (`nav[aria-label="Category filters"]`) — horizontal scroll strip of software categories (Productivity, DevTools, Graphics, Security).
3. `Quick-Jump & Mobile Drawer` (`nav[aria-label="Quick jump"]`) — mobile drawer / floating jump menu for quick category navigation.
4. `Footer Navigation` (`nav[aria-label="Directory sitemap"]`) — comprehensive index of directory categories, contribution links, and community guidelines.

**States (mandatory for all navigation regions)**

| State | Rule |
|---|---|
| **default** | Links display in `color.text.primary` with `font.size.md`; transparent background; padding `space.2`×`space.3`; radius `radius.xs`. |
| **hover** | Background transitions to `color.surface.muted`; text remains `color.text.secondary`; transition `motion.duration.instant`. |
| **focus-visible** | 2px solid outline `color.text.primary` with `space.2` offset on the active navigation item. |
| **active** | Current page link sets `aria-current="page"`, text is `color.text.secondary`, background is `color.surface.raised`. |
| **disabled** | Coming soon or disabled nav links render with `aria-disabled="true"` in `color.text.tertiary` without pointer actions. |
| **loading** | Navigation landmarks are statically rendered in the initial HTML and **must not** gate on async responses. |
| **error** | If a route fails to resolve, navigation landmark remains intact and active, rendering error in main content area. |

**Behavior**
- **Keyboard:** Tab order strictly follows DOM hierarchy: Header → Categories → Main Content → Footer.
- **Pointer:** Click initiates instant client-side routing.
- **Touch:** Touch targets are padded to ≥ 44px. Category filter strip provides smooth horizontal swipe (`overflow-x: auto`) with momentum scrolling.
- **Responsive:** Desktop top links collapse into a slide-over mobile drawer below 768px.
- **Edge cases:** Duplicate `aria-label` values across the 4 navigation landmarks are strictly prohibited.

---

## 4. Accessibility requirements and testable acceptance criteria

### 4.1 Focus-visible system (global)
- All interactive controls (buttons, links, inputs, selects, cards) **must** display a 2px solid outline in `color.text.primary` (`lab(72.74 0 0)`) with an offset of `space.2` (`4px`) on `:focus-visible`.
- Removing or hiding the focus ring via `outline: none` without a matching replacement is prohibited.
- **Testable acceptance check:** Tab through the entire dashboard from header to footer. Every single interactive stop **must** render a visible high-contrast ring. (Pass: 0 missing stops; Fail: any unhighlighted element).

### 4.2 Heading hierarchy and landmarks
- The document **must** contain exactly one `h1` element representing the dashboard title.
- Heading tags **must not** skip hierarchical levels (`h1` → `h2` → `h3`).
- A "Skip to alternatives" link **must** be the very first focusable element on the page, jumping immediately to `#alternatives-grid`.
- **Testable acceptance check:** Run automated axe / Lighthouse accessibility audit: 0 heading skips; skip link receives initial tab and moves focus on `Enter`.

### 4.3 Contrast requirements
- Normal text (`color.text.primary` on `color.surface.base` or `color.surface.raised`) **must** meet or exceed 4.5:1 contrast ratio.
- Large text (`font.size.2xl` and above) **must** meet or exceed 3.0:1 contrast ratio.
- Non-text UI components (input borders `color.border.default`, check indicators, focus rings) **must** achieve ≥ 3.0:1 contrast against adjacent surface tokens.
- **Testable acceptance check:** Automated token pair evaluation passes 100% of combinations without contrast failures.

### 4.4 Keyboard and touch target criteria
- All 1735 inputs, 199 links, 70 cards, 43 lists, 24 buttons, and 4 navigation landmarks **must** be reachable and operable with keyboard alone.
- All touch targets on mobile and touch devices **must** present a bounding target of at least 44×44px or include adequate spacing buffer.
- **Testable acceptance check:** Full dashboard operation verified using only Tab, Shift+Tab, Space, Enter, and Arrow keys with zero keyboard traps.

### 4.5 Motion and screen reader live announcements
- All transitions **must** execute within `motion.duration.instant` (`100ms`).
- When `prefers-reduced-motion: reduce` is enabled, all animations and transitions **must** be suppressed immediately (`0ms`).
- Filter query updates, sort alterations, and result count changes **must** announce dynamically via an `aria-live="polite"` status region (e.g. "70 open source alternatives displayed").
- **Testable acceptance check:** Toggle system reduced motion: transitions are eliminated; update search query: screen reader announces dynamic result count.

---

## 5. Content and tone standards

### 5.1 Labels and actions
- Every interactive element **must** be self-explanatory out of context.
- Where actions repeat across alternative cards (such as "Visit repo" or "Compare"), the accessible name **must** include the project name.
- Action labels **should** begin with an active verb in sentence case.

| Prohibited Label | Required Accessible Label |
|---|---|
| "Click here" | "Browse all developer tool alternatives" |
| "Visit" (repeated 70×) | "Visit Supabase GitHub repository" |
| "Compare" (repeated 70×) | "Compare Penpot with Figma" |
| "More info" | "Read detailed license and hosting breakdown for Bitwarden" |
| "Submit" | "Submit new open source alternative" |

### 5.2 Tone examples
- ✅ **Implementation-focused & confident:** "Penpot provides self-hostable vector design and prototyping with native SVG support, replacing Figma."
- ❌ **Promotional fluff:** "Penpot is an unbelievable, mind-blowing, world-changing design sensation!"
- ✅ **Actionable & clear:** "Filter 70 open-source alternatives by commercial competitor, OSI license, or deployment type."
- ❌ **Vague & passive:** "There are various items to see below if you want."

### 5.3 Overflow and truncation rules
- Alternative titles truncate at 1 line with ellipsis (`truncate`).
- Descriptions clamp at 2 lines (`line-clamp-2`).
- Table data cells wrap on word boundaries and **must not** clip content awkwardly.

### 5.4 Mandatory empty-state pattern
Whenever filtering or search returns 0 matching alternatives, the dashboard **must** render:
1. An icon slot (`compass` or `search`).
2. A prominent heading (`font.size.xl`): "No open-source alternatives match your criteria".
3. A helpful suggestion sentence: "Try clearing specific filters or search by proprietary software name (e.g., Photoshop, Slack, Notion)."
4. A single secondary action button: "Clear all filters" that resets state.

---

## 6. Anti-patterns and prohibited implementations

1. **Hardcoded color hex or LAB values inside components:** Writing `#ffffff`, `rgb(...)`, or untracked LAB values directly in component classes. *Migration: Replace with semantic tokens (`color.text.primary`, `color.surface.raised`, `color.border.default`).*
2. **One-off spacing or typography exceptions:** Applying arbitrary values like `p-[15px]` or `text-[17px]`. *Migration: Snap to standard spacing (`space.1` through `space.4`) and typography scale (`font.size.xs` through `3xl`).*
3. **Hidden focus indicators:** Specifying `outline: none` or hiding focus on keyboard tabs. *Migration: Implement global `focus-visible` 2px solid outline in `color.text.primary` with `space.2` offset.*
4. **Duplicate accessible button names:** 70 cards rendering identical "View" buttons. *Migration: Include the project name in `aria-label` (e.g. `aria-label="View AppFlowy repository"`).*
5. **Fake interactive styling on static containers:** Giving hover highlights or pointer cursors to non-clickable cards or list items. *Migration: Confine hover and active states exclusively to actionable components.*
6. **Spinner-only loading states:** Displaying a lone spinning icon without explanatory text. *Migration: Swap button label to "Loading…" with width pinned and announce via `aria-live`.*
7. **Phantom skeleton shipping:** Skeletons that never resolve into content, an empty state, or an error boundary. *Migration: Ensure every skeleton is tied to data promise resolution with a retryable error fallback.*
8. **Radius nesting violations:** Nesting a `radius.sm` badge inside a `radius.xs` input. *Migration: Enforce parent radius ≥ child radius.*
9. **Low-contrast text pairings:** Placing `color.text.tertiary` on dark surfaces for body paragraphs. *Migration: Reserve `color.text.tertiary` for micro hints; all readable copy must use `color.text.primary` or `color.text.secondary`.*
10. **Tabindex manipulation:** Using `tabindex > 0` to rearrange focus order. *Migration: Reorder DOM elements directly to match logical reading order.*

---

## 7. QA checklist

| # | Check Item | Verification Method | Quality Gate |
|---|---|---|---|
| **QA-1** | All 7 states (default, hover, focus-visible, active, disabled, loading, error) implemented for all interactive elements | Comprehensive component state matrix review | **Must pass** |
| **QA-2** | Zero raw color/spacing/typography values declared outside design tokens | Automated CSS/codebase grep audit | **Must pass** |
| **QA-3** | Contrast ratios pass WCAG 2.2 AA (≥ 4.5:1 for body copy; ≥ 3.0:1 for large text and UI borders) | Automated contrast ratio matrix scan | **Must pass** |
| **QA-4** | 100% keyboard navigable without traps across all 1735 inputs, 199 links, 70 cards, 43 lists, 24 buttons, 4 navigation regions | Manual keyboard walkthrough | **Must pass** |
| **QA-5** | Visible 2px focus ring with `space.2` offset present at every single tab stop | Focus indicator screenshot verification | **Must pass** |
| **QA-6** | All touch targets maintain minimum 44×44px effective bounding box on mobile and tablet | Computed style touch target audit | **Must pass** |
| **QA-7** | Exactly one `h1`; heading structure never skips levels; all 4 navigation landmarks uniquely labeled | Automated accessibility audit (axe-core) | **Must pass** |
| **QA-8** | "Skip to alternatives" link is the first focusable element and jumps to `#alternatives-grid` | Manual keyboard verification on load | **Must pass** |
| **QA-9** | Empty, loading, and error states gracefully rendered for cards, lists, and filter results | Simulated network/filter test sweep | **Must pass** |
| **QA-10** | All 70 cards render with alternative name, commercial software replaced, tags, star metrics, and accessible actions | Visual review across desktop, tablet, and mobile | **Must pass** |
| **QA-11** | Accessible names unique across repeating card buttons and links | Accessibility tree inspection | **Must pass** |
| **QA-12** | Transitions complete within `motion.duration.instant=100ms` and disable when `prefers-reduced-motion` is active | Browser emulation test | **Must pass** |
| **QA-13** | Fully responsive at mobile (<640px), tablet (640px–1024px), and desktop (>1024px) viewports with zero horizontal overflow | Multi-device layout verification | **Must pass** |
| **QA-14** | Filter and search updates dynamically announced via `aria-live="polite"` region | Screen reader announcement verification | **Must pass** |
| **QA-15** | Zero broken links or unresolvable URLs across all 199 link instances | Automated link crawler verification | **Must pass** |
| **QA-16** | Codebase builds with 0 errors, passes TypeScript checks, and ships production bundle cleanly | `npm run build` verification | **Must pass** |
