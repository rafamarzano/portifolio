/* ================================================================
   AUTENTICAÇÃO COMPARTILHADA (Supabase)
   Usado por login.html e painel.html. Configure aqui a URL e a
   chave pública (anon) do seu projeto Supabase — são valores
   públicos, seguros para ficar no navegador, desde que o Row Level
   Security das tabelas esteja ativado (ver setup.sql).
   ================================================================ */
const SUPABASE_URL = "https://yoqariscwuozvgpbdazh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvcWFyaXNjd3VvenZncGJkYXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2Nzk5OTAsImV4cCI6MjEwMDI1NTk5MH0.VI1H1VktNlYFW5TpJybxt4lYtMCT3O1roJW7sp3JnH0";

// Cria o cliente Supabase uma única vez, compartilhado por todas as páginas
// que carregarem este arquivo (login.html e painel.html).
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.Auth = {
  // Faz login com e-mail e senha. Lança um Error com mensagem amigável em
  // português quando as credenciais estão erradas.
  async login(email, senha) {
    const { data, error } = await sb.auth.signInWithPassword({
      email: email,
      password: senha,
    });
    if (error) {
      if (error.message === "Invalid login credentials") {
        throw new Error("E-mail ou senha incorretos.");
      }
      throw new Error(error.message);
    }
    return data.user;
  },

  // Guarda de autenticação: roda no topo do painel. Se não houver sessão
  // ativa, redireciona para o login e devolve null (quem chamar deve
  // parar a execução nesse caso).
  async checkAuth() {
    const { data } = await sb.auth.getSession();
    if (!data.session) {
      window.location.href = "login.html";
      return null;
    }
    return data.session.user;
  },

  // Encerra a sessão e volta para o login.
  async logout() {
    await sb.auth.signOut();
    window.location.href = "login.html";
  },

  // Envia o e-mail de redefinição de senha.
  async recuperarSenha(email) {
    const { error } = await sb.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  },
};
