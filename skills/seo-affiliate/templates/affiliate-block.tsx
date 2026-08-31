/**
 * AffiliateBlock — conversion-engineered, compliance-gated affiliate block.
 *
 * Part of claude-seo (`/seo affiliate generate`). MIT licensed.
 *
 * Drops into Lovable, Next.js (app or pages router), Astro islands, or plain
 * Vite + React. Dependencies: react + tailwindcss. No UI library, no icon
 * package, no client-side data fetching.
 *
 * Design contract — these are load-bearing, do not "simplify" them away:
 *
 *  1. Every outbound commercial link carries rel="sponsored noopener".
 *  2. The disclosure renders above the first card and is not optional.
 *  3. JSON-LD is generated from the same `products` array that renders the
 *     markup, so visible content and structured data cannot drift apart.
 *  4. Media boxes have reserved aspect ratios — the block contributes 0 CLS.
 *  5. One delegated click handler for the whole block, not one per card.
 *  6. The spec comparison is a real <table> so answer engines can extract it.
 *
 * See references/compliance-ymyl.md and references/block-schema.md.
 */

import { useCallback, useMemo } from "react";
import type { MouseEvent } from "react";

/* ------------------------------------------------------------------ types */

export interface ProductImage {
  src: string;
  alt: string;
  /** Intrinsic size. Required: this is what reserves layout space. */
  width: number;
  height: number;
}

export interface ProductProof {
  /** The strongest proof tier available. Never invent one. */
  claim: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface ProductPrice {
  amount: string;
  currency: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  /** e.g. "prix constaté le 31/08/2026" */
  note?: string;
}

export interface AffiliateProduct {
  id: string;
  /** 1 = top pick. Drives both display order and ItemList position. */
  rank: number;
  /** Segmentation badge: "Meilleur choix global", "Meilleur rapport qualité-prix". */
  badge: string;
  name: string;
  brand: string;
  image: ProductImage;
  /** Dream outcome, in the reader's words. Not a spec. */
  outcome: string;
  /** Who this is right for — lets the reader self-select. */
  bestFor: string;
  proof: ProductProof;
  /** Time-delay lever: delivery + realistic time to result. */
  timeframe: string;
  /** Effort lever: what it actually costs the reader in work or habit change. */
  effort: string;
  /** The vendor's real guarantee, quoted. Empty string if there is none. */
  riskReversal: string;
  /** One honest drawback. A card with no downside reads as an ad. */
  tradeOff: string;
  specs: Array<{ label: string; value: string }>;
  price?: ProductPrice;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface AffiliateBlockData {
  /** Stable id, used as the GA4 promotion_id. */
  id: string;
  heading: string;
  intro?: string;
  /** Required. Rendered above the first card. */
  disclosure: string;
  /** Required for YMYL (health, fitness, wellness, finance). */
  medicalDisclaimer?: string;
  /** Anchor to the "how we chose" section. Makes the disclosure claim honest. */
  methodologyHref?: string;
  /** ISO date, e.g. "2026-08-31". Rendered visibly and used in JSON-LD. */
  lastUpdated: string;
  author?: { name: string; credential: string; url?: string };
  /** Ordered spec labels for the comparison table columns. */
  specColumns: string[];
  products: AffiliateProduct[];
}

/* -------------------------------------------------------------- tracking */

type Gtag = (command: string, event: string, params: Record<string, unknown>) => void;

interface TrackingWindow extends Window {
  gtag?: Gtag;
  dataLayer?: Array<Record<string, unknown>>;
}

/**
 * GA4 `select_promotion`. Consent-mode compatible: gtag/dataLayer respect the
 * consent state you already configured. Never add personal data here.
 */
function trackAffiliateClick(
  blockId: string,
  productId: string,
  position: number,
  destination: string,
): void {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;
  const params = {
    promotion_id: blockId,
    creative_name: productId,
    creative_slot: String(position),
    link_url: destination,
  };
  if (typeof w.gtag === "function") {
    w.gtag("event", "select_promotion", params);
  } else if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: "select_promotion", ...params });
  }
}

/* ------------------------------------------------------------ structured data */

/** Escapes the sequences that could break out of a <script> element. */
function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * ItemList of Product, generated from the rendered data.
 *
 * Deliberately omitted: AggregateRating (the site did not collect those
 * ratings) and any Offer whose price the block does not display. An omitted
 * property is fine; a wrong one is a structured-data policy violation.
 */
function buildItemList(data: AffiliateBlockData) {
  const ordered = [...data.products].sort((a, b) => a.rank - b.rank);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: data.heading,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: ordered.length,
    itemListElement: ordered.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: p.name,
        brand: { "@type": "Brand", name: p.brand },
        image: p.image.src,
        description: p.outcome,
        ...(p.price
          ? {
              offers: {
                "@type": "Offer",
                price: p.price.amount,
                priceCurrency: p.price.currency,
                availability: `https://schema.org/${p.price.availability ?? "InStock"}`,
                url: p.cta.href,
              },
            }
          : {}),
      },
    })),
  };
}

