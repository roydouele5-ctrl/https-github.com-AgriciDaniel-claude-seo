# Compliance and YMYL Guardrails

This is the gate layer. A block that fails here is not a slow-converting block,
it is a liability that reduces or destroys the sale value of the site.

Nothing here is legal advice. It is the operational checklist an acquirer's
diligence process and a platform policy review actually apply. For a specific
jurisdiction or a specific claim, the site owner needs a lawyer.

## 1. Link attribution

Google requires monetized links to be qualified. Unqualified affiliate links
are a link-spam policy issue for the *linking* site.

```html
<a href="https://brand.example/product" rel="sponsored noopener" target="_blank">
```

Rules:

- `rel="sponsored"` on every monetized outbound link. `rel="sponsored nofollow"`
  is also accepted; `nofollow` alone is tolerated but `sponsored` is the correct
  signal.
- Applies to redirector links too (`/go/`, `/out/`, `/recommends/`). The anchor
  needs the attribute; additionally the redirector path should be
  `Disallow`-ed in robots.txt or serve `noindex`.
- `noopener` on any `target="_blank"` link — security, not SEO, but it belongs
  in the same template line.
- Image links and button links count. Wrapping an affiliate URL in a `<button>`
  with a JS handler does not exempt it; it just hides it from your own audit.

## 2. Disclosure

**US (FTC 16 CFR Part 255)**: disclosure must be clear, conspicuous, and
*unavoidable* — placed so a reader encounters it before the endorsement, not
only in a footer or on a separate policy page.

**EU / France**: the Unfair Commercial Practices Directive plus the French
consumer code require commercial intent to be identifiable. DGCCRF enforcement
in France has focused on undisclosed commercial relationships, particularly in
health, wellness, and supplement promotion. The French *loi influenceurs*
(June 2023) tightened this further for anyone promoting products to a French
audience, with specific restrictions around health products.

Implementation requirements:

| Requirement | Concrete rule |
|-------------|---------------|
| Position | Above or beside the first affiliate element, in the same visual unit. Not footer-only. |
| Visibility | Same font family as body text, minimum 14px, at least AA contrast. No collapsed accordion. |
| Language | The reader's language, plain words. |
| Specificity | State that links are affiliate links **and** that the site earns a commission at no extra cost to the reader. |
| Persistence | Repeat before each major block in long articles. |

A usable French wording:

> **Divulgation d'affiliation** — Cet article contient des liens d'affiliation.
> Si vous achetez via ces liens, nous percevons une commission, sans coût
> supplémentaire pour vous. Cela n'influence pas notre classement : notre
> méthode de sélection est décrite plus bas.

English equivalent:

> **Affiliate disclosure** — This article contains affiliate links. If you buy
> through them we earn a commission at no extra cost to you. It does not change
> our ranking; our selection method is described below.

The second sentence is not decoration. "It does not change our ranking" is only
usable if there is a stated method — so it forces the "how we chose" section
that also happens to be the strongest E-E-A-T element on the page.

## 3. YMYL: health, fitness, wellness

Health content is Your Money or Your Life. Quality raters and the acquirer's
diligence both apply a higher bar, and product claims are separately regulated.

### Claims to never make about a supplement, device, or program

- treats, cures, prevents, or diagnoses any condition
- "clinically proven" without a specific, linked study of that product
- weight-loss amounts or timelines presented as typical
- anything implying replacement of medical care
- "doctor recommended" without a named, credentialed doctor

In the EU, health claims on foods and supplements are restricted to the
authorised list under Regulation (EC) 1924/2006 — a claim not on that list
cannot be made even if a study supports it. This is stricter than most
US-written affiliate templates assume, and copying a US competitor's copy for a
French audience is a direct route to a finding.

### Claims that are safe and still convert

Reframe the mechanism and the specification instead of the outcome:

| Do not write | Write instead |
|--------------|---------------|
| "Cures joint pain" | "Contains 1,500mg glucosamine per serving — the dose used in [study]" |
| "Lose 10kg in 30 days" | "Tracks intake so you can hold a deficit; results depend on adherence and individual factors" |
| "Boosts immunity" | "Provides 100% of the EU NRV for vitamin D" |
| "Clinically proven fat burner" | "Caffeine content: 200mg per serving, equivalent to two espressos" |

Specificity converts better than superlatives anyway. The compliant version is
usually the higher-performing version.

### Required page elements for YMYL affiliate content

- Named author with a stated credential or an explicit basis of experience
- Reviewer credit where a health professional reviewed the content
- Date published and date last updated, both visible
- A "how we chose" / methodology section
- Sources linked for every factual claim, ideally to primary sources
- A medical disclaimer near the disclosure:

> Ce contenu est informatif et ne remplace pas un avis médical. Consultez un
> professionnel de santé avant de commencer un complément ou un programme,
> en particulier en cas de traitement en cours, de grossesse ou de pathologie.

## 4. Ratings and testimonials

- Never emit `AggregateRating` for ratings the site did not collect. Google
  treats self-serving and fabricated review markup as a structured data policy
  violation, and manual actions on review snippets are common.
- Aggregate ratings sourced from a marketplace belong in visible text with the
  source named and linked, not in the site's own schema.
- The site's own editorial verdict belongs in `Review` with a named `author`.
  See `block-schema.md`.
- Testimonials must be real, attributed, and typical, or labelled as atypical.

## 5. Scarcity and urgency

Permitted: a real promotion with a real end date, real inventory read from a
feed, a genuinely limited cohort.

Not permitted, and a Critical finding when found: evergreen countdown timers,
timers that reset on reload, "only N left" without live inventory, invented
"price increases tomorrow".

Beyond the regulatory exposure, these are the elements a buyer's technical
diligence finds fastest, and they reprice a site downward because they signal
the traffic-to-revenue conversion is partly manufactured.

## 6. Program terms

Each affiliate program adds its own rules on top. The recurring ones:

- Amazon Associates: required disclosure wording, no price scraping or caching
  of prices outside the API, no email or PDF placement of links.
- Health and supplement programs frequently prohibit specific claim language in
  the affiliate's own copy — a breach can void commissions retroactively.

Record which programs the site uses; revenue concentration in one program is
also a valuation finding (see `conversion-benchmarks.md`).

## Audit output format

Report as a table, Critical first, each row: `check | evidence (selector or
quoted text) | severity | fix`. Compliance findings are always reported before
conversion findings even when the conversion finding is larger in revenue
terms, because compliance is the gate.
