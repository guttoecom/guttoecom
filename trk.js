/* Tracking first-party do site da gutto (calculadora, kit, página inicial): Meta Pixel + CAPI pelo nosso servidor + GA4.
   window.trackEvent(nome, dados) é o ÚNICO ponto de disparo: o mesmo event_id vai para o Pixel e para o servidor
   (a Meta deduplica). Eventos padrão da Meta usam fbq('track'); os nossos (CalculoFeito, CliqueCTA…) fbq('trackCustom').
   No GA4 os eventos vão só pelo gtag. Configuração vem de /api/track/identity (Pixel, GA4, dados do lead com hash).
   Uso: <script src="/trk.js" data-nome="Calculadora" data-categoria="ferramenta" defer></script>
        data-auto="nao" desliga o PageView/ViewContent automático.                                                   */
(function () {
  'use strict';
  var script = document.currentScript;
  var NOME = (script && script.dataset.nome) || document.title;
  var CATEGORIA = (script && script.dataset.categoria) || 'site';
  var AUTO = !(script && script.dataset.auto === 'nao');
  var PADRAO = { PageView: 'page_view', ViewContent: 'view_item', Lead: 'generate_lead', InitiateCheckout: 'begin_checkout', Contact: 'contact' };
  var GA4_NOSSOS = { IniciouCalculo: 'calculo_iniciado', CalculoFeito: 'calculo_feito', TrocouPlataforma: 'plataforma_trocada', CliqueCTA: 'clique_cta' };
  var ATRIB = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'gclid', 'ad_id', 'adset_id', 'campaign_id'];
  var cfg = null;
  var fila = [];

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  function paramsUrl() {
    var u = new URLSearchParams(location.search), o = {};
    ATRIB.forEach(function (k) { var v = (u.get(k) || '').trim(); if (v) o[k] = v.slice(0, 300); });
    return o;
  }
  function gaIds(cb) {
    var feito = false, ids = {};
    var fim = function () { if (!feito) { feito = true; cb(ids); } };
    if (typeof gtag !== 'function' || !cfg || !cfg.ga4) return fim();
    try {
      gtag('get', cfg.ga4, 'client_id', function (v) { ids.ga_client_id = v; if (ids.ga_session_id !== undefined) fim(); });
      gtag('get', cfg.ga4, 'session_id', function (v) { ids.ga_session_id = v || null; if (ids.ga_client_id !== undefined) fim(); });
    } catch (e) { /* segue sem */ }
    setTimeout(fim, 800);
  }
  function carregarPixel(pixel, userData) {
    if (window.fbq) return;
    /* script base oficial do Pixel */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixel, userData || {});
  }
  var snake = function (s) { return s.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(); };

  function disparar(nome, dados) {
    dados = dados || {};
    var padrao = Object.prototype.hasOwnProperty.call(PADRAO, nome);
    var eventId = uuid();
    var params = {};
    var p0 = dados.params || {};
    Object.keys(p0).forEach(function (k) { if (p0[k] !== undefined && p0[k] !== null && p0[k] !== '') params[k] = p0[k]; });
    if (dados.value != null) { params.value = dados.value; params.currency = 'BRL'; }
    if (dados.content_name) params.content_name = dados.content_name;
    if (dados.content_category) params.content_category = dados.content_category;
    if (window.fbq && cfg && cfg.pixel) {
      if (dados.user_data) {
        var u = dados.user_data, am = {};
        if (u.email) am.em = String(u.email).trim().toLowerCase();
        if (u.phone) am.ph = String(u.phone).replace(/\D/g, '').replace(/^(\d{10,11})$/, '55$1');
        if (u.first_name) am.fn = String(u.first_name).trim().toLowerCase();
        if (u.last_name) am.ln = String(u.last_name).trim().toLowerCase();
        am.external_id = cfg.user_data && cfg.user_data.external_id;
        window.fbq('init', cfg.pixel, am);
      }
      window.fbq(padrao ? 'track' : 'trackCustom', nome, params, { eventID: eventId });
    }
    if (typeof gtag === 'function') gtag('event', PADRAO[nome] || GA4_NOSSOS[nome] || snake(nome), Object.assign({}, params, { event_id: eventId }));
    try { if (window.clarity && !padrao) clarity('event', nome); } catch (e) { /* nada */ }
    gaIds(function (ids) {
      var corpo = JSON.stringify({
        event_name: nome, event_id: eventId, event_source_url: location.href, referrer: document.referrer || null,
        user_data: dados.user_data || null, params: params, url_params: paramsUrl(),
        ga_client_id: ids.ga_client_id || null, ga_session_id: ids.ga_session_id || null,
      });
      try { fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corpo, keepalive: true, credentials: 'same-origin' }); } catch (e) { /* nunca trava a página */ }
    });
  }

  window.trackEvent = function (nome, dados) {
    if (cfg) disparar(nome, dados); else fila.push([nome, dados]);
  };

  fetch('/api/track/identity', { credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (c) {
      cfg = c || { pixel: null, ga4: null, user_data: {} };
      if (cfg.pixel) carregarPixel(cfg.pixel, cfg.user_data);
      if (typeof gtag === 'function' && cfg.ga4 && cfg.lead_id) gtag('config', cfg.ga4, { send_page_view: false, user_id: cfg.lead_id });
      if (AUTO) {
        disparar('PageView', {});
        disparar('ViewContent', { content_name: NOME, content_category: CATEGORIA });
      }
      fila.splice(0).forEach(function (f) { disparar(f[0], f[1]); });
    });
})();
