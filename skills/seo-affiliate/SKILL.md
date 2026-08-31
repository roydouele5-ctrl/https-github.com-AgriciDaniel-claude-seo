---
name: seo-affiliate
description: >
  Affiliate monetization block design, audit, and generation for content sites.
  Builds conversion-engineered comparison blocks, single-product cards, and
  ranked "best of" tables with correct rel="sponsored" attribution, compliant
  disclosure placement, Review/ItemList JSON-LD, zero-CLS markup, and GA4 click
  tracking. Includes YMYL guardrails for health, fitness, and wellness content,
  offer-architecture copy scaffolding, and an asset-value model for site resale.
  Use when the user says "affiliate block", "affiliate", "monetize my blog",
  "comparison table", "best of post", "product card", "EPC", "RPM",
  "affiliate disclosure", "rel sponsored", "Lovable block", or "sell my blog".
user-invocable: true
argument-hint: "[audit|generate|offer|compliance|valuation] [url or topic]"
license: MIT
metadata:
  author: AgriciDaniel
  version: "2.2.4"
  category: seo
---

# Affiliate Block Optimization

Most affiliate blocks lose money for reasons that have nothing to do with the
offer: the link is not attributed, the disclosure sits below the fold, the
block ships 400ms of layout shift above the fold, and the copy describes the
product instead of the reader's outcome.

This skill treats an affiliate block as three stacked layers, audited and built
in this order:

1. **Compliance layer** — disclosure, link attribution, YMYL guardrails. A block
   that fails here is a liability, not an asset, and it destroys resale value.
2. **Crawl and citation layer** — server-rendered markup, correct JSON-LD,
   atomic citable claims for AI search surfaces.
3. **Conversion layer** — offer architecture, proof, risk reversal, CTA
   microcopy.

Layer 1 is a gate. Never optimize layer 3 on a block that fails layer 1.

## Commands

| Command | Purpose |
|---------|---------|
| `/seo affiliate audit <url>` | Audit existing affiliate blocks on a page (all three layers) |
| `/seo affiliate generate <topic>` | Generate a ready-to-ship block from the bundled templates |
| `/seo affiliate offer <product>` | Offer-architecture copy scaffold for one product |
| `/seo affiliate compliance <url>` | Compliance-only pass (disclosure, attribution, YMYL) |
| `/seo affiliate valuation <url>` | Model asset value from current monetization data |

## Execution Pipeline

### Step 1: Fetch and Parse

1. Fetch via `claude-seo run render_page.py "<url>" --mode auto --json`.
   Affiliate blocks are frequently injected client-side; `--mode auto` catches
   blocks that a raw HTML fetch would miss.
2. Parse with `claude-seo run parse_html.py --url "<url>"` for headings,
   schema, images, and links.
3. Compare the rendered DOM against the raw HTML. Any block that exists **only**
   after JavaScript execution is a Critical citation-layer finding: AI search
   crawlers and many SERP features never see it.

### Step 2: Compliance Layer (gate)

Read `references/compliance-ymyl.md` before scoring this layer.

Check every outbound commercial link:

| Check | Requirement | Severity if failed |
|-------|-------------|--------------------|
| Link attribution | `rel="sponsored"` (or `sponsored nofollow`) on every monetized link | Critical |
| Disclosure presence | Explicit affiliate disclosure on the page | Critical |
| Disclosure proximity | Disclosure visible before or beside the first block, not only in the footer or a linked policy page | High |
| Disclosure clarity | Plain language, not "we may earn from qualifying purchases" buried in 10px grey text | High |
| Cloaked or redirected links | Redirects through `/go/`, `/out/`, `/recommends/` still need `rel="sponsored"` on the anchor **and** a `noindex` or robots-disallowed redirector | High |
| YMYL claim safety | No treat / cure / prevent / diagnose claims for health, fitness, supplement, or wellness products | Critical |
| Author attribution | Named author with a verifiable credential or stated experience basis | High (YMYL) |
| Testimonial honesty | No fabricated reviews, ratings, or "as seen in" badges | Critical |
| Scarcity honesty | Countdowns and stock counters must reflect a real deadline or real inventory | Critical |

Fabricated proof and fake urgency are not a grey area. They are the two
findings that most reliably fail a buyer's due diligence during an acquisition,
and both carry regulatory exposure (FTC 16 CFR Part 255 in the US, the Unfair
Commercial Practices Directive and DGCCRF enforcement in the EU/France).

### Step 3: Citation and Crawl Layer

Read `references/block-schema.md` for the JSON-LD decision table.

1. **Rendering**: block markup must be present in the server response.
2. **Schema**: choose per block type —
   - Ranked "best of" list → `ItemList` of `Product`, each with `offers`
   - Single editorial verdict → `Review` with `itemReviewed` and a named `author`
   - Genuine reader Q&A → `QAPage`
   - **Never** `HowTo` (deprecated Sept 2023)
   - **Never** add `AggregateRating` from ratings the site did not collect
   - Do **not** add new `FAQPage` for SERP benefit (Google retired FAQ rich
     results for all sites on 7 May 2026); flag existing `FAQPage` at Info only
3. **Citability**: each product entry needs one atomic, sourced, extractable
   claim (a measured spec, a price, a tested result) that an AI answer engine
   can lift without reading the whole page. Attribute every number to a source.
