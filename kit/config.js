// Configuração do formulário "Kit do Fabricante no Marketplace".
// Para trocar um link ou texto, edite só este arquivo.
window.KIT_CONFIG = {
  // Supabase: URL do projeto + chave pública (anon). A tabela leads_kit só aceita INSERT.
  supabaseUrl: 'https://hklkhaitkzzkdlftiubn.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbGtoYWl0a3p6a2RsZnRpdWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NzAwMjQsImV4cCI6MjEwNjQ0NjAyNH0.vW4l7hKUjLgyp2Ffp0qqXfsXwB_B_LKIrTWRl6vQayo',

  // Materiais da tela final. Links vazios aparecem como "em breve".
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
    {
      nome: 'Checklist de Anúncio Otimizado',
      descricao: 'Tudo que um anúncio de moda precisa pra aparecer e vender.',
      link: '', // [LINK_2]
      icone: 'checklist',
    },
    {
      nome: 'Guia Rápido de Ads no Marketplace',
      descricao: 'Como investir em mídia no marketplace sem queimar margem.',
      link: '', // [LINK_3]
      icone: 'grafico',
    },
  ],

  // Ligar quando o envio do kit por e-mail estiver pronto.
  mostrarAvisoEmail: false,
  avisoEmail: 'Também mandamos tudo no seu e-mail.',
};
