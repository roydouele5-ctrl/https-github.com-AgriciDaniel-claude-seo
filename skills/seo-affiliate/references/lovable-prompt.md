# Lovable Build Prompt

Two ways to get the block into a Lovable project. Prefer the first.

## Path A — paste the template (recommended)

The bundled `templates/affiliate-block.tsx` is already a valid Lovable
component: React + TypeScript + Tailwind, no external UI dependency.

1. In Lovable, create `src/components/AffiliateBlock.tsx` and paste the file.
2. Create `src/data/blocks/<slug>.ts` exporting an `AffiliateBlockData` object.
3. Import and render: `<AffiliateBlock data={blockData} />`.

This path is deterministic. Path B regenerates the component from scratch, so
you get whatever the model produces that day — use it only when you want the
component restyled to an existing design system.

## Path B — the generation prompt

Paste verbatim. The constraints are ordered so the non-negotiable ones come
first; models truncate obedience toward the end of a long prompt.

---

Build a React + TypeScript component `AffiliateBlock` styled with Tailwind. It
renders a ranked affiliate comparison block for a health and fitness blog.
No external UI or icon library.

**Non-negotiable constraints. Do not change or omit any of these:**

1. Every outbound product link must have `rel="sponsored noopener"` and
   `target="_blank"`. Hardcode the `rel` value in the JSX — never accept it as
   a prop.
2. Render an affiliate disclosure box above the first product card. It is not
   conditional and not collapsible: body-sized text, at least 14px, WCAG AA
   contrast.
3. Emit `ItemList` JSON-LD in a `<script type="application/ld+json">`,
   generated from the same products array that renders the cards. Escape `<`,
   `>` and `&` in the serialized JSON.
4. Never emit `AggregateRating`, `FAQPage`, or `HowTo`. Only include an `Offer`
   when the component actually displays that price.
5. Every product image needs explicit `width` and `height` attributes and a
   wrapper with a fixed `aspect-ratio`. The block must contribute zero
   cumulative layout shift.
6. Use one delegated click handler on the section root, resolving the clicked
   anchor with `closest("a[data-affiliate-cta]")`. Do not attach a handler per
   card.
7. Render the spec comparison as a semantic `<table>` with `<caption>`,
   `scope="col"` on column headers and `scope="row"` on the product name cell.
   Not a grid of divs.

**Data model.** Define and export these types, then drive everything from them:

```ts
interface AffiliateProduct {
  id: string; rank: number; badge: string; name: string; brand: string;
  image: { src: string; alt: string; width: number; height: number };
  outcome: string; bestFor: string;
  proof: { claim: string; sourceLabel?: string; sourceUrl?: string };
  timeframe: string; effort: string; riskReversal: string; tradeOff: string;
  specs: Array<{ label: string; value: string }>;
  price?: { amount: string; currency: string; availability?: string; note?: string };
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

interface AffiliateBlockData {
  id: string; heading: string; intro?: string;
  disclosure: string; medicalDisclaimer?: string; methodologyHref?: string;
  lastUpdated: string;
  author?: { name: string; credential: string; url?: string };
  specColumns: string[];
  products: AffiliateProduct[];
}
```

**Card layout**, in this order: rank badge (`#1 · {badge}`), product image,
product name with brand, `outcome` as the lead line, `bestFor`, `proof` with
its source linked (`rel="noopener nofollow"`), then a two-cell definition list
showing `timeframe` under the label "Délai" and `effort` under "Effort", then
the specs, then `tradeOff` prefixed "À savoir :", then `riskReversal`, then the
price, then the CTAs.

The `timeframe` and `effort` cells matter more than they look: they are the two
fields competing blocks omit entirely, and they are why this block converts.
Give them equal visual weight to the specs.

**Tracking.** On an affiliate click, send GA4 `select_promotion` with
`promotion_id` = block id, `creative_name` = product id, `creative_slot` =
position. Prefer `window.gtag` when present, fall back to `window.dataLayer`.
Guard for server rendering with `typeof window === "undefined"`. No personal
data in the parameters.

**Accessibility.** Cards in an `<ol role="list">`, visible focus rings on every
interactive element, `aria-label` on each CTA including the product name,
`<time dateTime>` for the update date.

**Copy language:** French.

**Content rules for the placeholder data you generate:** never write that a
product treats, cures, prevents, or diagnoses anything; never promise a weight
or a result in a timeframe; state doses, certifications, and mechanisms
instead. Give every product one real drawback in `tradeOff`.

---

## After Lovable generates

Verify before shipping. Lovable reliably drops constraints 1, 3 and 5.

| Check | How |
|-------|-----|
| `rel="sponsored"` on every affiliate anchor | View source, search `sponsored`, count against the number of CTAs |
| Disclosure above the first card | Visual check at 375px width |
| JSON-LD present in the served HTML | View source, not devtools DOM inspector |
| No `AggregateRating` | Search the JSON-LD |
| Images have width and height | Search `width=` in the rendered card markup |
| Zero CLS | Lighthouse, or `/seo page <url>` |
| Full audit | `/seo affiliate audit <url>` |

## Exporting to WordPress

Do not port the React runtime. Build and tune the block in Lovable, then move
the finished markup with `templates/affiliate-block.html`, which is the same
block with no framework: one `<style>` scope, one small delegated-listener
script, and the same JSON-LD.

Two placement options in WordPress:

- **Reusable (synced) block** — paste the HTML into a Custom HTML block, save
  it as a synced pattern, then insert it in each article. Edits propagate.
- **Shortcode** — move the HTML into a PHP template partial and register a
  shortcode, so per-article product data comes from arguments or a CPT.

The `<style>` block in the template is namespaced under `.cseo-affiliate` so it
will not collide with theme CSS. Move it into the theme stylesheet once, and
strip it from subsequent block instances so it is not duplicated per article.
