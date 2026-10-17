// Gera as páginas da calculadora (uma por busca) a partir de calculadora/index.html.
// Uso: node calculadora/gerar-paginas.mjs   (rode de novo sempre que mudar a calculadora ou os textos em paginas.mjs)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONTEUDO, CORPO_TAXAS, PAGINAS, TAXAS, cabecalho, cabecalhoTaxas } from "./paginas.mjs";

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const fonteArq = path.join(raiz, "calculadora/index.html");
let fonte = fs.readFileSync(fonteArq, "utf8");

const trocarBloco = (html, ini, fim, novo) => {
  const a = html.indexOf(ini);
  const b = html.indexOf(fim);
  if (a < 0 || b < 0) throw new Error(`marcador não encontrado: ${ini}`);
  return html.slice(0, a) + novo + html.slice(b + fim.length);
};

function pagina(id) {
  const p = PAGINAS[id];
  let h = trocarBloco(fonte, "<!-- SEO:INICIO", "<!-- SEO:FIM -->", cabecalho(id));
  h = trocarBloco(h, "<!-- CONTEUDO:INICIO -->", "<!-- CONTEUDO:FIM -->", `<!-- CONTEUDO:INICIO -->${CONTEUDO[id]}\n  <!-- CONTEUDO:FIM -->`);
  // título grande e texto de abertura já certos no HTML (antes do JavaScript)
  h = h.replace(/<span id="h1-verbo">[^<]*<\/span>/, `<span id="h1-verbo">${p.verbo}</span>`);
  h = h.replace(/<span class="troca" id="h1-plat">[^<]*<\/span>/, `<span class="troca" id="h1-plat">${p.nomePlat}</span>`);
  h = h.replace(/(<p class="sub sobe d2" id="sub">)[^<]*(<\/p>)/, `$1${p.sub}$2`);
  return h;
}

// a fonte também recebe o cabeçalho e o conteúdo dela (fica sempre igual ao gerado)
fonte = pagina("shopee-preco");
fs.writeFileSync(fonteArq, fonte);
for (const id of Object.keys(PAGINAS)) {
  if (id === "shopee-preco") continue;
  const arq = path.join(raiz, PAGINAS[id].arquivo);
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, pagina(id));
  console.log("gerada", PAGINAS[id].caminho);
}

// página de taxas: mesmo <head> e visual da calculadora, sem a calculadora (só o texto, o CTA e o rodapé)
{
  let cab = trocarBloco(fonte.slice(0, fonte.indexOf("<body>")), "<!-- SEO:INICIO", "<!-- SEO:FIM -->", cabecalhoTaxas());
  cab = cab.replace('data-nome="Calculadora" data-categoria="ferramenta"', 'data-nome="Taxas Shopee" data-categoria="conteudo"');
  const pedaco = (ini, fim) => {
    const a = fonte.indexOf(ini);
    const b = fonte.indexOf(fim, a);
    if (a < 0 || b < 0) throw new Error(`trecho não encontrado: ${ini}`);
    return fonte.slice(a, b + fim.length);
  };
  const utm = (h) => h.replace(/utm_content=[a-z_]+/g, (m) => m.replace(/_shopee_preco$/, "_taxas_shopee"));
  const cta = utm(pedaco('<section class="cta"', "</section>"));
  const rodape = utm(pedaco("<footer>", "</footer>"));
  const html = `${cab}<body>

<header class="top" id="topo">
  <a class="logo" href="/?utm_source=calculadora&amp;utm_medium=site&amp;utm_campaign=calculadora&amp;utm_content=logo_taxas_shopee" aria-label="gutto. — página inicial">gutto<span class="dot">.</span></a>
  <a class="btn-sec" href="/calculadora">Abrir a calculadora</a>
</header>

<main>${CORPO_TAXAS}

  ${cta}
</main>

${rodape}
</body>
</html>
`;
  const arq = path.join(raiz, TAXAS.arquivo);
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  fs.writeFileSync(arq, html);
  console.log("gerada", TAXAS.caminho);
}
console.log("ok");
