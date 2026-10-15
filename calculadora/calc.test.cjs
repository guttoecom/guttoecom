// node --test calculadora/  · confere a calculadora contra os valores que as planilhas mostram.
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("./calc.js");

const perto = (a, b, casas = 2) => assert.equal(a.toFixed(casas), b.toFixed(casas));

test("Shopee Precificador: exemplo da planilha (sugerido R$ 29,17; manual R$ 47,99 → lucro R$ 17,99 / 37,49%)", () => {
  const e = { custo: 12, embalagem: 0.5, outros: 1, imposto: 0.05, lucro: 0.15, roas: 0, afiliado: false, afiliadoPct: 0.105 };
  perto(C.shopeePrecificar(e).sugerido, 29.17);
  const r = C.shopeePrecificar({ ...e, precoManual: 47.99 });
  assert.equal(r.faixa, "Até R$ 79,99");
  assert.equal(r.taxaFixa, 4.5);
  perto(r.lucro, 17.99);
  perto(r.margem * 100, 37.49);
});

test("Shopee Precificador: afiliado e ROAS entram no preço e no resultado; % impossível → 0", () => {
  const r = C.shopeePrecificar({ custo: 12, embalagem: 0.5, outros: 1, imposto: 0.05, lucro: 0.15, roas: 10, afiliado: true, afiliadoPct: 0.105 });
  perto(r.sugerido, 17.5 / (1 - 0.2 - 0.05 - 0.1 - 0.105 - 0.15));
  perto(r.ads, r.preco / 10);
  perto(r.afiliado, r.preco * 0.105);
  const x = C.shopeePrecificar({ custo: 10, imposto: 0.5, lucro: 0.4 });
  assert.equal(x.sugerido, 0);
  assert.equal(x.semPreco, true);
});

test("Shopee Precificador: pula de faixa como a planilha", () => {
  const r = C.shopeePrecificar({ custo: 60, imposto: 0.05, lucro: 0.15 });
  // (60+4)/0,6 = 106,67 > 79,99 → (60+16)/0,66 = 115,15 fora de 80–99,99 → (60+20)/0,66 = 121,21
  perto(r.sugerido, 80 / 0.66);
  assert.equal(r.taxaFixa, 20);
  assert.equal(r.comissaoPct, 0.14);
});

test("Shopee Reversa: exemplo da planilha (R$ 45,90 → líquido R$ 30,15, lucro R$ 4,15, mínimo R$ 40,40)", () => {
  const r = C.shopeeReversa({ preco: 45.9, qtd: 1, imposto: 0.045, embalagem: 0.5, custo: 26 });
  perto(r.comissao, 9.18);
  assert.equal(r.taxaFixa, 4);
  perto(r.imposto, 2.07);
  perto(r.total, 41.75);
  perto(r.liquido, 30.15);
  perto(r.lucro, 4.15);
  perto(r.margem * 100, 9.05);
  perto(r.minimo, 40.4);
  assert.equal(r.bateuMeta, true);
});

test("Shopee Reversa: linhas do Simulador", () => {
  const linha = (preco, custo) => C.shopeeReversa({ preco, qtd: 1, imposto: 0.06, embalagem: 1.5, custo });
  perto(linha(49.9, 20).comissao, 9.98);
  perto(linha(89.9, 35).comissao, 12.59);
  assert.equal(linha(89.9, 35).taxaFixa, 16);
  perto(linha(129.9, 50).comissao, 18.19);
  perto(linha(219.9, 80).comissao, 30.79);
  assert.equal(linha(219.9, 80).taxaFixa, 26);
  perto(linha(219.9, 80).imposto, 13.19);
});

test("TikTok: exemplo da planilha (sugerido R$ 85,15; receita R$ 54,03; lucro R$ 17,03; 20%)", () => {
  const e = { custo: 36.5, embalagem: 0.5, frete: 0, outros: 0, imposto: 0.025, margem: 0.2, qtd: 1, freteGratis: true, afiliadoPct: 0.15 };
  const r = C.tiktokPrecificar(e);
  perto(r.sugerido, 85.15);
  assert.equal(r.faixa, "R$ 50 ou mais");
  perto(r.custoTotal, 68.12);
  perto(r.receita, 54.03);
  perto(r.lucro, 17.03);
  perto(r.margem * 100, 20, 1);
  assert.equal(r.atingiu, true);
  const comp = C.tiktokComparar([39.9, 49.9, 50, 59.9, 79.9], e);
  assert.deepEqual(comp.map((c) => c.lucro.toFixed(2)), ["-14.47", "-7.82", "-7.75", "-0.77", "13.33"]);
  assert.deepEqual(comp.map((c) => c.taxaFixa), [4, 4, 6, 6, 6]);
});

test("TikTok: sem frete grátis não cobra os 6% de envio; abaixo de R$ 50 usa 10% + R$ 4", () => {
  const r = C.tiktokPrecificar({ custo: 10, imposto: 0, margem: 0.1, qtd: 3, freteGratis: false, afiliadoPct: 0 });
  perto(r.sugerido, 14 / 0.8);
  assert.equal(r.envio, 0);
  perto(r.lucroTotal, r.lucro * 3);
});
