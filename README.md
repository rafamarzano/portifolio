# Painel administrativo

Painel simples, em HTML/CSS/JS puro, para acompanhar visitas, cliques,
videos vistos e mensagens recebidas no portfolio. Usa Supabase como banco
de dados e sistema de login.

## Como publicar em 6 passos

1. **Crie as tabelas no Supabase**: entre no seu projeto em
   supabase.com, abra o SQL Editor, cole o conteudo do arquivo
   `setup.sql` e rode. Isso cria as tabelas `portfolio_events` e
   `portfolio_leads` com Row Level Security ativado.

2. **Crie o seu usuario de login**: no painel do Supabase, va em
   Authentication > Users > Add user, cadastre seu e-mail e uma senha.
   Esse sera o login usado em `login.html`.

3. **Confira as chaves em `js/auth.js`**: o arquivo ja vem configurado
   com a URL e a chave publica (anon) do projeto Supabase. Se um dia
   trocar de projeto, atualize as constantes `SUPABASE_URL` e
   `SUPABASE_ANON_KEY` no topo do arquivo.

4. **Teste localmente**: abra o arquivo `login.html` direto no
   navegador (duplo clique ou clique com o botao direito e "abrir com"
   o navegador). Entre com o e-mail e senha criados no passo 2.

5. **Publique os arquivos**: copie `login.html`, `painel.html`, a
   pasta `js/` (com `auth.js`) para a raiz do seu site publicado
   (GitHub Pages ou Vercel), junto com os demais arquivos do
   portfolio. Faca commit e push do repositorio.

6. **Acesse o painel publicado**: depois do deploy, va ate
   `seudominio.com/login.html` para entrar. Depois do login voce sera
   levado automaticamente para `painel.html`.

## Observacao importante

As tabelas so permitem leitura (select) para usuarios autenticados. A
gravacao de eventos e mensagens deve ser feita pelo lado servidor do
site (usando a service_role key do Supabase), nunca pela chave publica
usada neste painel. Veja os comentarios no final de `setup.sql` para
mais detalhes.
