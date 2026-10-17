// Páginas da calculadora para SEO/GEO: uma URL por busca, cada uma com título, descrição, texto, perguntas frequentes e
// dados estruturados próprios no HTML (o Google e as IAs leem sem depender do JavaScript). A fonte é calculadora/index.html;
// rode `node calculadora/gerar-paginas.mjs` depois de mudar a calculadora ou os textos daqui para atualizar as páginas.
// Os números dos exemplos saem do próprio calc.js: mudou taxa lá, os textos acompanham.
import { createRequire } from "node:module";

const Calc = createRequire(import.meta.url)("./calc.js");

export const SITE = "https://guttoecom.com.br";
export const ATUALIZADO = "2026-10-17";
export const ATUALIZADO_TXT = "outubro de 2026";

const autor = { "@type": "Person", name: "Léo Gutemberg", jobTitle: "Fundador da gutto, especialista em marketplaces", worksFor: { "@type": "Organization", name: "gutto", url: SITE } };
const editora = { "@type": "Organization", name: "gutto", url: SITE, logo: `${SITE}/og/gutto-logo.png` };

/* ------------------------------------------------------------------ contas (do calc.js) */
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/ /g, " ");
const pct = (v) => `${(v * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
/** Quanto a Shopee desconta de uma venda de 1 item, sem imposto e custos. */
const shopee = (preco) => {
  const r = Calc.shopeeReversa({ preco, qtd: 1 });
  return { preco, comissaoPct: r.comissaoPct, comissao: r.comissao, taxaFixa: r.taxaFixa, taxas: r.comissao + r.taxaFixa, cai: r.liquido };
};
/** Menor preço (em centavos) acima do limite da faixa que deixa na conta o mesmo que o último preço da faixa de baixo. */
const empate = (ultimo, primeiro) => {
  const alvo = shopee(ultimo).cai;
  let c = Math.round(primeiro * 100);
  while (shopee(c / 100).cai < alvo) c++;
  return c / 100;
};
const tiktok = (preco, freteGratis = true) => {
  const r = Calc.tiktokComparar([preco], { custo: 0, freteGratis })[0];
  const taxas = r.comissao + r.envio + r.taxaFixa;
  return { preco, comissao: r.comissao, envio: r.envio, taxaFixa: r.taxaFixa, taxas, cai: preco - taxas };
};

const S799 = shopee(79.9), S80 = shopee(80), S499 = shopee(49.9), S599 = shopee(59.9);
const EMP80 = empate(79.99, 80), EMP100 = empate(99.99, 100), EMP200 = empate(199.99, 200);
const T499 = tiktok(49.9), T50 = tiktok(50), T599 = tiktok(59.9);

/* ------------------------------------------------------------------ páginas */
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

/** Página de conteúdo (sem calculadora): as taxas da Shopee explicadas, com links para as calculadoras. */
export const TAXAS = {
  arquivo: "calculadora/shopee/taxas/index.html",
  url: `${SITE}/calculadora/shopee/taxas`,
  caminho: "/calculadora/shopee/taxas",
  titulo: "Taxas da Shopee 2026: comissão, taxa fixa e quanto sobra por venda | gutto.",
  descricao: `Taxas da Shopee em 2026: 20% de comissão + R$ 4,50 por item até R$ 79,99 e 14% + R$ 16 a R$ 26 a partir de R$ 80. Veja quanto a Shopee desconta em cada preço e as faixas que fazem você receber menos.`,
  og: "/og/calculadora-shopee-quanto-sobra.png",
  migalha: [["Calculadora", "/calculadora"], ["Taxas da Shopee", "/calculadora/shopee/taxas"]],
};

/* ------------------------------------------------------------------ textos */
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
const TODOS_LINKS = [...Object.values(PAGINAS).map((p) => [p.caminho, p.nomeApp]), [TAXAS.caminho, "Taxas da Shopee 2026"]];
const LINKS = (atual) =>
  `<p class="seo-links">Veja também: ${TODOS_LINKS.filter(([c]) => c !== atual)
    .map(([c, nome]) => `<a href="${c}">${nome}</a>`)
    .join(" · ")}</p>`;

/* perguntas frequentes: [pergunta, resposta em HTML]. A resposta vai igual (sem tags) para os dados estruturados. */
const P = {
  taxaFixaPorItem: [
    "A taxa fixa da Shopee é por item ou por pedido?",
    `Por item. Num pedido com 3 unidades de um produto de R$ 59,90, a taxa fixa de R$ 4,50 entra 3 vezes (R$ 13,50). Em produto barato ela pesa muito: em R$ 29,90 os R$ 4,50 são ${pct(4.5 / 29.9)} do preço, além dos 20% de comissão. Por isso kits costumam dar mais margem que peças avulsas.`,
  ],
  armadilha80: [
    "Vale a pena vender por R$ 80 em vez de R$ 79,90 na Shopee?",
    `Não. A R$ 79,90 a Shopee desconta 20% + R$ 4,50 e caem <b>${brl(S799.cai)}</b> na sua conta. A R$ 80 a comissão cai para 14%, mas a taxa fixa sobe para R$ 16: caem só <b>${brl(S80.cai)}</b>. Você só volta a receber mais que a R$ 79,99 a partir de <b>${brl(EMP80)}</b>. O mesmo acontece logo acima de R$ 100 (empata em ${brl(EMP100)}) e de R$ 200 (empata em ${brl(EMP200)}).`,
  ],
  imposto: [
    "Que imposto eu coloco na calculadora?",
    "O percentual que você paga sobre o faturamento. No Simples Nacional, divida o DAS do mês pelo faturamento do mês: R$ 600 de DAS em R$ 10.000 vendidos = 6%. No MEI o DAS é um valor fixo por mês, então coloque 0 e lembre de tirar esse valor do lucro do mês. Se tiver dúvida, use o número que o seu contador passar.",
  ],
  ads: [
    "Como entra o Shopee Ads na conta?",
    "Pelo ROAS (quanto você vende para cada R$ 1 de anúncio). O gasto com Ads vira um percentual do preço: 1 ÷ ROAS. ROAS 10 = 10% do preço; ROAS 5 = 20%. Coloque o ROAS médio da sua loja; se não anuncia, deixe vazio.",
  ],
  afiliado: [
    "E a comissão de afiliado?",
    "Se você participa do programa de afiliados, coloque a comissão que oferece. A calculadora considera que a venda veio de afiliado, que é o pior caso: se o preço fecha assim, fecha também nas vendas sem afiliado.",
  ],
  margemBoa: [
    "Qual margem é boa na Shopee?",
    "Na calculadora, margem abaixo de 10% aparece como apertada e a partir de 20% como boa. Margem aqui é o lucro depois de todas as taxas, do imposto e do custo do produto, sobre o preço de venda. Com margem apertada, qualquer devolução ou aumento de custo vira prejuízo.",
  ],
  quantoDesconta: [
    "Quanto a Shopee desconta de uma venda de R$ 49,90?",
    `20% de comissão (${brl(S499.comissao)}) + R$ 4,50 de taxa fixa = <b>${brl(S499.taxas)}</b>, ou ${pct(S499.taxas / 49.9)} do preço. Caem <b>${brl(S499.cai)}</b> na sua conta, antes do imposto, da embalagem e do custo do produto.`,
  ],
  porqueMenor: [
    "Por que cai na conta menos do que o preço que eu vendi?",
    "Porque a Shopee desconta a comissão e a taxa fixa direto da venda. O imposto, a embalagem e o custo do produto saem depois, do seu lado. A calculadora mostra cada parte separada para você ver o que sobra de verdade.",
  ],
  precoMinimo: [
    "Como saber o preço mínimo para não ter prejuízo?",
    "Coloque o preço, o custo do produto, a embalagem e o imposto, e preencha a meta de lucro por pedido (0 para só não ter prejuízo). A calculadora mostra o preço mínimo para bater a meta, dentro da mesma faixa de taxas do preço que você colocou.",
  ],
  tiktokQuanto: [
    "Quanto o TikTok Shop cobra por venda?",
    `Abaixo de R$ 50: 10% de comissão + R$ 4 de taxa fixa. A partir de R$ 50: 6% + R$ 6. Com frete grátis entra mais 6%. Numa venda de R$ 59,90 com frete grátis, saem ${brl(T599.taxas)} (${pct(T599.taxas / 59.9)}) e caem <b>${brl(T599.cai)}</b>, antes do imposto, do afiliado e dos seus custos.`,
  ],
  tiktokFrete: [
    "A taxa de 6% do frete grátis é obrigatória?",
    "Ela só entra se o produto participa do frete grátis. Na calculadora, marque <b>Não</b> em “Frete grátis ativo?” se você não participa, e a taxa sai da conta.",
  ],
  tiktok50: [
    "Vender a R$ 50 em vez de R$ 49,90 no TikTok Shop compensa?",
    `Dá quase o mesmo. Com frete grátis, a R$ 49,90 caem ${brl(T499.cai)} na conta e a R$ 50 caem ${brl(T50.cai)}: a comissão menor compensa a taxa fixa maior. Diferente da Shopee, no TikTok Shop subir de faixa não faz você receber menos.`,
  ],
  tiktokAfiliado: [
    "Como entra o afiliado (creator) no TikTok Shop?",
    "Coloque a comissão que você paga aos creators. Ela sai do preço em toda venda feita por afiliado. Se você não trabalha com afiliados, coloque 0.",
  ],
};

export const FAQ = {
  "shopee-preco": [P.armadilha80, P.taxaFixaPorItem, P.imposto, P.ads, P.afiliado, P.margemBoa],
  "shopee-reversa": [P.quantoDesconta, P.porqueMenor, P.armadilha80, P.precoMinimo, P.taxaFixaPorItem, P.imposto],
  tiktok: [P.tiktokQuanto, P.tiktokFrete, P.tiktok50, P.tiktokAfiliado, P.imposto],
  taxas: [P.taxaFixaPorItem, P.armadilha80, P.quantoDesconta, P.porqueMenor, P.ads, P.imposto],
};

const semTags = (h) => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const faqHtml = (id) => `
      <h3>Perguntas frequentes</h3>
      <div class="faq">${FAQ[id]
        .map(([q, r]) => `
        <details><summary>${q}</summary><p>${r}</p></details>`)
        .join("")}
      </div>`;
const faqLd = (id) => ({
  "@type": "FAQPage",
  mainEntity: FAQ[id].map(([q, r]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: semTags(r) } })),
});

export const CONTEUDO = {
  "shopee-preco": `
    <section class="seo" aria-labelledby="seo-tit">
      <h2 id="seo-tit">Como calcular o preço de venda na Shopee</h2>
      <p>Na Shopee, produtos até <b>R$ 79,99</b> pagam <b>20% de comissão + R$ 4,50 por item</b>. A partir de R$ 80 a comissão cai para <b>14%</b>, e a taxa fixa sobe para R$ 16, R$ 20 ou R$ 26, conforme a faixa de preço. Por isso o preço certo depende da faixa: a calculadora testa cada faixa e escolhe a que fecha a sua margem.</p>
      <p>A conta é: <b>preço = (custos + taxa fixa) ÷ (1 − comissão − imposto − Ads − afiliado − margem desejada)</b>. Ads entra como 1 ÷ ROAS (ROAS 10 = 10% do preço).</p>
      <h3>Taxas da Shopee usadas na calculadora (${ATUALIZADO_TXT})</h3>${TABELA_SHOPEE}${faqHtml("shopee-preco")}${ASSINATURA}
      ${LINKS("/calculadora")}
    </section>`,
  "shopee-reversa": `
    <section class="seo" aria-labelledby="seo-tit">
      <h2 id="seo-tit">Quanto a Shopee desconta de cada venda</h2>
      <p>De cada venda a Shopee desconta a <b>comissão</b> (20% até R$ 79,99 ou 14% a partir de R$ 80) e uma <b>taxa fixa por item</b> (de R$ 4,50 a R$ 26). Depois saem o imposto, a embalagem e o custo do produto: o que sobra é o seu lucro.</p>
      <p>Exemplo: um produto vendido a <b>R$ 59,90</b> paga 20% (${brl(S599.comissao)}) + R$ 4,50 de taxa fixa: caem <b>${brl(S599.cai)}</b> na conta antes do imposto e dos seus custos.</p>
      <h3>Taxas da Shopee usadas na calculadora (${ATUALIZADO_TXT})</h3>${TABELA_SHOPEE}${faqHtml("shopee-reversa")}${ASSINATURA}
      ${LINKS("/calculadora/shopee/quanto-sobra")}
    </section>`,
  tiktok: `
    <section class="seo" aria-labelledby="seo-tit">
      <h2 id="seo-tit">Taxas do TikTok Shop e como calcular o preço</h2>
      <p>No TikTok Shop, produtos <b>abaixo de R$ 50</b> pagam <b>10% de comissão + R$ 4</b> de taxa fixa; a partir de <b>R$ 50</b>, <b>6% + R$ 6</b>. Se você oferece frete grátis, entra mais <b>6%</b> de taxa de envio. Afiliado e imposto também saem do preço.</p>
      <p>A conta é: <b>preço = (custos + taxa fixa) ÷ (1 − comissão − envio − imposto − afiliado − margem desejada)</b>. Se o resultado passar de R$ 50, a calculadora refaz a conta com as taxas da faixa de cima.</p>
      <h3>Taxas do TikTok Shop usadas na calculadora (${ATUALIZADO_TXT})</h3>${TABELA_TIKTOK}${faqHtml("tiktok")}${ASSINATURA}
      ${LINKS("/calculadora/tiktok-shop")}
    </section>`,
};

/* ------------------------------------------------------------------ página de taxas */
const PRECOS_EXEMPLO = [29.9, 39.9, 49.9, 59.9, 79.9, 89.9, 119.9, 149.9, 199.9, 249.9];
export const CORPO_TAXAS = `
  <section class="intro">
    <p class="kicker sobe">Atualizado em ${ATUALIZADO_TXT}</p>
    <h1 class="sobe d1">Taxas da<br><span class="troca">Shopee</span> 2026<span class="dot">.</span></h1>
    <p class="sub sobe d2">Em 2026 a Shopee cobra <b>20% de comissão + R$ 4,50 por item</b> em produtos até R$ 79,99 e <b>14% + uma taxa fixa de R$ 16 a R$ 26</b> a partir de R$ 80. Veja quanto sai de cada preço e onde a faixa faz você receber menos.</p>
    <p class="acoes sobe d3">
      <a class="btn-cta" href="/calculadora">Calcular meu preço <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 9h11M10 4.5L14.5 9 10 13.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <a class="btn-sec" href="/calculadora/shopee/quanto-sobra">Ver quanto sobra de um preço</a>
    </p>
  </section>

  <article class="seo artigo">
    <h2>Comissão e taxa fixa por faixa de preço</h2>
    <p>São duas cobranças em toda venda: a <b>comissão</b>, um percentual do preço, e a <b>taxa fixa</b>, um valor por item vendido. As duas mudam conforme a faixa de preço do produto.</p>${TABELA_SHOPEE}

    <h2>Quanto a Shopee desconta em cada preço</h2>
    <p>Venda de 1 item, antes do imposto, da embalagem e do custo do produto.</p>
    <div class="tabela-rola">
      <table>
        <thead><tr><th>Preço</th><th>Comissão</th><th>Taxa fixa</th><th>Total de taxas</th><th>Cai na conta</th></tr></thead>
        <tbody>${PRECOS_EXEMPLO.map(shopee)
          .map((s) => `
          <tr><td><b>${brl(s.preco)}</b></td><td>${brl(s.comissao)} <small>(${pct(s.comissaoPct)})</small></td><td>${brl(s.taxaFixa)}</td><td>${brl(s.taxas)} <small>(${pct(s.taxas / s.preco)})</small></td><td><b>${brl(s.cai)}</b></td></tr>`)
          .join("")}
        </tbody>
      </table>
    </div>

    <h2>As faixas que fazem você receber menos</h2>
    <p>Quando o preço passa de uma faixa para a outra, a comissão cai, mas a taxa fixa sobe de uma vez. Logo acima do limite, você recebe <b>menos</b> do que receberia vendendo um centavo abaixo dele.</p>
    <div class="tabela-rola">
      <table>
        <thead><tr><th>Limite da faixa</th><th>Cai na conta no limite</th><th>Cai na conta 1 centavo acima</th><th>Volta a valer a pena a partir de</th></tr></thead>
        <tbody>${[
          [79.99, 80, EMP80],
          [99.99, 100, EMP100],
          [199.99, 200, EMP200],
        ]
          .map(([a, b, e]) => `
          <tr><td>${brl(a)}</td><td>${brl(shopee(a).cai)}</td><td>${brl(shopee(b).cai)}</td><td><b>${brl(e)}</b></td></tr>`)
          .join("")}
        </tbody>
      </table>
    </div>
    <p>Na prática: se o seu preço ideal deu entre R$ 80 e ${brl(EMP80 - 0.01)}, vender a R$ 79,90 deixa mais dinheiro no seu bolso. A <a href="/calculadora">calculadora de preço</a> já testa todas as faixas e escolhe a que fecha a sua margem.</p>

    <h2>O que não está nessas taxas</h2>
    <p>A comissão e a taxa fixa são o que a Shopee desconta. O seu lucro ainda depende de:</p>
    <ul>
      <li><b>Imposto</b> sobre a venda (no Simples, o percentual do DAS sobre o faturamento);</li>
      <li><b>Shopee Ads</b>, se você anuncia (1 ÷ ROAS do preço: ROAS 10 = 10%);</li>
      <li><b>Comissão de afiliado</b>, se você participa do programa;</li>
      <li><b>Custo do produto e embalagem</b>.</li>
    </ul>
    <p>Coloque tudo isso na <a href="/calculadora">calculadora de preço Shopee</a> para achar o preço que fecha a sua margem, ou na <a href="/calculadora/shopee/quanto-sobra">calculadora de quanto sobra</a> para ver o lucro de um preço que você já pratica.</p>
