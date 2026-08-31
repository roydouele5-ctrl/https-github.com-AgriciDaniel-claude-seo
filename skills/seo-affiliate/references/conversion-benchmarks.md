# Conversion Benchmarks and Asset Valuation

Two jobs: give the audit a yardstick, and connect block-level work to what the
site is worth. Treat every number here as a planning heuristic to be replaced
by the site's own measured data as soon as there is any. Ranges vary widely by
niche, traffic source, and program, and marketplace multiples move with market
conditions — verify current comparables before quoting a figure to anyone.

## The metric chain

```
sessions -> block viewability -> block CTR -> merchant conversion rate -> EPC -> RPM
```

Each stage is a separate lever, and they are not equally movable:

| Stage | Metric | Who controls it | Typical lever |
|-------|--------|-----------------|---------------|
| Traffic | sessions | SEO | `/seo cluster`, `/seo sxo` |
| Viewability | % of sessions that see a block | Layout | Block placement, above-fold #1 card |
| Engagement | block CTR (affiliate clicks / sessions) | Copy + structure | This skill |
| Conversion | merchant CR | Merchant | Program and offer selection |
| Yield | EPC (earnings per click) | Program + intent match | Program selection, intent match |
| Outcome | RPM (revenue per 1,000 sessions) | All of the above | — |

**RPM = (block CTR x EPC) x 1000.** An affiliate block audit moves the first
term. Program selection moves the second. Both multiply, which is why a
mediocre block on a well-matched high-EPC program outperforms an excellent
block on a 3% commodity commission.

## Planning ranges for health, fitness, and wellness content

Use as a sanity check, not a target:

| Metric | Weak | Typical | Strong |
|--------|------|---------|--------|
| Block CTR, informational article | under 1% | 2-5% | 8%+ |
| Block CTR, commercial-intent article ("best X", "X vs Y") | under 5% | 10-20% | 30%+ |
| RPM, physical-product affiliate | under 5 EUR | 10-25 EUR | 40 EUR+ |
| RPM, subscription or program affiliate | under 10 EUR | 25-60 EUR | 100 EUR+ |

Two structural facts this table encodes:

1. **Commercial-intent articles convert 5-10x better than informational ones.**
   Where a block goes matters more than what the block says. `/seo cluster`
   identifies which articles carry commercial intent; put the effort there.
2. **Commission model dominates niche.** A supplement affiliate at 8% of a 40
   EUR order earns ~3 EUR per sale. A coaching program or app subscription at
   30% recurring earns multiples of that on the same click. In health and
   fitness both exist side by side — the program mix is a bigger lever than
   any copy change.

## Diagnosing a low RPM

Work down the chain; stop at the first stage that is out of band.

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| High sessions, near-zero clicks | Block below the fold or on informational-only articles | Placement; move blocks to commercial-intent pages |
| Clicks but no revenue | Broken or expired links, missing tracking ID, cookie not set | Verify every link end to end; check the redirector |
| Decent CTR, low EPC | Program mismatch — sending high-intent readers to a low-commission merchant | Re-map programs before touching copy |
| Traffic falling, RPM flat | Ranking problem, not a monetization problem | `/seo audit`, `/seo drift compare` |
| Everything flat after a copy rewrite | The denominator levers were never addressed | `offer-architecture.md`, time-delay and effort lines |

## Tracking

Measure block CTR before changing anything, or the work is unfalsifiable.

The bundled templates emit a GA4 `select_promotion` event per click, carrying
`promotion_id` (block id), `creative_name` (product slug), and `creative_slot`
(card position). That gives block CTR, per-card CTR, and per-position CTR in
one report, and it is consent-mode compatible.

Never put personal data in event parameters. Never fire tracking before consent
where consent is required.

## Asset valuation

Content sites are priced on a multiple of average monthly net profit over a
trailing window — most commonly the trailing 12 months, sometimes 6 for faster
marketplaces. The multiple is a market range, not a formula output.

```
sale price  ~=  average monthly net profit  x  multiple
```

Observed brokered ranges for content sites have historically clustered around
**30-45x monthly net profit** on the established broker marketplaces, with
smaller and younger sites trading lower (roughly 20-30x) and sites with strong
diversification, recurring revenue, and clean documentation trading at the top
of the range or above. These are ranges, not quotes — pull live comparables
before advising on a specific site.

### Working backwards from a target

Given a target price and an assumed multiple:

```
required average monthly net profit = target price / multiple
```

Worked example, 50,000 EUR target:

| Assumed multiple | Required avg monthly net profit |
|------------------|--------------------------------|
| 25x | 2,000 EUR |
| 30x | 1,667 EUR |
| 35x | 1,429 EUR |
| 40x | 1,250 EUR |

Report this arithmetic explicitly whenever the user names a target price.

### The trailing-window constraint

This is the finding that most often surprises a site owner, so state it early:

**The multiple applies to an *average* over the trailing window, not to the
last good month.** A site that earns 0 EUR for eight months and 3,000 EUR in
month twelve has a 12-month average of 250 EUR, not 3,000 EUR. Buyers and
brokers also discount or refuse sites with less than 6-12 months of revenue
history, however good the recent months look.

The practical consequence: the calendar, not the effort, is usually the binding
constraint on a target sale price. When the user's timeline is shorter than the
trailing window their target multiple assumes, say so directly and early, and
give the two honest options — extend the timeline, or lower the target price to
what the achievable average supports.

### What moves the multiple, beyond profit

Ranked by how much diligence weight they carry:

| Factor | Raises the multiple | Lowers it |
|--------|--------------------|-----------|
| Revenue concentration | 3+ programs, none over ~50% | One program over 70% of revenue |
| Traffic concentration | Multiple channels, many ranking pages | One page or one keyword carrying most traffic |
| Revenue type | Recurring or subscription commissions | One-off physical-product commissions |
| Compliance | Disclosures, attribution, no fabricated proof | Any finding from `compliance-ymyl.md` |
| Content ownership | Owned, original, documented process | Purchased or spun content, undocumented |
| Operations | Written SOPs, contractor process, clean analytics | Owner-dependent, no documentation |
| Email list | Owned list with measured revenue | None |
| Trademark and brand risk | Clean marks, clean domain history | Expired-domain history, trademark issues |
| Site age | 24 months+ of history | Under 12 months |

Compliance appears in the middle of this list but behaves differently from the
others: the rest adjust the multiple, while an unresolved compliance finding
can end a deal outright during diligence. That asymmetry is why this skill
gates on it.

A quick check on domain history is worth running before any valuation work:
`claude-seo run domain_history.py` surfaces expired-domain heritage that a
buyer's diligence will find anyway.

### Diligence readiness checklist

Prepare these in parallel with the monetization work, not after:

- Analytics with a full trailing history, no gaps, no filtered-out periods
- Affiliate program dashboards exportable, per-program revenue split
- Content inventory: URL, author, publication date, traffic, revenue
- Written SOPs for publishing, updating, and link maintenance
- Documented link-check process with the last run date
- Author credentials and reviewer records for YMYL pages
- Clean legal pages: disclosure, privacy, medical disclaimer, terms
