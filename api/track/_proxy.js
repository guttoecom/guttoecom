// Proxy first-party do tracking do site da gutto (projeto gutto_site): o domínio guttoecom.com.br recebe a chamada, acrescenta IP, país, estado e cidade
// do visitante (cabeçalhos da Vercel) e repassa para a Edge Function trk do Supabase, devolvendo os cookies.
const DESTINO = "https://aedxvttmnjheussswyht.supabase.co/functions/v1/trk";

export async function repassar(request, rota) {
  const h = request.headers;
  const cab = new Headers({ "content-type": h.get("content-type") || "application/json" });
  const copiar = { cookie: "cookie", "user-agent": "x-trk-ua" };
  for (const [de, para] of Object.entries(copiar)) if (h.get(de)) cab.set(para, h.get(de));
  const ip = (h.get("x-real-ip") || h.get("x-forwarded-for") || "").split(",")[0].trim();
  if (ip) cab.set("x-trk-ip", ip);
  if (h.get("x-vercel-ip-country")) cab.set("x-trk-country", h.get("x-vercel-ip-country"));
  if (h.get("x-vercel-ip-country-region")) cab.set("x-trk-region", h.get("x-vercel-ip-country-region"));
  if (h.get("x-vercel-ip-city")) cab.set("x-trk-city", h.get("x-vercel-ip-city"));
  if (h.get("cookie")) cab.set("cookie", h.get("cookie"));
  const url = new URL(request.url);
  url.searchParams.set("p", "gutto_site");
  const resp = await fetch(`${DESTINO}/${rota}${url.search}`, {
    method: request.method,
    headers: cab,
    body: request.method === "POST" ? await request.text() : undefined,
  });
  const saida = new Headers({ "cache-control": "no-store" });
  const tipo = resp.headers.get("content-type");
  if (tipo) saida.set("content-type", tipo);
  for (const c of resp.headers.getSetCookie ? resp.headers.getSetCookie() : []) if (!/Domain=supabase\.co/i.test(c)) saida.append("set-cookie", c);
  return new Response(resp.status === 204 ? null : await resp.text(), { status: resp.status, headers: saida });
}