${faqHtml("taxas")}${ASSINATURA}
      ${LINKS(TAXAS.caminho)}
  </article>`;

/* ------------------------------------------------------------------ <head> */
const migalhaLd = (migalha) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["gutto", "/"], ...migalha].map(([nome, c], i) => ({ "@type": "ListItem", position: i + 1, name: nome, item: `${SITE}${c === "/" ? "" : c}` })),
});

const metas = (p) => `<title>${p.titulo}</title>
<meta name="description" content="${p.descricao}">
<link rel="canonical" href="${p.url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="${p.ogTipo ?? "website"}">
<meta property="og:site_name" content="gutto.">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${p.url}">
<meta property="og:title" content="${p.titulo}">
<meta property="og:description" content="${p.descricao}">
<meta property="og:image" content="${SITE}${p.og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}${p.og}">`;

/** Bloco do <head> de uma calculadora: título, descrição, canonical, Open Graph e dados estruturados. */
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
        publisher: editora,
      },
      faqLd(id),
      migalhaLd(p.migalha),
    ],
  };
  return `<!-- SEO:INICIO (gerado por calculadora/gerar-paginas.mjs) -->
${metas(p)}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>window.CALC_PAGINA = ${JSON.stringify({ plat: p.plat, modo: p.modo })};</script>
<!-- SEO:FIM -->`;
}

/** Bloco do <head> da página de taxas (artigo + perguntas frequentes). */
export function cabecalhoTaxas() {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Taxas da Shopee 2026: comissão, taxa fixa e quanto sobra por venda",
        description: TAXAS.descricao,
        url: TAXAS.url,
        mainEntityOfPage: TAXAS.url,
        image: `${SITE}${TAXAS.og}`,
        inLanguage: "pt-BR",
        datePublished: ATUALIZADO,
        dateModified: ATUALIZADO,
        author: autor,
        publisher: editora,
      },
      faqLd("taxas"),
      migalhaLd(TAXAS.migalha),
    ],
  };
  return `<!-- SEO:INICIO (gerado por calculadora/gerar-paginas.mjs) -->
${metas({ ...TAXAS, ogTipo: "article" })}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<!-- SEO:FIM -->`;
}
