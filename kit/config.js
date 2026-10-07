// Configuração do formulário "Kit do Fabricante no Marketplace".
// Para trocar um link ou texto, edite só este arquivo.
window.KIT_CONFIG = {
  // Supabase do sistema gutto (gutto-app): URL + chave pública. A tabela leads_kit só aceita INSERT de quem
  // não está logado; os leads aparecem no CRM (Leads → Lista do kit).
  supabaseUrl: 'https://aedxvttmnjheussswyht.supabase.co',
  supabaseAnonKey: 'sb_publishable_-yM9bTw9C5-YFUUrIX5wWQ__yRSxR_M',

  // Materiais da tela final e do e-mail do kit (o sistema lê esta lista). Links vazios aparecem como "em breve".
  // icone: 'tabela' | 'calculadora' | 'checklist' | 'grafico'
  materiais: [
    {
      nome: 'Planilha de Precificação Shopee',
      descricao: 'Calcula o preço certo com comissão, taxas e frete da Shopee.',
      link: 'https://docs.google.com/spreadsheets/d/1BrRmXNAA5Q1FDQQELgpsID1pF9f7lvlZdtNjPUmMUfE/edit?gid=879261013#gid=879261013',
      icone: 'tabela',
    },
    {
      nome: 'Calculadora Reversa Shopee',
      descricao: 'Mostra quanto sobra de cada venda depois das taxas e o preço mínimo.',
      link: 'https://docs.google.com/spreadsheets/d/1RpHWe4p-feYaX_WDUmecbnqkFVec3YXdfTHFVqHLz0A/edit?usp=sharing',
      icone: 'calculadora',
    },
    {
      nome: 'Planilha de Precificação TikTok Shop',
      descricao: 'Calcula o preço ideal com comissão, taxa de envio e taxa fixa do TikTok Shop.',
      link: 'https://docs.google.com/spreadsheets/d/1wKypgrM07Crlv2_MPq2YoE6SxR6OLBWP7wFbN-lzHRo/edit?usp=sharing',
      icone: 'tabela',
    },
  ],

  // O sistema manda as planilhas por e-mail (Gmail do Bruno) assim que o lead envia o formulário.
  mostrarAvisoEmail: true,
  avisoEmail: 'Também mandamos tudo no seu e-mail.',
};
