// Páginas da calculadora para SEO/GEO: uma URL por busca, cada uma com título, descrição, texto e dados estruturados
// próprios no HTML (o Google e as IAs leem sem depender do JavaScript). A fonte é calculadora/index.html; rode
// `node calculadora/gerar-paginas.mjs` depois de mudar a calculadora para atualizar as outras páginas.
export const SITE = "https://guttoecom.com.br";
export const ATUALIZADO = "2026-10-17";
export const ATUALIZADO_TXT = "outubro de 2026";

const autor = { "@type": "Person", name: "Léo Gutemberg", jobTitle: "Fundador da gutto, especialista em marketplaces", worksFor: { "@type": "Organization", name: "gutto", url: SITE } };

export const PAGINAS = {
  "shopee-preco": {
    arquivo: "calculadora/index.html",
    url: `${SITE}/calculadora`,
    caminho: "/calculadora",
    plat: "shopee",
    modo: "preco",
    titulo: "Calculadora Shopee 2026: preço ideal com taxas e margem | gutto.",
    descricao: "Calculadora de preço da Shopee grátis: coloque o custo e a margem que você quer e veja o preço certo com comissão de 20% ou 14%, taxa fixa, imposto, Ads e afiliado. Sem cadastro.",
    og: "/og/calculadora-shopee.png",
    nomeApp: "Calculadora de preço Shopee",
    verbo: "Quanto cobrar",
    nomePlat: "Shopee",
    sub: "Coloque seus custos e a margem que você quer. A calculadora acha o preço na faixa certa da Shopee, com comissão, taxa fixa, imposto, Ads e afiliado.",
    migalha: [["Calculadora", "/calculadora"]],
  },
  "shopee-reversa": {
    arquivo: "calculadora/shopee/quanto-sobra/index.html",
    url: `${SITE}/calculadora/shopee/quanto-sobra`,
    caminho: "/calculadora/shopee/quanto-sobra",
    plat: "shopee",
    modo: "reversa",
    titulo: "Quanto a Shopee desconta? Calculadora de lucro por venda 2026 | gutto.",
    descricao: "Coloque o preço que você vende na Shopee e veja quanto a Shopee desconta (comissão e taxa fixa), quanto cai na sua conta e o lucro real de cada venda. Grátis, sem cadastro.",
    og: "/og/calculadora-shopee-quanto-sobra.png",
    nomeApp: "Calculadora de lucro Shopee (quanto sobra)",
    verbo: "Quanto sobra",
    nomePlat: "Shopee",
    sub: "Coloque o preço que você pratica e veja o que a Shopee desconta, quanto cai na conta e o lucro que fica. Também mostra o preço mínimo para bater a sua meta.",
    migalha: [["Calculadora", "/calculadora"], ["Shopee: quanto sobra", "/calculadora/shopee/quanto-sobra"]],
  },
  tiktok: {
    arquivo: "calculadora/tiktok-shop/index.html",
    url: `${SITE}/calculadora/tiktok-shop`,
    caminho: "/calculadora/tiktok-shop",
    plat: "tiktok",
    modo: "preco",
    titulo: "Calculadora TikTok Shop 2026: preço, taxas e lucro | gutto.",
    descricao: "Calculadora de preço do TikTok Shop grátis: comissão, taxa do frete grátis, taxa fixa, imposto e afiliado. Veja o preço que fecha a sua margem e compare preços. Sem cadastro.",
    og: "/og/calculadora-tiktok-shop.png",
    nomeApp: "Calculadora de preço TikTok Shop",
    verbo: "Quanto cobrar",
    nomePlat: "TikTok Shop",
    sub: "Coloque seus custos e a margem que você quer. A calculadora acha o preço com comissão, taxa de envio do frete grátis, taxa fixa, imposto e afiliado do TikTok Shop.",
    migalha: [["Calculadora", "/calculadora"], ["TikTok Shop", "/calculadora/tiktok-shop"]],
  },
};

const TABELA_SHOPEE = `
      <table>
        <thead><tr><th>Preço do produto</th><th>Comissão</th><th>Taxa fixa por item</th></tr></thead>
        <tbody>
          <tr><td>Até R$ 79,99</td><td>20%</td><td>R$ 4,50</td></tr>
          <tr><td>R$ 80 a R$ 99,99</td><td>14%</td><td>R$ 16</td></tr>
          <tr><td>R$ 100 a R$ 199,99</td><td>14%</td><td>R$ 20</td></tr>
          <tr><td>A partir de R$ 200</td><td>14%</td><td>R$ 26</td></tr>
        </tbody>
      </table>`;
const TABELA_TIKTOK = `
      <table>
        <thead><tr><th>Preço do produto</th><th>Comissão</th><th>Taxa do frete grátis</th><th>Taxa fixa</th></tr></thead>
        <tbody>
          <tr><td>Abaixo de R$ 50</td><td>10%</td><td>6%</td><td>R$ 4</td></tr>
          <tr><td>R$ 50 ou mais</td><td>6%</td><td>6%</td><td>R$ 6</td></tr>
        </tbody>
      </table>`;
