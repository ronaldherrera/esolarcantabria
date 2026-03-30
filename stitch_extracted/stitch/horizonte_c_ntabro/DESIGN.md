# Design System Document: The Solar Editorial

## 1. Overview & Creative North Star: "The Luminous Horizon"
This design system rejects the "utility-only" look of traditional renewable energy websites. Instead of a generic grid of icons, we embrace **The Luminous Horizon**—a creative North Star that treats the interface like a high-end architectural journal. We move away from "exclusive luxury" by using accessible, open layouts, but maintain "premium quality" through sophisticated tonal layering, intentional asymmetry, and editorial-grade typography.

The system is built on the tension between the organic (Cantabria’s green landscapes) and the technical (solar precision). By utilizing wide-set margins and overlapping "glass" containers, we create a sense of breathing room that feels both aspirational and approachable.

---

## 2. Colors: Tonal Depth & Solar Warmth
We utilize a Material-inspired palette where color is used to define function and emotion, not just decoration.

*   **Primary (`#0d631b`):** The "Cantabrian Forest" Green. Used for brand authority and success states.
*   **Secondary (`#00629e`):** The "Coastal Trust" Blue. Used for technical reliability and information architecture.
*   **Tertiary/Accent (`#ffba38`):** The "Solar Energy" Amber. Reserved exclusively for Call to Actions (CTAs) to ensure high conversion and visual heat.
*   **Neutral/Surface (`#f8faf8`):** A range of off-whites and soft greys to prevent "snow blindness" and add depth.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit directly against a `surface` background to create a soft, seamless transition.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following hierarchy to create depth:
1.  **Base:** `surface` (#f8faf8)
2.  **Sectioning:** `surface-container-low` (#f2f4f2)
3.  **Content Cards:** `surface-container-lowest` (#ffffff)
4.  **Interactive Elements:** `surface-container-high` (#e6e9e7)

### The "Glass & Gradient" Rule
To elevate the brand above "standard" UI, use Glassmorphism for floating navigation or sticky contact bars. Apply a `surface` color at 80% opacity with a `20px` backdrop-blur. For Hero sections, use a subtle radial gradient transitioning from `primary` to `primary-container` to mimic the depth of a solar cell.

---

## 3. Typography: Editorial Authority
We pair **Manrope** for high-impact brand moments with **Inter** for functional clarity.

*   **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero statements. This font’s geometric yet warm nature conveys modern engineering.
*   **Titles & Body (Inter):** Use `title-md` (1.125rem) for sub-headers and `body-lg` (1rem) for general content. Inter is chosen for its exceptional legibility at small sizes, crucial for SEO-rich copy.
*   **Typographic SEO Tip:** Ensure every page has a single `display-lg` (H1) and follows a logical hierarchy down to `title-sm` (H4) to assist crawlability.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines. We use light and air.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural lift.
*   **Ambient Shadows:** For floating elements (like the "Request Quote" modal), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(25, 28, 27, 0.06)`. The color is a tinted version of `on-surface`, never pure black.
*   **The "Ghost Border" Fallback:** If a container needs more definition (e.g., in a complex pricing table), use a "Ghost Border": `outline-variant` (#bfcaba) at 15% opacity.

---

## 5. Components: Precision & Clarity

### Buttons (The Solar Drivers)
*   **Primary CTA:** Uses `tertiary_fixed` (#ffdeac) text on a `tertiary` (#734e00) background. Shape: `rounded-md` (0.75rem). Transition: Subtle scale up (1.02x) on hover.
*   **Secondary:** Ghost style using `outline` (#707a6c) at 20% opacity.

### Solar Pricing Cards
*   **Architecture:** Use `surface-container-lowest` (#ffffff) for the card body. No borders.
*   **Asymmetry:** Position the price (`display-sm`) slightly offset to the top-left, breaking the container's edge for an editorial look.
*   **Separation:** Forbid dividers. Use `spacing-6` (2rem) of vertical white space to separate features.

### Testimonial "Atmospheres"
Instead of standard quote boxes, use a wide-bleed layout. A large `display-md` quote mark in `primary_fixed` (#a3f69c) sits behind the text. The text itself uses `title-lg` for high readability and emotional impact.

### Input Fields
*   **Style:** Minimalist. Only a bottom-weighted stroke using `outline-variant` (#bfcaba). On focus, the stroke transitions to `secondary` (#00629e) with a soft `surface-variant` background fill.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use whitespace as a functional tool. Use `spacing-20` (7rem) between major sections to let the design breathe.
*   **DO** use high-quality imagery of Cantabria’s landscapes integrated with solar panels.
*   **DO** ensure all text/background combinations meet WCAG AA contrast ratios (using `on-surface` and `on-primary` tokens).

### Don't:
*   **DON'T** use 1px solid black or high-contrast grey borders. It breaks the "premium" feel.
*   **DON'T** use generic stock icons. Use custom line-art icons that follow the `outline` token's weight (approx 1.5px).
*   **DON'T** clutter the cards. If a card has more than 5 elements, use a "nested" `surface-container-high` area within the card to group them.

---

## 7. SEO-First Design Strategy
*   **Semantic Layout:** Use `<section>` and `<article>` tags to wrap tonal color shifts.
*   **Speed-Centric:** All Glassmorphism and gradients must be CSS-based, not image-based, to ensure lightning-fast LCP (Largest Contentful Paint) times.
*   **Readability:** Maintain a maximum line length of 65 characters for `body-lg` text to ensure high dwell time and reduced bounce rates.