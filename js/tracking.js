/* ================================================================
   RASTREAMENTO DE VISITAS (Supabase)
   Registra visitas, cliques em botoes, videos assistidos e
   mensagens recebidas, para aparecerem no painel administrativo
   (painel.html). Usa a chave publica (anon) do Supabase, que so
   tem permissao de INSERIR nessas tabelas, nunca de ler o que ja
   foi gravado, entao e segura para ficar no navegador do visitante.
   ================================================================ */
const TRACKING_SUPABASE_URL = "https://yoqariscwuozvgpbdazh.supabase.co";
const TRACKING_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvcWFyaXNjd3VvenZncGJkYXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2Nzk5OTAsImV4cCI6MjEwMDI1NTk5MH0.VI1H1VktNlYFW5TpJybxt4lYtMCT3O1roJW7sp3JnH0";

const trackingClient = window.supabase.createClient(TRACKING_SUPABASE_URL, TRACKING_SUPABASE_ANON_KEY);

// Um id por aba/sessao do navegador, para contar visitantes unicos
function obterSessionId() {
  let id = sessionStorage.getItem("rm_session_id");
  if (!id) {
    id = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : Date.now() + "-" + Math.random().toString(16).slice(2);
    sessionStorage.setItem("rm_session_id", id);
  }
  return id;
}

window.Tracking = {
  // Registra um evento (visita, clique em botao ou video assistido).
  // Nunca lanca erro: se o Supabase falhar, o site continua normal.
  async evento(eventType, eventName, metadata) {
    try {
      await trackingClient.from("portfolio_events").insert({
        event_type: eventType,
        event_name: eventName || null,
        session_id: obterSessionId(),
        page_path: window.location.pathname,
        metadata: metadata || null,
      });
    } catch (e) {
      /* falha silenciosa de proposito */
    }
  },

  // Registra uma mensagem recebida (formulario de contato ou popup).
  async lead(dados) {
    try {
      await trackingClient.from("portfolio_leads").insert(dados);
    } catch (e) {
      /* falha silenciosa de proposito */
    }
  },
};

// Registra a visita assim que o script carrega
window.Tracking.evento("page_view");