const ASSINATURA = `
      <p class="seo-autor">Feita por <b>Léo Gutemberg, pela gutto</b>, assessoria de marketplaces para confecções. As contas são as mesmas das planilhas que usamos com nossos clientes, de quem já vendeu mais de R$ 10 milhões em marketplaces. Taxas conferidas em <time datetime="${ATUALIZADO}">${ATUALIZADO_TXT}</time>.</p>`;
const LINKS = (atual) =>
  `<p class="seo-links">Outras calculadoras: ${Object.entries(PAGINAS)
    .filter(([id]) => id !== atual)
    .map(([, p]) => `<a href="${p.caminho}">${p.nomeApp}</a>`)
    .join(" · ")}</p>`;

export const CONTEUDO = {
  "shopee-preco": `
    <section class="seo" aria-labelledby="seo-tit">
      <h2 id="seo-tit">Como calcular o preço de venda na Shopee</h2>
      <p>Na Shopee, produtos até <b>R$ 79,99</b> pagam <b>20% de comissão + R$ 4,50 por item</b>. A partir de R$ 80 a comissão cai para <b>14%</b>, e a taxa fixa sobe para R$ 16, R$ 20 ou R$ 26, conforme a faixa de preço. Por isso o preço certo depende da faixa: a calculadora testa cada faixa e escolhe a que fecha a sua margem.</p>
      <p>A conta é: <b>preço = (custos + taxa fixa) ÷ (1 − comissão − imposto − Ads − afiliado − margem desejada)</b>. Ads entra como 1 ÷ ROAS (ROAS 10 = 10% do preço).</p>
      <h3>Taxas da Shopee usadas na calculadora (${ATUALIZADO_TXT})</h3>${TABELA_SHOPEE}${ASSINATURA}
      ${LINKS("shopee-preco")}
    </section>`,
  "shopee-reversa": `
    <section class="seo" aria-labelledby="seo-tit">
      <h2 id="seo-tit">Quanto a Shopee desconta de cada venda</h2>
      <p>De cada venda a Shopee desconta a <b>comissão</b> (20% até R$ 79,99 ou 14% a partir de R$ 80) e uma <b>taxa fixa por item</b> (de R$ 4,50 a R$ 26). Depois saem o imposto, a embalagem e o custo do produto: o que sobra é o seu lucro.</p>
      <p>Exemplo: um produto vendido a <b>R$ 59,90</b> paga 20% (R$ 11,98) + R$ 4,50 de taxa fixa: caem <b>R$ 43,42</b> na conta antes do imposto e dos seus custos.</p>
      <h3>Taxas da Shopee usadas na calculadora (${ATUALIZADO_TXT})</h3>${TABELA_SHOPEE}${ASSINATURA}
      ${LINKS("shopee-reversa")}
    </section>`,
  tiktok: `
    <section class="seo" aria-labelledby="seo-tit">
      <h2 id="seo-tit">Taxas do TikTok Shop e como calcular o preço</h2>
      <p>No TikTok Shop, produtos <b>abaixo de R$ 50</b> pagam <b>10% de comissão + R$ 4</b> de taxa fixa; a partir de <b>R$ 50</b>, <b>6% + R$ 6</b>. Se você oferece frete grátis, entra mais <b>6%</b> de taxa de envio. Afiliado e imposto também saem do preço.</p>
      <p>A conta é: <b>preço = (custos + taxa fixa) ÷ (1 − comissão − envio − imposto − afiliado − margem desejada)</b>. Se o resultado passar de R$ 50, a calculadora refaz a conta com as taxas da faixa de cima.</p>
      <h3>Taxas do TikTok Shop usadas na calculadora (${ATUALIZADO_TXT})</h3>${TABELA_TIKTOK}${ASSINATURA}
      ${LINKS("tiktok")}
    </section>`,
};

/** Bloco do <head>: título, descrição, canonical, Open Graph e dados estruturados. */
export function cabecalho(id) {
  const p = PAGINAS[id];
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: p.nomeApp,
        url: p.url,
        description: p.descricao,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: "pt-BR",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
        dateModified: ATUALIZADO,
        author: autor,
        publisher: { "@type": "Organization", name: "gutto", url: SITE, logo: `${SITE}/og/gutto-logo.png` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [["gutto", "/"], ...p.migalha].map(([nome, c], i) => ({ "@type": "ListItem", position: i + 1, name: nome, item: `${SITE}${c === "/" ? "" : c}` })),
      },
    ],
  };
  return `<!-- SEO:INICIO (gerado por calculadora/gerar-paginas.mjs) -->
<title>${p.titulo}</title>
<meta name="description" content="${p.descricao}">
<link rel="canonical" href="${p.url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="gutto.">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${p.url}">
<meta property="og:title" content="${p.titulo}">
<meta property="og:description" content="${p.descricao}">
<meta property="og:image" content="${SITE}${p.og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}${p.og}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>window.CALC_PAGINA = ${JSON.stringify({ plat: p.plat, modo: p.modo })};</script>
<!-- SEO:FIM -->`;
}
