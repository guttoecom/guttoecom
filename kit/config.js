// Configuração do formulário "Kit do Fabricante no Marketplace".
// Para trocar um link ou texto, edite só este arquivo.
window.KIT_CONFIG = {
  // Supabase: URL do projeto + chave pública (anon). A tabela leads_kit só aceita INSERT.
  supabaseUrl: 'https://hklkhaitkzzkdlftiubn.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbGtoYWl0a3p6a2RsZnRpdWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NzAwMjQsImV4cCI6MjEwNjQ0NjAyNH0.vW4l7hKUjLgyp2Ffp0qqXfsXwB_B_LKIrTWRl6vQayo',

  // Materiais da tela final. Links vazios aparecem como "em breve".
  materiais: [
    {
      nome: 'Planilha de Precificação por Marketplace',
      descricao: 'Calcula o preço certo com taxas, comissão e frete de cada canal.',
      link: '', // [LINK_1]
    },
    {
      nome: 'Checklist de Anúncio Otimizado',
      descricao: 'Tudo que um anúncio de moda precisa pra aparecer e vender.',
      link: '', // [LINK_2]
    },
    {
      nome: 'Guia Rápido de Ads no Marketplace',
      descricao: 'Como investir em mídia no marketplace sem queimar margem.',
      link: '', // [LINK_3]
    },
  ],

  // Ligar quando o envio do kit por e-mail estiver pronto.
  mostrarAvisoEmail: false,
  avisoEmail: 'Também mandamos tudo no seu e-mail.',
};
