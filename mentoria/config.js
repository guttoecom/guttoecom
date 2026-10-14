// Configuração da aplicação da Mentoria de Marketplace (/mentoria).
window.MENTORIA_CONFIG = {
  // Supabase do sistema gutto (gutto-app): URL + chave pública. A tabela aplicacoes_mentoria só aceita INSERT
  // de quem não está logado; oferta, temperatura e lead de agência são calculadas no banco.
  supabaseUrl: 'https://aedxvttmnjheussswyht.supabase.co',
  supabaseKey: 'sb_publishable_-yM9bTw9C5-YFUUrIX5wWQ__yRSxR_M',
  // WhatsApp do Bruno (DDI + DDD + número): o botão de cada oferta abre a conversa com a mensagem pronta.
  whatsapp: '5516992117706',
};
