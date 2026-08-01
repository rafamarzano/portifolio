-- ================================================================
-- SETUP DO BANCO DE DADOS (Supabase)
-- Rode este script inteiro no SQL Editor do seu projeto Supabase
-- (Painel do Supabase > SQL Editor > New query > colar e rodar).
-- ================================================================

-- Tabela de eventos do portfolio (visitas, cliques, videos vistos)
create table if not exists portfolio_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,        -- 'page_view' | 'button_click' | 'video_view'
  event_name text,                 -- nome do evento (ex: nome do botao ou id do video)
  session_id text,                 -- identifica um visitante durante a sessao
  page_path text,                  -- caminho da pagina onde o evento ocorreu
  metadata jsonb,                  -- dados extras (title, brand, category, etc)
  created_at timestamptz not null default now()
);

-- Tabela de mensagens recebidas (formulario de contato e popup)
create table if not exists portfolio_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  brand text,
  budget text,
  message text,
  source text,                     -- 'contact' | 'popup'
  created_at timestamptz not null default now()
);

-- Ativa Row Level Security nas duas tabelas
alter table portfolio_events enable row level security;
alter table portfolio_leads enable row level security;

-- Permite apenas leitura (select) para usuarios autenticados
-- (quem entrar no painel com login e senha). O publico em geral
-- (role anon) nao tem nenhuma politica de leitura, entao nao
-- consegue ler nada por padrao.
create policy "Leitura para usuarios autenticados"
  on portfolio_events
  for select
  to authenticated
  using (true);

create policy "Leitura para usuarios autenticados"
  on portfolio_leads
  for select
  to authenticated
  using (true);

-- ================================================================
-- ESCRITA PUBLICA (apenas inserir, nunca ler)
--
-- O site do portfolio e 100% estatico (GitHub Pages), sem servidor
-- proprio, entao nao existe onde guardar uma chave secreta. Por
-- isso o proprio navegador do visitante grava os eventos usando a
-- chave publica (anon), mas essa chave so tem permissao de INSERIR
-- registros, nunca de ler, alterar ou apagar o que ja foi gravado.
-- Isso protege os dados: um visitante mal-intencionado pode no
-- maximo mandar linhas falsas de evento, mas nunca ver ou mexer nas
-- mensagens e estatisticas de outras pessoas.
-- ================================================================
create policy "Insercao publica de eventos"
  on portfolio_events
  for insert
  to anon
  with check (true);

create policy "Insercao publica de mensagens"
  on portfolio_leads
  for insert
  to anon
  with check (true);
