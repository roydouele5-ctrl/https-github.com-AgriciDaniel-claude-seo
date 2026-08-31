# JSON-LD for Affiliate Blocks

The rule that governs everything below: **structured data describes what is
visibly on the page, generated from the same data the markup renders.** A block
whose schema and visible content are maintained separately will drift, and
drifted review markup is a manual-action risk, not a cosmetic bug.

Both bundled templates generate their JSON-LD from the same typed product array
that renders the cards, which makes disagreement structurally impossible.

## Decision table

| Block type | Type to emit | Notes |
|-----------|--------------|-------|
| Ranked "best of" list | `ItemList` with `ListItem` → `Product` | `itemListOrder: ItemListOrderDescending`, `position` per item |
| Single editorial verdict | `Review`, `itemReviewed: Product`, named `author` | The site's own opinion; author must be a real Person or Organization |
| Product entry with a price | `Product` → `offers: Offer` | Only if the price shown is current and accurate |
| Genuine reader Q&A | `QAPage` | Real user questions and answers only |
| Comparison of two named products | `ItemList` of two `Product` | Not `Review` unless the page states a verdict |

## Never emit

| Type | Reason |
|------|--------|
| `HowTo` | Deprecated by Google in September 2023; no SERP feature. |
| New `FAQPage` for SERP benefit | Google retired FAQ rich results for all sites on 7 May 2026. Existing `FAQPage` is an Info-level finding, not a removal recommendation, and does not carry a confirmed AI-citation benefit. |
| `AggregateRating` from ratings the site did not collect | Structured data policy violation; the most common cause of review-snippet manual actions on affiliate sites. |
| `Offer` with a price the page does not display | Price mismatch is a merchant-listing violation and misleads the reader. |

If the marketplace rating is worth showing, put it in visible text with the
source named and linked. Do not launder it through schema.

## ItemList pattern (ranked block)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best protein powders for beginners, tested 2026",
  "itemListOrder": "https://schema.org/ItemListOrderDescending",
  "numberOfItems": 3,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "Brand X Whey Isolate",
        "brand": { "@type": "Brand", "name": "Brand X" },
        "image": "https://example.com/img/brand-x.webp",
        "description": "30g protein per serving, Informed Sport certified.",
        "offers": {
          "@type": "Offer",
          "price": "39.90",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": "https://example.com/go/brand-x"
        }
      }
    }
  ]
}
```

Notes:

- `offers.url` may point at the redirector. The redirector must still be
  robots-disallowed or `noindex`, and the anchor still needs `rel="sponsored"`.
- Omit the `offers` block entirely when the price is not displayed or not
  current. An omitted property is fine; a wrong one is a violation.
- `numberOfItems` must match the rendered card count.

## Review pattern (editorial verdict)

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "Brand X Whey Isolate",
    "brand": { "@type": "Brand", "name": "Brand X" }
  },
  "author": {
    "@type": "Person",
    "name": "Camille Roux",
    "jobTitle": "Diététicienne-nutritionniste, DE",
    "url": "https://example.com/auteurs/camille-roux"
  },
  "datePublished": "2026-08-31",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "4.2",
    "bestRating": "5",
    "worstRating": "1"
  },
  "reviewBody": "Mixes cleanly in cold water; the vanilla is noticeably sweeter than..."
}
```

`reviewRating` here is legitimate: it is the site's own stated verdict, made by
a named author, and the same score is visible on the page. That is the
distinction from a fabricated `AggregateRating`.

The `author.url` should resolve to a real author page carrying the credential.
On a YMYL page this is load-bearing for E-E-A-T, not decoration.

## Placement and rendering

- Emit as `<script type="application/ld+json">` in the server response.
  Schema injected only after hydration is unreliable for AI crawlers and is a
  Critical citation-layer finding in this skill's audit.
- One JSON-LD block per logical entity. Do not merge an `ItemList` and a
  `Review` into one object; emit both scripts.
- Escape `<`, `>`, and `&` in any string that could contain HTML.

## Validation

1. `claude-seo run parse_html.py --url "<url>"` to extract what is actually
   emitted after render.
2. Cross-check every schema value against the visible card data. Any field that
   appears in schema but not on the page is a finding.
3. Google's Rich Results Test for eligibility; the Schema Markup Validator for
   syntax. The repo's PostToolUse schema hook (`hooks/hooks.json`) validates
   generated JSON-LD on write.

## What actually gets cited by AI answer engines

Rich-result eligibility and AI citability are different problems. Schema helps
an engine parse the entity; it does not make the page quotable. Citability
comes from the visible text:

- One atomic, self-contained claim per product ("30g protein per 32g serving,
  Informed Sport certified") that survives being lifted out of context
- A number with a unit and a source for every comparative statement
- A real comparison table in HTML `<table>` markup, not a CSS grid of `<div>`s —
  table semantics are what makes a comparison extractable
- A visible "last updated" date and a stated methodology
- Named entities spelled consistently across the page

Both bundled templates emit the comparison as a semantic `<table>` for this
reason, with the card layout applied on top at small viewports.
