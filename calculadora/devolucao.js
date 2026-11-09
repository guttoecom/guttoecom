// Calculadora Devolução Fácil Shopee · gutto.
// Compara o custo do programa (taxa por pedido confirmado) com o que as devoluções custariam sem ele
// (taxa por devolução + frete). Só entram devoluções que gerariam cobrança ao vendedor e que o programa cobriria.
// As contas são feitas em centavos para o empate (ponto de equilíbrio) ser exato.
(function (raiz) {
  const PADRAO = { taxaPrograma: 0.49, taxaDevolucao: 15, frete: 20 };

  const naoNeg = (v) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : 0);
  const inteiro = (v) => Math.floor(naoNeg(v));
  const centavos = (v) => Math.round(naoNeg(v) * 100);

  /** "1.234,56" / "R$ 0,49" / "15" → número; vazio ou inválido → NaN */
  function lerNumero(texto) {
    let t = String(texto ?? "").trim().replace(/\s|R\$/g, "");
    if (!t) return NaN;
    if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, ""); // 10.000 = dez mil
    return /^\d*\.?\d+$/.test(t) ? Number(t) : NaN;
  }

  /**
   * e = { pedidos, devolucoes, taxaPrograma, taxaDevolucao, frete } (valores em reais; contagens por mês)
   * Valores negativos ou inválidos viram 0; contagens viram inteiros.
   */
  function devolucaoFacil(e) {
    const pedidos = inteiro(e.pedidos);
    const devolucoes = inteiro(e.devolucoes);
    const programaC = centavos(e.taxaPrograma);
    const porDevolucaoC = centavos(e.taxaDevolucao) + centavos(e.frete);

    const comC = pedidos * programaC;
    const semC = devolucoes * porDevolucaoC;
    const saldoC = semC - comC;

    // menor número de devoluções em que o custo evitado passa ESTRITAMENTE o custo do programa
    const minimoDevolucoes = porDevolucaoC > 0 && pedidos > 0 ? Math.floor(comC / porDevolucaoC) + 1 : null;

    const avisos = [];
    if (pedidos === 0) avisos.push("sem_pedidos");
    if (devolucoes > pedidos) avisos.push("devolucoes_acima_dos_pedidos");
    if (porDevolucaoC === 0) avisos.push("devolucao_sem_custo");
    if (programaC === 0) avisos.push("programa_sem_custo");

    return {
      pedidos,
      devolucoes,
      custoPorDevolucao: porDevolucaoC / 100,
      custoCom: comC / 100,
      custoSem: semC / 100,
      saldo: saldoC / 100, // > 0 economia; < 0 prejuízo
      veredito: saldoC > 0 ? "vale" : saldoC < 0 ? "nao_vale" : "empate",
      taxaDevolucao: pedidos > 0 ? devolucoes / pedidos : null, // fração
      equilibrio: porDevolucaoC > 0 ? programaC / porDevolucaoC : null, // fração dos pedidos
      minimoDevolucoes,
      minimoTaxa: minimoDevolucoes !== null ? minimoDevolucoes / pedidos : null,
      avisos,
    };
  }

  const api = { devolucaoFacil, lerNumero, PADRAO };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.Devolucao = api;
})(typeof window !== "undefined" ? window : globalThis);
