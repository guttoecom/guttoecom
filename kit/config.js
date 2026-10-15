// Configuração do formulário "Calculadora do Fabricante" (antigo Kit do Fabricante).
// Para trocar um link ou texto, edite só este arquivo.
window.KIT_CONFIG = {
  // Supabase do sistema gutto (gutto-app): URL + chave pública. A tabela leads_kit só aceita INSERT de quem
  // não está logado; os leads aparecem no CRM (Leads → Lista do kit).
  supabaseUrl: 'https://aedxvttmnjheussswyht.supabase.co',
  supabaseAnonKey: 'sb_publishable_-yM9bTw9C5-YFUUrIX5wWQ__yRSxR_M',

  // Para onde a pessoa vai depois de enviar o formulário.
  destino: 'https://guttoecom.com.br/calculadora?utm_source=kit&utm_medium=formulario&utm_campaign=calculadora_fabricante',

  // O que vai no e-mail do kit (o sistema lê esta lista). Só itens com link são enviados.
  // Mantenha a ordem nome, descricao, link e as aspas simples: o e-mail lê este bloco como texto.
  materiais: [
    {
      nome: 'Calculadora do Fabricante',
      descricao: 'Preço certo e quanto sobra em cada venda na Shopee e no TikTok Shop, com comissão, taxas, imposto, Ads e afiliado.',
      link: 'https://guttoecom.com.br/calculadora?utm_source=kit&utm_medium=email&utm_campaign=calculadora_fabricante',
      icone: 'calculadora',
    },
  ],

  // O sistema manda o link por e-mail (Gmail do Bruno) assim que o lead envia o formulário.
  mostrarAvisoEmail: true,
  avisoEmail: 'Também mandamos o link no seu e-mail.',
};
