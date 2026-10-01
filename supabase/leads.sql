-- Tabela de leads da landing page (diagnóstico gratuito).
-- Rodar uma vez no Supabase: Dashboard → SQL Editor → New query → colar → Run.

create table if not exists public.leads (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),

  nome          text   not null check (char_length(nome) between 2 and 120),
  whatsapp      text   not null check (whatsapp ~ '^\(\d{2}\) \d{4,5}-\d{4}$'),
  confeccao     text   not null check (char_length(confeccao) between 2 and 160),
  fabrica       text   not null check (fabrica in ('Sim', 'Não')),
  vende         text   not null check (vende in ('Sim', 'Ainda não')),
  canais        text[] not null check (
                  cardinality(canais) between 1 and 7
                  and canais <@ array['Mercado Livre', 'Shopee', 'Amazon', 'Shein', 'Magalu', 'TikTok Shop', 'Ainda não vendo']
                ),
  faturamento   text   not null check (faturamento in (
                  'Ainda não vendo', 'Até R$ 20 mil', 'De R$ 20 mil a R$ 50 mil',
                  'De R$ 50 mil a R$ 100 mil', 'Acima de R$ 100 mil'
                )),
  dificuldade   text   not null check (char_length(dificuldade) between 3 and 2000),

  -- origem do lead (anúncios)
  utm_source    text check (char_length(utm_source)   <= 200),
  utm_medium    text check (char_length(utm_medium)   <= 200),
  utm_campaign  text check (char_length(utm_campaign) <= 200),
  utm_content   text check (char_length(utm_content)  <= 200),
  utm_term      text check (char_length(utm_term)     <= 200),
  pagina        text check (char_length(pagina)       <= 500)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Segurança: o site (chave pública / anon) só pode INSERIR.
-- Ninguém de fora consegue ler, alterar ou apagar leads; você vê tudo pelo painel.
alter table public.leads enable row level security;

revoke all on public.leads from anon, authenticated;
grant insert on public.leads to anon;

drop policy if exists "site pode enviar leads" on public.leads;
create policy "site pode enviar leads"
  on public.leads
  for insert
  to anon
  with check (true);
