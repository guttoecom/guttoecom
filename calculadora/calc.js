// Calculadora gutto · regras copiadas célula a célula das planilhas da gutto.
// Shopee "Precificação Shopee" (aba Precificador), Shopee "Calculadora Reversa" (aba Calculadora)
// e "Precificação TikTok Shop" (abas Precificação e Taxas TikTok). Percentuais entram como fração (5% = 0.05).
(function (raiz) {
  const n = (v) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

  /* ---------------- Shopee ---------------- */

  const shopeeFaixa = (p) =>
    p <= 79.99 ? "Até R$ 79,99" : p <= 99.99 ? "R$ 80 a R$ 99,99" : p <= 199.99 ? "R$ 100 a R$ 199,99" : "Acima de R$ 200";
  const shopeeComissao = (p) => (p <= 79.99 ? 0.2 : 0.14);
  // Taxa fixa por item. 1ª faixa = R$ 4,50 (definido pelo Bruno em 15/10; as planilhas tinham R$ 4 em algumas células).
  const TAXA_FIXA_FAIXA1 = 4.5;
  const shopeeTaxaFixa = (p) => (p <= 79.99 ? TAXA_FIXA_FAIXA1 : p <= 99.99 ? 16 : p <= 199.99 ? 20 : 26);

  /** Precificador: preço sugerido pela margem desejada e o resultado do preço usado (manual ou sugerido). */
  function shopeePrecificar(e) {
    const custo = n(e.custo), embalagem = n(e.embalagem), outros = n(e.outros);
    const imposto = n(e.imposto), lucroDesejado = n(e.lucro), roas = n(e.roas);
    const custos = custo + embalagem + outros; // I5
    const pctAds = roas > 0 ? 1 / roas : 0; // I6
    const pctAfiliado = e.afiliado ? n(e.afiliadoPct) : 0; // I7
    const d20 = 1 - 0.2 - imposto - pctAds - pctAfiliado - lucroDesejado; // I8
    const d14 = 1 - 0.14 - imposto - pctAds - pctAfiliado - lucroDesejado; // I9
    const p1 = (custos + TAXA_FIXA_FAIXA1) / d20; // I10
    const p2 = (custos + 16) / d14; // I11
    const p3 = (custos + 20) / d14; // I12
    const p4 = (custos + 26) / d14; // I13
    let sugerido; // F5
    if (d20 <= 0 || d14 <= 0) sugerido = 0;
    else if (p1 <= 79.99 && p1 > 0) sugerido = p1;
    else if (p2 >= 80 && p2 <= 99.99) sugerido = p2;
    else if (p3 >= 100 && p3 <= 199.99) sugerido = p3;
    else sugerido = p4;

    const manual = n(e.precoManual);
    const preco = manual > 0 ? manual : sugerido;
    const comissaoPct = shopeeComissao(preco); // F7
    const comissao = preco * comissaoPct;
    const taxaFixa = shopeeTaxaFixa(preco); // F8
    const ads = roas > 0 ? preco / roas : 0; // F9
    const afiliado = e.afiliado ? preco * n(e.afiliadoPct) : 0; // F10
    const impostoR = preco * imposto; // F11
    const liquido = preco - comissao - taxaFixa - ads - afiliado - impostoR; // F12
    const lucro = liquido - custo - embalagem - outros; // F13
    const margem = preco ? lucro / preco : 0; // F14
    return {
      sugerido, semPreco: d20 <= 0 || d14 <= 0, usandoManual: manual > 0, preco,
      faixa: shopeeFaixa(preco), comissaoPct, comissao, taxaFixa, ads, afiliado, imposto: impostoR,
      liquido, custos, lucro, margem, margemDesejada: lucroDesejado,
    };
  }

  /** Calculadora reversa: quanto sobra de um preço de venda (por pedido com N itens). */
  function shopeeReversa(e) {
    const preco = n(e.preco), qtd = n(e.qtd), imposto = n(e.imposto);
    const embalagem = n(e.embalagem), custo = n(e.custo), outros = n(e.outros), meta = n(e.meta);
    const bruto = preco * qtd;
    const comissaoPct = shopeeComissao(preco); // E5
    const comissao = preco * comissaoPct * qtd; // E6
    const taxaFixa = shopeeTaxaFixa(preco) * qtd; // E7
    const impostoR = preco * imposto * qtd; // E8
    const embalagemTotal = embalagem * qtd; // E9
    const custoTotal = custo * qtd; // E10
    const total = comissao + taxaFixa + impostoR + embalagemTotal + custoTotal + outros; // E12
    const liquido = bruto - comissao - taxaFixa - impostoR - embalagemTotal; // E13
    const lucro = bruto - total; // E14
    const margem = bruto === 0 ? 0 : lucro / bruto; // E15
    // B13: preço mínimo para a meta, na mesma faixa do preço informado.
    const den = qtd * (1 - comissaoPct - imposto);
    const minimo = den === 0 ? null : (meta + shopeeTaxaFixa(preco) * qtd + embalagem * qtd + custo * qtd + outros) / den;
    const pct = (v) => (bruto === 0 ? 0 : v / bruto);
    return {
      bruto, faixa: shopeeFaixa(preco), comissaoPct, comissao, taxaFixa, imposto: impostoR,
      embalagem: embalagemTotal, custo: custoTotal, outros, total, liquido, lucro, margem, minimo,
      bateuMeta: lucro >= meta, meta, pct,
    };
  }

  /* ---------------- TikTok Shop ---------------- */

  // Aba "Taxas TikTok": abaixo de R$ 50 e R$ 50 ou mais.
  const TIKTOK = {
    abaixo50: { comissao: 0.1, envio: 0.06, fixa: 4 },
    de50: { comissao: 0.06, envio: 0.06, fixa: 6 },
  };
  const tiktokTaxas = (p, freteGratis) => {
    const t = p < 50 ? TIKTOK.abaixo50 : TIKTOK.de50;
    return { faixa: p < 50 ? "Abaixo de R$ 50" : "R$ 50 ou mais", comissaoPct: t.comissao, envioPct: freteGratis ? t.envio : 0, fixa: t.fixa };
  };

  /** Precificação TikTok Shop: preço sugerido (B13) e resultado do preço praticado (B14). */
  function tiktokPrecificar(e) {
    const custos = n(e.custo) + n(e.embalagem) + n(e.frete) + n(e.outros); // SUM(B6:B8)+B11
    const imposto = n(e.imposto), margemDesejada = n(e.margem), afiliadoPct = n(e.afiliadoPct);
    const qtd = n(e.qtd);
    const a = TIKTOK.abaixo50, b = TIKTOK.de50;
    const envA = e.freteGratis ? a.envio : 0, envB = e.freteGratis ? b.envio : 0;
    const dA = 1 - a.comissao - envA - imposto - margemDesejada - afiliadoPct;
    const dB = 1 - b.comissao - envB - imposto - margemDesejada - afiliadoPct;
    let sugerido; // B13 (IFERROR → 0)
    if (dA === 0) sugerido = 0;
    else {
      const pA = (custos + a.fixa) / dA;
      if (pA < 50) sugerido = pA;
      else sugerido = dB === 0 ? 0 : Math.max(50, (custos + b.fixa) / dB);
    }
    const manual = n(e.precoManual);
    const preco = manual > 0 ? manual : sugerido; // B14
    const r = resultadoTiktok(preco, { custos, imposto, afiliadoPct, freteGratis: e.freteGratis });
    return {
      ...r, sugerido, semPreco: sugerido <= 0, usandoManual: manual > 0, margemDesejada,
      lucroTotal: r.lucro * qtd, // F18
      atingiu: r.margem >= margemDesejada, // F19
    };
  }

  function resultadoTiktok(preco, c) {
    const t = tiktokTaxas(preco, c.freteGratis);
    const comissao = preco * t.comissaoPct; // F9
    const envio = preco * t.envioPct; // F10
    const impostoR = preco * c.imposto; // F11
    const afiliado = preco * c.afiliadoPct; // B17
    const taxas = t.fixa + comissao + envio + impostoR + afiliado;
    const receita = preco - taxas; // F14
    const lucro = preco - (c.custos + taxas); // F15 (= B14 − F13)
    return {
      preco, faixa: t.faixa, comissaoPct: t.comissaoPct, envioPct: t.envioPct, taxaFixa: t.fixa,
      comissao, envio, imposto: impostoR, afiliado, custos: c.custos, custoTotal: c.custos + taxas,
      receita, lucro, margem: preco ? lucro / preco : 0, // F16 (IFERROR → 0)
    };
  }

  /** Comparativo rápido de preços (linhas 22–26 da aba Precificação). */
  function tiktokComparar(precos, e) {
    const c = { custos: n(e.custo) + n(e.embalagem) + n(e.frete) + n(e.outros), imposto: n(e.imposto), afiliadoPct: n(e.afiliadoPct), freteGratis: e.freteGratis };
    return precos.map((p) => resultadoTiktok(n(p), c));
  }

  const api = { shopeePrecificar, shopeeReversa, tiktokPrecificar, tiktokComparar, shopeeFaixa, TIKTOK };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else raiz.Calc = api;
})(typeof window !== "undefined" ? window : globalThis);
