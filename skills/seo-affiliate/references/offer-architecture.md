# Offer Architecture for Affiliate Blocks

How to write a product card that a reader acts on. The affiliate does not
control the product, the price, or the guarantee — only the framing. Framing is
where the entire conversion delta lives.

## The four value levers

Direct-response practice (Alex Hormozi's value equation is the most compact
modern statement of it) holds that perceived value rises with the outcome and
the reader's belief they will get it, and falls with how long it takes and how
much work it costs:

```
             dream outcome  x  perceived likelihood of achievement
value  ~=   ---------------------------------------------------------
                    time delay  x  effort and sacrifice
```

The practical consequence for a block: **two of the four levers are in the
denominator, and almost every affiliate card ignores both.** Competitors write
headline + spec list + button, which addresses the numerator only. Answering
time delay and effort is the cheapest available differentiation.

| Lever | Card element | Weak version | Strong version |
|-------|-------------|--------------|----------------|
| Dream outcome | Headline | "Premium whey protein" | "Hits 30g protein in a shake you can make in the office kitchen" |
| Perceived likelihood | Proof line | "Highly rated" | "Third-party tested by Informed Sport; 4.4/5 across 12,400 verified buyers" |
| Time delay | Timeframe badge | absent | "Delivered in 48h · noticeable in ~3 weeks of consistent use" |
| Effort and sacrifice | Effort + risk line | absent | "One scoop, no blender needed · 30-day money-back guarantee from the brand" |

Write the denominator lines first. They are harder and they are what is missing
from the competing page.

## Card anatomy

Order matters — this sequence answers the reader's questions in the order they
occur:

1. **Rank badge** (`#1 Overall`, `Best value`, `Best for beginners`) — lets the
   reader self-select instead of comparing all N options. A block where every
   card is undifferentiated forces a comparison the reader will not finish.
2. **Product name + brand** — entity clarity for both readers and answer engines.
3. **Media** — fixed aspect ratio, real product photo, descriptive alt text.
4. **Outcome headline** — the dream outcome in the reader's words.
5. **"Best for" line** — one sentence naming the person this is right for.
6. **Proof line** — see the proof taxonomy below.
7. **Timeframe badge** — time to delivery and time to a realistic result.
8. **Two to four specs** — only the specs that change a buying decision.
9. **Honest trade-off** — one real drawback. This is a conversion element, not a
   concession: a card with no downside reads as an advertisement, and a stated
   trade-off is the strongest available credibility signal on the page.
10. **Risk reversal** — the vendor's actual return or guarantee terms, quoted.
11. **CTA** — see CTA microcopy below.
12. **Price context** — price band or "check current price" when the price moves.

## Proof taxonomy

Ranked by strength. Use the strongest tier available; never invent a tier you
do not have.

| Tier | Form | Example |
|------|------|---------|
| 1 | First-hand testing with a method | "We ran all six for 8 weeks; mixing tested at 20s in cold water" |
| 2 | Independent certification | "Informed Sport certified, batch-tested" |
| 3 | Named expert review | "Reviewed by [name], [credential]" |
| 4 | Verified aggregate reviews with source and count | "4.4/5 across 12,400 verified buyers on the brand store" |
| 5 | Published research on the ingredient or mechanism, cited | "Creatine monohydrate: [study], n=..." |
| 6 | Unsourced star rating | Do not use. |

Tier 6 is not a weak proof — it is a compliance finding. See
`compliance-ymyl.md`.

## CTA microcopy

The button is not the offer, it is the transition. Two rules:

- **Name the destination and the next step**, so the click has no ambiguity:
  "Check the current price on [brand]" beats "Buy now" — it also sets an honest
  expectation that reduces bounce-back, which protects EPC.
- **Tie the verb to the outcome** where the destination allows it: "Start the
  30-day trial", "See today's stock and price".

Secondary CTA, one per card at most: "Read our full review" pointing at an
internal review page. This captures readers who are not ready and keeps them on
the site, which is worth more than a lost click.

Never use: countdown timers on evergreen content, "only 3 left" without live
inventory, or a fake "price drops in 04:59". See the compliance reference —
these are the elements that fail acquisition diligence.

## Influence principles that survive scrutiny

Cialdini's principles apply, but only the versions grounded in something true:

| Principle | Honest implementation | Dishonest version to refuse |
|-----------|----------------------|-----------------------------|
| Social proof | Real review counts with a linked source | Invented ratings, stock photo "customers" |
| Authority | Named reviewer with a stated credential | "Doctor recommended" with no doctor |
| Scarcity | Real, dated promotion that actually ends | Evergreen countdown that resets on reload |
| Reciprocity | A genuinely useful free comparison, calculator, or checklist | Gated content that does not exist |
| Commitment | A short "which are you?" self-selection step | Manipulative multi-step quiz that hides the product |
| Liking | A real author voice and stated bias | Fabricated personal story |

## Segmentation over persuasion

The highest-leverage change in most health and fitness blocks is not stronger
copy — it is **splitting one ranked list into two or three reader segments**
("first supplement", "training 5x/week", "sensitive stomach"). Each segment
gets a shorter list and a clearer #1. This raises click-through by removing
choice paralysis rather than by pressuring the reader, and it survives every
form of regulatory and buyer scrutiny.

## Sequencing within an article

- **Above the fold**: at most one card, the #1 pick, plus the disclosure.
- **After the "how we chose" section**: the full comparison table.
- **After each detailed review section**: a single-card block for that product.
- **End of article**: a compact recap block.

Do not put a full block above the fold before any editorial content. It costs
CLS budget, it reads as an ad to both readers and quality raters, and it is a
recurring pattern in pages that lose traffic in core updates.