4. **Layout stability**: images and badges need reserved dimensions. A block
   above the fold is the single most common CLS source on affiliate pages.
5. **Interaction latency**: no per-card JavaScript listeners in a loop, no
   client-side price fetch on the critical path. Event delegation only.

### Step 4: Conversion Layer

Read `references/offer-architecture.md`.

Score each product entry against the four value levers:

| Lever | Question the block must answer | Where it lives |
|-------|-------------------------------|----------------|
| Dream outcome | What specific state does the reader reach? | Card headline |
| Perceived likelihood | Why would it work *for them*? | Proof line: tested-by, sample size, credential, source |
| Time delay | How long until the first result? | Timeframe badge |
| Effort and sacrifice | What does it cost them in work, habit change, or risk? | Effort line + risk-reversal line |

A card that only answers "dream outcome" is a brochure. Cards that answer all
four convert several times better at identical traffic, which is the entire
mechanism behind an RPM lift.

Then check the supporting elements: a "best for" segmentation line per card
(so the reader self-selects instead of comparing), the vendor's actual
guarantee stated as risk reversal, a specific CTA verb tied to the outcome
rather than "Buy now", and a clear #1 pick so the block has a default answer.

### Step 5: Report

Emit findings by layer, each with the four required attributes from the
orchestrator's synthesis methodology: the first-principle observation, the
dependency relationship, a falsifiability check, and a leading indicator.

Score the block 0-100:

| Layer | Weight |
|-------|--------|
| Compliance | 40% |
| Citation and crawl | 30% |
| Conversion | 30% |

Compliance is weighted highest because a compliance failure is the only
category that can take the whole asset to zero.

## Generation

`/seo affiliate generate` ships two bundled templates. Both render the same
block and the same JSON-LD; pick by destination.

| Template | Destination |
|----------|-------------|
| `templates/affiliate-block.tsx` | React + TypeScript + Tailwind. Lovable, Next.js, Astro, Vite. |
| `templates/affiliate-block.html` | Dependency-free HTML with scoped CSS. WordPress Custom HTML block, shortcode, or any CMS. |

Both templates are data-driven: all copy and product data live in one typed
structure at the top, so the same block can be re-skinned per article without
touching markup. Both ship with:

- `rel="sponsored noopener"` hardcoded on every outbound link
- A disclosure slot rendered above the first card, not optional
- `ItemList` + `Product` JSON-LD generated from the same data as the markup,
  so the visible content and the structured data can never disagree
- Fixed aspect-ratio media boxes (zero CLS) and `loading="lazy"` below the fold
- One delegated click handler emitting a GA4 `select_promotion` event
- WCAG AA contrast, keyboard-reachable cards, visible focus rings

For a Lovable build, read `references/lovable-prompt.md` and hand the user the
prompt verbatim. The prompt is written so Lovable produces the same component
contract as the bundled template, which keeps the later WordPress export
mechanical rather than a rewrite.

**WordPress transfer path**: build in Lovable, then move the rendered block via
`templates/affiliate-block.html` into a reusable block or a shortcode. Do not
export the React runtime into WordPress; a content site does not need a
client-side framework to ship a comparison table, and shipping one costs the
Core Web Vitals margin the block was built to protect.

## Valuation

Read `references/conversion-benchmarks.md` for the model and current multiple
ranges.

`/seo affiliate valuation` maps monetization work to asset value. Content sites
trade on a multiple of average monthly net profit over a trailing window, so
the target sale price implies a required monthly profit, and the audit findings
become the path to it. Report the arithmetic explicitly, state the trailing
window the multiple assumes, and never present a multiple as a guarantee —
it is a market range that moves with traffic quality, revenue concentration,
and diligence readiness.

## Reference Files

Load on demand, not at startup:

- `references/offer-architecture.md` — value levers, card anatomy, CTA microcopy, proof taxonomy
- `references/compliance-ymyl.md` — disclosure, attribution, health-claim guardrails, EU/FR and US rules
- `references/block-schema.md` — JSON-LD decision table and copy-ready patterns
- `references/conversion-benchmarks.md` — CTR/EPC/RPM benchmarks and the resale valuation model
- `references/lovable-prompt.md` — the Lovable build prompt and component contract

## Handoffs

| Situation | Route to |
|-----------|----------|
| Page fails E-E-A-T beyond the block | `/seo content <url>` |
| Block invisible to crawlers, wider rendering problem | `/seo technical <url>` |
| Schema questions beyond the block | `/seo schema <url>` |
| Which articles deserve a block | `/seo cluster <seed>` |
| Block is right but the page type is wrong for the keyword | `/seo sxo <url>` |
| Monitoring monetization changes over time | `/seo drift baseline <url>` |

## Error Handling

| Scenario | Action |
|----------|--------|
| No affiliate links found | Report it as a finding, not an error. Offer `/seo affiliate generate` for the page's topic. |
| Links present but destination unreachable | Report the broken link with its anchor text. Broken affiliate links are silent revenue loss; list them first. |
| Page renders block client-side only | Report as Critical citation-layer finding, then continue scoring the rendered DOM. |
| User asks for fabricated ratings, fake scarcity, or unsupported health claims | Decline that element, state the reason in one sentence, and ship the rest of the block with the compliant alternative in place. |
| No monetization data for valuation | Ask for the trailing 6-12 month revenue and traffic. Do not model value from traffic alone. |
