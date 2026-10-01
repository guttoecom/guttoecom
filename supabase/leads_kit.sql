-- Leads do formulário "Kit do Fabricante no Marketplace" (/kit).
-- Rodar uma vez no Supabase: Dashboard → SQL Editor → New query → colar → Run.

create table if not exists public.leads_kit (
  id                  bigint generated always as identity primary key,
  email               text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  whatsapp            text not null check (whatsapp ~ '^[1-9]{2}9[0-9]{8}$'),
  empresa             text not null check (char_length(empresa) between 1 and 160),
  fabrica_ou_revende  text not null check (fabrica_ou_revende in ('fabrica', 'revende', 'nao_comecou')),
  vende_marketplace   text not null check (vende_marketplace in ('sim', 'nao')),
  faturamento_mensal  text not null check (faturamento_mensal in ('ate_5k', '5k_20k', '20k_50k', 'acima_50k', 'nao_vende')),
  instagram           text check (char_length(instagram)    <= 200),
  utm_source          text check (char_length(utm_source)   <= 200),
  utm_medium          text check (char_length(utm_medium)   <= 200),
  utm_campaign        text check (char_length(utm_campaign) <= 200),
  criado_em           timestamptz not null default now(),
  -- quem ainda não vende não tem faturamento
  check (vende_marketplace = 'sim' or faturamento_mensal = 'nao_vende')
);

create index if not exists leads_kit_criado_em_idx on public.leads_kit (criado_em desc);

-- O formulário (chave anon) só pode INSERIR. Ler, alterar e apagar: só pelo painel.
alter table public.leads_kit enable row level security;

revoke all on public.leads_kit from anon, authenticated;
grant insert on public.leads_kit to anon;

drop policy if exists "insercao publica" on public.leads_kit;
create policy "insercao publica"
  on public.leads_kit
  for insert
  to anon
  with check (true);