/* ----------------------------------------------------------------- styles */

const CTA_BASE =
  "inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-emerald-600";

const CTA_PRIMARY = `${CTA_BASE} bg-emerald-700 text-white hover:bg-emerald-800`;
const CTA_SECONDARY =
  `${CTA_BASE} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;

/* -------------------------------------------------------------- component */

export default function AffiliateBlock({ data }: { data: AffiliateBlockData }) {
  const ordered = useMemo(
    () => [...data.products].sort((a, b) => a.rank - b.rank),
    [data.products],
  );
  const jsonLd = useMemo(() => safeJsonLd(buildItemList(data)), [data]);

  /**
   * One delegated handler for the whole block. Adding a listener per card is
   * the most common source of interaction latency in these components.
   */
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[data-affiliate-cta]",
      );
      if (!anchor) return;
      trackAffiliateClick(
        data.id,
        anchor.dataset.productId ?? "",
        Number(anchor.dataset.position ?? 0),
        anchor.href,
      );
    },
    [data.id],
  );

  const formattedDate = new Date(data.lastUpdated).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      aria-labelledby={`${data.id}-heading`}
      className="my-10 text-slate-800"
      onClick={handleClick}
    >
      <script
        type="application/ld+json"
        // Generated from the same data the markup renders — they cannot drift.
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <h2 id={`${data.id}-heading`} className="text-2xl font-bold tracking-tight sm:text-3xl">
        {data.heading}
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        Mis à jour le <time dateTime={data.lastUpdated}>{formattedDate}</time>
        {data.author ? (
          <>
            {" · Par "}
            {data.author.url ? (
              <a
                href={data.author.url}
                className="font-medium underline underline-offset-2 hover:text-slate-900"
              >
                {data.author.name}
              </a>
            ) : (
              <span className="font-medium">{data.author.name}</span>
            )}
            {`, ${data.author.credential}`}
          </>
        ) : null}
      </p>

      {data.intro ? <p className="mt-4 max-w-prose">{data.intro}</p> : null}

      {/* Disclosure: above the first card, body-sized, AA contrast. Not optional. */}
      <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-slate-800">
        <strong className="font-semibold">Divulgation d&apos;affiliation — </strong>
        {data.disclosure}
        {data.methodologyHref ? (
          <>
            {" "}
            <a
              href={data.methodologyHref}
              className="font-medium underline underline-offset-2 hover:text-slate-900"
            >
              Voir notre méthode de sélection
            </a>
            .
          </>
        ) : null}
      </div>

      {data.medicalDisclaimer ? (
        <p className="mt-3 rounded-lg bg-slate-100 p-4 text-sm leading-relaxed text-slate-700">
          {data.medicalDisclaimer}
        </p>
      ) : null}

      {/* Cards. <ol> because the ranking is the semantics. */}
      <ol className="mt-8 space-y-6" role="list">
        {ordered.map((product, index) => (
          <li key={product.id}>
            <ProductCard product={product} position={index + 1} priority={index === 0} />
          </li>
        ))}
      </ol>

      <ComparisonTable
        heading={data.heading}
        columns={data.specColumns}
        products={ordered}
      />
    </section>
  );
}

/* ------------------------------------------------------------------- card */

function ProductCard({
  product,
  position,
  priority,
}: {
  product: AffiliateProduct;
  position: number;
  priority: boolean;
}) {
  const isTopPick = position === 1;

  /**
   * React 18 does not recognize the camelCase `fetchPriority` prop and drops it
   * from the DOM without erroring; React 19 does recognize it. Emitting the
   * lowercase HTML attribute via a spread produces the right markup on both.
   */
  const priorityAttrs: Record<string, string> = priority
    ? { fetchpriority: "high" }
    : {};

  return (
    <article
      className={[
        "relative rounded-xl border bg-white p-5 shadow-sm sm:p-6",
        isTopPick ? "border-emerald-600 ring-1 ring-emerald-600" : "border-slate-200",
      ].join(" ")}
    >
      <p
        className={[
          "inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
          isTopPick ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-800",
        ].join(" ")}
      >
        {`#${position} · ${product.badge}`}
      </p>

      <div className="mt-4 gap-6 sm:flex">
        {/* Reserved aspect ratio + intrinsic width/height = no layout shift. */}
        <div
          className="mx-auto w-full max-w-[220px] shrink-0 overflow-hidden rounded-lg bg-slate-50"
          style={{ aspectRatio: `${product.image.width} / ${product.image.height}` }}
        >
          <img
            src={product.image.src}
            alt={product.image.alt}
            width={product.image.width}
            height={product.image.height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-contain"
            {...priorityAttrs}
          />
        </div>

        <div className="mt-4 min-w-0 flex-1 sm:mt-0">
          <h3 className="text-lg font-bold leading-snug">
            {product.name}
            <span className="ml-2 text-sm font-normal text-slate-500">{product.brand}</span>
          </h3>

          {/* Value lever 1 — dream outcome. */}
          <p className="mt-2 text-base font-medium text-slate-900">{product.outcome}</p>

          <p className="mt-2 text-sm text-slate-700">
            <span className="font-semibold">Pour qui : </span>
            {product.bestFor}
          </p>

          {/* Value lever 2 — perceived likelihood. Sourced, or it does not ship. */}
          <p className="mt-2 text-sm text-slate-700">
            <span className="font-semibold">Preuve : </span>
            {product.proof.claim}
            {product.proof.sourceUrl && product.proof.sourceLabel ? (
              <>
                {" ("}
                <a
                  href={product.proof.sourceUrl}
                  rel="noopener nofollow"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  {product.proof.sourceLabel}
                </a>
                {")"}
              </>
            ) : null}
          </p>

          {/* Value levers 3 and 4 — the denominator. Competitors omit these. */}
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Délai
              </dt>
              <dd className="mt-1 text-sm">{product.timeframe}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Effort
              </dt>
              <dd className="mt-1 text-sm">{product.effort}</dd>
            </div>
          </dl>

          {product.specs.length > 0 ? (
            <ul className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
              {product.specs.map((spec) => (
                <li key={spec.label} className="text-slate-700">
                  <span className="font-medium">{spec.label} :</span> {spec.value}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">À savoir : </span>
            {product.tradeOff}
          </p>

          {product.riskReversal ? (
            <p className="mt-2 text-sm font-medium text-emerald-800">{product.riskReversal}</p>
          ) : null}

          {product.price ? (
            <p className="mt-4 text-sm text-slate-700">
              <span className="text-xl font-bold text-slate-900">
                {product.price.amount} {product.price.currency}
              </span>
              {product.price.note ? (
                <span className="ml-2 text-xs text-slate-500">{product.price.note}</span>
              ) : null}
            </p>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href={product.cta.href}
              // Attribution is hardcoded, never passed in as a prop.
              rel="sponsored noopener"
              target="_blank"
              data-affiliate-cta=""
              data-product-id={product.id}
              data-position={position}
              className={CTA_PRIMARY}
              aria-label={`${product.cta.label} — ${product.name}`}
            >
              {product.cta.label}
            </a>
            {product.secondaryCta ? (
              <a
                href={product.secondaryCta.href}
                className={CTA_SECONDARY}
                aria-label={`${product.secondaryCta.label} — ${product.name}`}
              >
                {product.secondaryCta.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ table */

/**
 * A real <table>. Table semantics are what makes a comparison extractable by
 * answer engines — a CSS grid of <div>s is not.
 */
function ComparisonTable({
  heading,
  columns,
  products,
}: {
  heading: string;
  columns: string[];
  products: AffiliateProduct[];
}) {
  if (products.length < 2 || columns.length === 0) return null;

  const specValue = (product: AffiliateProduct, label: string) =>
    product.specs.find((s) => s.label === label)?.value ?? "—";

  return (
    <div className="mt-10 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="pb-3 text-left text-base font-semibold text-slate-900">
          {`${heading} — comparatif`}
        </caption>
        <thead>
          <tr className="border-b-2 border-slate-300 text-left">
            <th scope="col" className="py-3 pr-4 font-semibold">
              Produit
            </th>
            {columns.map((column) => (
              <th key={column} scope="col" className="py-3 pr-4 font-semibold">
                {column}
              </th>
            ))}
            <th scope="col" className="py-3 font-semibold">
              <span className="sr-only">Lien</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id} className="border-b border-slate-200 align-top">
              <th scope="row" className="py-3 pr-4 text-left font-semibold">
                {product.name}
                <span className="block text-xs font-normal text-slate-500">
                  {product.badge}
                </span>
              </th>
              {columns.map((column) => (
                <td key={column} className="py-3 pr-4 text-slate-700">
                  {specValue(product, column)}
                </td>
              ))}
              <td className="py-3">
                <a
                  href={product.cta.href}
                  rel="sponsored noopener"
                  target="_blank"
                  data-affiliate-cta=""
                  data-product-id={product.id}
                  data-position={index + 1}
                  className="font-semibold text-emerald-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  aria-label={`Voir le prix — ${product.name}`}
                >
                  Voir le prix
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------------------------------------- example payload */

/**
 * Replace with real data. Every field below is a slot the audit checks:
 * unsourced proof, missing timeframe, or absent trade-off are findings.
 *
 * Note the claim language — specification and mechanism, never "treats",
 * "cures", or a promised result. See references/compliance-ymyl.md.
 */
export const exampleBlockData: AffiliateBlockData = {
  id: "proteines-debutant-2026",
  heading: "Les meilleures protéines en poudre pour débuter (testées en 2026)",
  intro:
    "Nous avons testé onze références pendant huit semaines sur la dissolution à froid, le goût et la composition. Voici les deux qui restent dans notre placard.",
  disclosure:
    "Cet article contient des liens d'affiliation. Si vous achetez via ces liens, nous percevons une commission, sans coût supplémentaire pour vous. Cela ne change pas notre classement.",
  medicalDisclaimer:
    "Ce contenu est informatif et ne remplace pas un avis médical. Consultez un professionnel de santé avant de commencer un complément, en particulier en cas de traitement en cours, de grossesse ou de pathologie.",
  methodologyHref: "#methode",
  lastUpdated: "2026-08-31",
  author: {
    name: "Camille Roux",
    credential: "diététicienne-nutritionniste (DE)",
    url: "/auteurs/camille-roux",
  },
  specColumns: ["Protéines par dose", "Prix au kilo", "Certification"],
  products: [
    {
      id: "marque-a-isolat",
      rank: 1,
      badge: "Meilleur choix global",
      name: "Isolat de whey nature",
      brand: "Marque A",
      image: {
        src: "/img/marque-a-isolat.webp",
        alt: "Pot d'isolat de whey nature Marque A, 1 kg",
        width: 600,
        height: 600,
      },
      outcome:
        "30 g de protéines dans un shaker qui se dissout à froid, sans grumeaux ni mixeur.",
      bestFor:
        "Vous débutez, vous vous entraînez 3 à 4 fois par semaine et vous préparez votre shaker au bureau.",
      proof: {
        claim: "Certifié Informed Sport, analyse par lot publiée par le fabricant",
        sourceLabel: "registre Informed Sport",
        sourceUrl: "https://sport.wetestyoutrust.com/",
      },
      timeframe: "Livraison en 48 h · un pot d'1 kg couvre environ 4 semaines",
      effort: "Une dose au shaker, dissolution testée à 20 s en eau froide",
      riskReversal: "Remboursement sous 30 jours annoncé par la marque, pot ouvert accepté",
      tradeOff:
        "Le goût nature est peu sucré : si vous venez d'une whey aromatisée, l'adaptation prend quelques jours.",
      specs: [
        { label: "Protéines par dose", value: "30 g pour 32 g" },
        { label: "Prix au kilo", value: "39,90 €" },
        { label: "Certification", value: "Informed Sport" },
      ],
      price: {
        amount: "39.90",
        currency: "EUR",
        availability: "InStock",
        note: "prix constaté le 31/08/2026",
      },
      cta: { label: "Voir le prix actuel chez Marque A", href: "/go/marque-a-isolat" },
      secondaryCta: { label: "Lire notre test complet", href: "/tests/marque-a-isolat" },
    },
    {
      id: "marque-b-concentre",
      rank: 2,
      badge: "Meilleur rapport qualité-prix",
      name: "Concentré de whey vanille",
      brand: "Marque B",
      image: {
        src: "/img/marque-b-concentre.webp",
        alt: "Sachet de concentré de whey vanille Marque B, 2 kg",
        width: 600,
        height: 600,
      },
      outcome:
        "Le coût par dose le plus bas du comparatif, pour tenir un apport quotidien sur la durée.",
      bestFor:
        "Votre budget est la contrainte principale et vous digérez bien le lactose.",
      proof: {
        claim: "4,4/5 sur 12 400 achats vérifiés sur la boutique de la marque",
        sourceLabel: "page produit",
        sourceUrl: "https://example.com/marque-b",
      },
      timeframe: "Livraison en 72 h · un sachet de 2 kg couvre environ 10 semaines",
      effort: "Une dose au shaker, prévoir 30 s d'agitation : la dissolution est plus lente",
      riskReversal: "Retour sous 14 jours si le sachet n'est pas ouvert",
      tradeOff:
        "C'est un concentré, pas un isolat : 4 g de lactose par dose, à éviter si vous y êtes sensible.",
      specs: [
        { label: "Protéines par dose", value: "24 g pour 30 g" },
        { label: "Prix au kilo", value: "22,50 €" },
        { label: "Certification", value: "Aucune certification tierce" },
      ],
      price: {
        amount: "45.00",
        currency: "EUR",
        availability: "InStock",
        note: "sachet de 2 kg, prix constaté le 31/08/2026",
      },
      cta: { label: "Voir le prix actuel chez Marque B", href: "/go/marque-b-concentre" },
    },
  ],
};
