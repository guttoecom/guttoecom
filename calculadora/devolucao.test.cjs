// node --test calculadora/devolucao.test.cjs · confere as contas da Calculadora Devolução Fácil Shopee.
const test = require("node:test");
const assert = require("node:assert/strict");
const { devolucaoFacil, lerNumero, PADRAO } = require("./devolucao.js");

const base = (pedidos, devolucoes, extra = {}) => devolucaoFacil({ pedidos, devolucoes, ...PADRAO, ...extra });

test("exemplo do briefing: 10.000 pedidos e 150 devoluções → economia de R$ 350", () => {
  const r = base(10000, 150);
  assert.equal(r.custoCom, 4900);
  assert.equal(r.custoSem, 5250);
  assert.equal(r.saldo, 350);
  assert.equal(r.veredito, "vale");
  assert.equal(r.taxaDevolucao, 0.015);
  assert.equal(r.custoPorDevolucao, 35);
  assert.equal((r.equilibrio * 100).toFixed(2), "1.40"); // 0,49 ÷ 35
  assert.equal(r.minimoDevolucoes, 141); // 140 × 35 = 4.900 empata; precisa passar
});

test("ponto de equilíbrio exato e prejuízo", () => {
  const empate = base(10000, 140);
  assert.equal(empate.saldo, 0);
  assert.equal(empate.veredito, "empate");
  const r = base(10000, 100);
  assert.equal(r.saldo, -1400);
  assert.equal(r.veredito, "nao_vale");
});

test("mínimo de devoluções quando a divisão não é exata", () => {
  const r = base(1000, 0); // programa R$ 490 → 490 / 35 = 14 exato → 15
  assert.equal(r.minimoDevolucoes, 15);
  const x = base(1001, 0); // R$ 490,49 / 35 = 14,01 → 15
  assert.equal(x.minimoDevolucoes, 15);
  assert.equal(x.custoCom, 490.49);
});

test("zero pedidos, zero devoluções e custo de devolução zero não quebram", () => {
  const z = base(0, 0);
  assert.equal(z.custoCom, 0);
  assert.equal(z.taxaDevolucao, null);
  assert.equal(z.minimoDevolucoes, null);
  assert.equal(z.veredito, "empate");
  assert.ok(z.avisos.includes("sem_pedidos"));

  const semDev = base(500, 0);
  assert.equal(semDev.veredito, "nao_vale");
  assert.equal(semDev.taxaDevolucao, 0);

  const gratis = devolucaoFacil({ pedidos: 100, devolucoes: 5, taxaPrograma: 0.49, taxaDevolucao: 0, frete: 0 });
  assert.equal(gratis.equilibrio, null);
  assert.equal(gratis.minimoDevolucoes, null);
  assert.ok(gratis.avisos.includes("devolucao_sem_custo"));
});

test("entradas inválidas: negativos viram 0, contagens viram inteiros, aviso de devoluções acima dos pedidos", () => {
  const r = devolucaoFacil({ pedidos: -10, devolucoes: 3.7, taxaPrograma: -1, taxaDevolucao: NaN, frete: 20 });
  assert.equal(r.pedidos, 0);
  assert.equal(r.devolucoes, 3);
  assert.equal(r.custoCom, 0);
  assert.equal(r.custoSem, 60);
  assert.ok(base(10, 20).avisos.includes("devolucoes_acima_dos_pedidos"));
});

test("lê números no formato brasileiro", () => {
  assert.equal(lerNumero("0,49"), 0.49);
  assert.equal(lerNumero("R$ 1.234,56"), 1234.56);
  assert.equal(lerNumero("10.000"), 10000);
  assert.equal(lerNumero("15"), 15);
  assert.equal(lerNumero("2.5"), 2.5);
  assert.ok(Number.isNaN(lerNumero("")));
  assert.ok(Number.isNaN(lerNumero("-3")));
  assert.ok(Number.isNaN(lerNumero("abc")));
});
