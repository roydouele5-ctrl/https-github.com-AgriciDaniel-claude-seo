# Lovable Build Prompts

Two paths. Path A is deterministic; Path B regenerates the component and is
worth it only when you want it restyled to an existing design system.

## Path A — paste the template

`templates/affiliate-block.tsx` is already a valid Lovable component: React +
TypeScript + Tailwind, no external UI dependency.

1. Create `src/components/AffiliateBlock.tsx`, paste the file.
2. Create `src/data/blocks/<slug>.ts` exporting an `AffiliateBlockData` object.
3. Render `<AffiliateBlock data={blockData} />`.

## Path B — generate from prompts

Three prompts, sent in order. Splitting them matters: a single long prompt
loses its trailing constraints, and prompt 2 exists because Lovable reliably
drops constraints 1, 3 and 5 from prompt 1.

Adapt the language and niche of the copy to the target site. The version below
is written for a French-language health and fitness blog whose block will later
be exported to WordPress.

### Prompt 1 — build

> Crée un composant de bloc d'affiliation pour un blog santé/fitness
> francophone. Crée exactement deux fichiers :
> `src/components/AffiliateBlock.tsx` (le composant) et
> `src/data/blocks/proteines-debutant.ts` (les données).
>
> **Contraintes non négociables. Ne les modifie pas, ne les omets pas, ne les
> "simplifie" pas :**
>
> 1. Chaque lien produit sortant porte `rel="sponsored noopener"` et
>    `target="_blank"`. La valeur de `rel` est écrite en dur dans le JSX,
>    jamais reçue en prop.
> 2. Un encadré de divulgation d'affiliation est rendu **avant** la première
>    carte produit. Ni conditionnel, ni repliable, ni relégué en pied de page.
>    Texte de taille normale (14px minimum), contraste WCAG AA.
> 3. Un `<script type="application/ld+json">` contenant un `ItemList`, généré à
>    partir du **même** tableau de produits qui rend les cartes. Échappe `<`,
>    `>` et `&` dans le JSON sérialisé en `\u003c`, `\u003e`, `\u0026`.
> 4. N'émets **jamais** `AggregateRating`, `FAQPage` ni `HowTo`. N'inclus un
>    `Offer` que si le composant affiche réellement ce prix à l'écran.
> 5. Chaque `<img>` a des attributs `width` et `height` explicites et vit dans
>    un conteneur à `aspect-ratio` fixe : le bloc doit contribuer zéro CLS.
>    Première image `loading="eager"`, les suivantes `loading="lazy"`.
> 6. **Un seul** gestionnaire de clic délégué, posé sur la `<section>` racine,
>    qui résout l'ancre via `closest("a[data-affiliate-cta]")`. Pas de
>    gestionnaire par carte.
> 7. Le comparatif est un vrai `<table>` avec `<caption>`, `scope="col"` sur
>    les en-têtes de colonnes et `scope="row"` sur la cellule du nom produit.
>    Pas une grille de `<div>`.
> 8. **Aucun composant shadcn/ui, aucune librairie d'icônes, aucune dépendance
>    externe.** Uniquement React, TypeScript et des classes Tailwind. Ce bloc
>    sera exporté en HTML statique plus tard.
>
> **Modèle de données.** Définis et exporte ces types, puis pilote tout le
> rendu à partir d'eux :
>
> ```ts
> interface AffiliateProduct {
>   id: string; rank: number; badge: string; name: string; brand: string;
>   image: { src: string; alt: string; width: number; height: number };
>   outcome: string; bestFor: string;
>   proof: { claim: string; sourceLabel?: string; sourceUrl?: string };
>   timeframe: string; effort: string; riskReversal: string; tradeOff: string;
>   specs: Array<{ label: string; value: string }>;
>   price?: { amount: string; currency: string; availability?: string; note?: string };
>   cta: { label: string; href: string };
>   secondaryCta?: { label: string; href: string };
> }
>
> interface AffiliateBlockData {
>   id: string; heading: string; intro?: string;
>   disclosure: string; medicalDisclaimer?: string; methodologyHref?: string;
>   lastUpdated: string;
>   author?: { name: string; credential: string; url?: string };
>   specColumns: string[];
>   products: AffiliateProduct[];
> }
> ```
>
> **Structure d'une carte**, dans cet ordre : badge de rang (`#1 · {badge}`),
> image, nom du produit avec la marque, `outcome` en ligne d'accroche,
> `bestFor` préfixé « Pour qui : », `proof` avec sa source liée en
> `rel="noopener nofollow"`, puis une liste de définitions à deux cellules —
> `timeframe` sous le libellé « Délai » et `effort` sous « Effort » — puis les
> `specs`, puis `tradeOff` préfixé « À savoir : », puis `riskReversal`, puis le
> prix, puis les CTA.
>
> Les cellules « Délai » et « Effort » comptent plus qu'elles n'en ont l'air :
> ce sont les deux champs que les blocs concurrents omettent entièrement.
> Donne-leur le même poids visuel que les specs.
>
> **Suivi.** Au clic sur un lien d'affiliation, envoie l'événement GA4
> `select_promotion` avec `promotion_id` = id du bloc, `creative_name` = id du
> produit, `creative_slot` = position. Utilise `window.gtag` s'il existe, sinon
> `window.dataLayer`. Protège le rendu serveur avec
> `typeof window === "undefined"`. Aucune donnée personnelle en paramètre.
>
> **Accessibilité.** Cartes dans un `<ol role="list">`, anneaux de focus
> visibles sur chaque élément interactif, `aria-label` sur chaque CTA incluant
> le nom du produit, `<time dateTime>` pour la date de mise à jour.
>
> **Langue de l'interface et des contenus : français.**
>
> **Règles de contenu pour les données d'exemple que tu génères.** N'écris
> jamais qu'un produit traite, guérit, prévient ou diagnostique quoi que ce
> soit. Ne promets ni perte de poids ni résultat dans un délai donné. Donne
> plutôt des doses, des certifications et des mécanismes. N'invente aucune
> note, aucun avis, aucun nombre d'avis, aucun logo « vu dans ». N'ajoute aucun
> compte à rebours, aucun minuteur, aucun compteur de stock. Donne à chaque
> produit un vrai inconvénient dans `tradeOff`.

