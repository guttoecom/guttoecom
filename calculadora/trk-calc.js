/* Tracking da calculadora (usa window.trackEvent do /trk.js e window.Calc do calc.js).
   - IniciouCalculo: 1ª vez que a pessoa mexe num campo (o exemplo que já vem preenchido não conta)
   - CalculoFeito: o resultado ficou parado 2,5 s depois de a pessoa mexer (não conta cada tecla); só se mudou algo
   - TrocouPlataforma: Shopee ↔ TikTok e Precificador ↔ Reversa
   - CliqueCTA: botão do diagnóstico, logo, rodapé, links para o curso/mentoria/WhatsApp
   Dados do cálculo vão arredondados (preço, custos, margem, lucro) para o painel, o card do CRM e os públicos da Meta. */
(function () {
  'use strict';
  var interagiu = false, iniciou = false, timer = null, ultimaAssinatura = '', enviados = 0;
  var LIMITE = 30; // por página aberta
  var r2 = function (x) { return Math.round((Number(x) || 0) * 100) / 100; };
  var pct = function (x) { return Math.round((Number(x) || 0) * 1000) / 10; }; // 0,123 → 12,3

  function faixaMargem(m) {
    if (m < 0) return 'negativa';
    if (m < 0.1) return 'apertada';
    if (m < 0.2) return 'ok';
    return 'boa';
  }
  function faixaPreco(p) {
    if (p <= 0) return 'sem preço';
    if (p < 50) return 'até R$ 49';
    if (p < 80) return 'R$ 50–79';
    if (p < 150) return 'R$ 80–149';
    if (p < 300) return 'R$ 150–299';
    return 'R$ 300+';
  }

  function resumo(id, v) {
    var C = window.Calc;
    if (!C) return null;
    var r, d = { ferramenta: id, plataforma: id === 'tiktok' ? 'tiktok' : 'shopee' };
    try {
      if (id === 'tiktok') {
        r = C.tiktokPrecificar(v);
        d.preco = r2(r.preco); d.custos = r2(r.custos); d.lucro = r2(r.lucro); d.margem_pct = pct(r.margem);
        d.margem_desejada_pct = pct(v.margem); d.afiliado = Number(v.afiliadoPct) > 0; d.frete_gratis = !!v.freteGratis;
      } else if (id === 'shopee-reversa') {
        r = C.shopeeReversa(v);
        d.preco = r2(r.preco || v.preco); d.custos = r2((r.custo || 0) + (r.embalagem || 0) + (r.outros || 0)); d.lucro = r2(r.lucro); d.margem_pct = pct(r.margem);
        d.qtd = Number(v.qtd) || 1;
      } else {
        r = C.shopeePrecificar(v);
        d.preco = r2(r.preco); d.custos = r2(r.custos); d.lucro = r2(r.lucro); d.margem_pct = pct(r.margem);
        d.margem_desejada_pct = pct(r.margemDesejada); d.preco_sugerido = r2(r.sugerido); d.preco_manual = !!r.usandoManual;
        d.usa_ads = Number(v.roas) > 0; d.afiliado = !!v.afiliado;
      }
      d.imposto_pct = pct(v.imposto);
      d.faixa_margem = faixaMargem((d.margem_pct || 0) / 100);
      d.faixa_preco = faixaPreco(d.preco || 0);
      return d;
    } catch (e) {
      return null;
    }
  }

  document.addEventListener('input', function (e) {
    if (!e.isTrusted) return;
    interagiu = true;
    if (!iniciou && window.trackEvent) {
      iniciou = true;
      window.trackEvent('IniciouCalculo', { params: { ferramenta: document.title } });
    }
  }, true);

  /* chamado pela calculadora a cada recálculo */
  window.trkCalc = function (id, v) {
    if (!interagiu || enviados >= LIMITE) return;
    clearTimeout(timer);
    timer = setTimeout(function () {
      var d = resumo(id, v);
      if (!d || !(d.preco > 0 || d.custos > 0)) return;
      var assinatura = [d.ferramenta, d.preco, d.custos, d.margem_pct, d.imposto_pct].join('|');
      if (assinatura === ultimaAssinatura) return;
      ultimaAssinatura = assinatura;
      enviados++;
      if (window.trackEvent) window.trackEvent('CalculoFeito', { params: d });
    }, 2500);
  };

  /* troca de plataforma / modo */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-plat], [data-modo]');
    if (b && window.trackEvent && b.getAttribute('aria-selected') !== 'true') {
      window.trackEvent('TrocouPlataforma', { params: { para: b.dataset.plat || b.dataset.modo } });
    }
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !window.trackEvent) return;
    var href = a.getAttribute('href') || '';
    var destino = /#diagnostico/.test(href) ? 'diagnostico_gutto'
      : /umleogutemberg|kiwify/.test(href) ? 'curso'
      : /mentoria/.test(href) ? 'mentoria'
      : /wa\.me|whatsapp/.test(href) ? 'whatsapp'
      : href.charAt(0) === '/' ? 'site_gutto' : 'outro';
    window.trackEvent('CliqueCTA', { params: { destino: destino, local: a.id || 'link', pagina: 'calculadora' } });
  }, true);
})();