### Prompt 2 — verification pass

Send immediately after prompt 1, before looking at the result.

> Vérifie le composant que tu viens de créer, point par point, et corrige
> uniquement ce qui manque sans réécrire le reste :
>
> 1. Compte les liens d'affiliation et compte les `rel="sponsored noopener"`.
>    Les deux nombres sont-ils égaux, y compris dans le tableau comparatif ?
> 2. L'encadré de divulgation est-il rendu avant la première carte dans le DOM,
>    et non conditionnel ?
> 3. Le `<script type="application/ld+json">` est-il bien présent, et les `<`,
>    `>`, `&` échappés en `\u003c`, `\u003e`, `\u0026` ?
> 4. Chaque valeur du JSON-LD est-elle affichée à l'écran ? Supprime toute
>    propriété du schéma qui n'apparaît pas visuellement.
> 5. Chaque `<img>` a-t-elle `width` et `height` ?
> 6. Y a-t-il exactement un gestionnaire de clic pour tout le bloc ?
> 7. As-tu introduit un composant shadcn/ui ou une librairie d'icônes ?
>    Si oui, remplace-le par du JSX et des classes Tailwind.
>
> Réponds en listant chaque point avec ce que tu as trouvé, puis applique les
> corrections.

### Prompt 3 — reuse for a new article

> Crée `src/data/blocks/<slug>.ts` exportant un `AffiliateBlockData` pour
> l'article « <titre> ». Ne modifie pas `AffiliateBlock.tsx`. Applique les
> mêmes règles de contenu : pas d'allégation de santé, pas de note inventée,
> pas de fausse urgence, un vrai inconvénient par produit, et les champs
> `timeframe` et `effort` remplis pour chaque produit.

## Verify it yourself

Lovable will report success on constraints it did not meet. Check these by
hand, in the served page source rather than the devtools DOM inspector:

| Check | How |
|-------|-----|
| `rel="sponsored"` on every affiliate anchor | View source, search `sponsored`, count against the number of CTAs |
| Disclosure above the first card | Visual check at 375px width |
| JSON-LD present in the served HTML | View source |
| No `AggregateRating` | Search the JSON-LD |
| Images carry width and height | Search `width=` in the card markup |
| No injected countdown or stock counter | Read the rendered copy |
| Zero CLS | Lighthouse, or `/seo page <url>` |
| Full audit | `/seo affiliate audit <url>` |

## Exporting to WordPress

Do not port the React runtime. Build and tune the block in Lovable, then move
the finished markup with `templates/affiliate-block.html`: the same block with
no framework, one scoped `<style>`, one delegated-listener script, the same
JSON-LD. Constraint 8 in prompt 1 is what keeps this step mechanical.

Two placement options:

- **Reusable (synced) block** — paste into a Custom HTML block, save as a
  synced pattern, insert per article. Edits propagate.
- **Shortcode** — move the HTML into a PHP template partial and register a
  shortcode, so per-article product data comes from arguments or a CPT.

The template's CSS is namespaced under `.cseo-affiliate` and will not collide
with theme styles. Move it into the theme stylesheet once, then strip it from
subsequent block instances so it is not duplicated per article.
