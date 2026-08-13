export const empresa = {
  nome: 'OZ Energia Solar',

  // PROVISÓRIO — confirmar número definitivo antes de publicar.
  telefone: '65993091856',
  // PROVISÓRIO — confirmar número definitivo antes de publicar.
  whatsapp: '65993091856',

  email: 'contato@ozenergiasolar.com.br',

  // PROVISÓRIO — substituir pelo CNPJ real antes de publicar.
  cnpj: '00.000.000/0001-00',

  endereco: {
    logradouro: 'Rua Cordová, 510',
    bairro: 'Planalto',
    cidade: 'Cuiabá',
    estado: 'MT',
    cep: '78058-753',
    pais: 'BR',
  },

  // PROVISÓRIO — coordenadas do centro de Cuiabá, não geocodificadas para o
  // endereço exato. Substituir por lat/long precisos do endereço antes de
  // publicar (ex.: pesquisando o endereço no Google Maps e copiando as
  // coordenadas do link).
  geo: {
    latitude: -15.59611,
    longitude: -56.09667,
  },

  horarioFuncionamento: 'Das 8h às 17h30',

  // Estrutura usada no schema.org LocalBusiness (openingHoursSpecification).
  horario: {
    dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const,
    abre: '08:00',
    fecha: '17:30',
  },

  redesSociais: {
    instagram: '@ozenergiasolar',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61560437069615&locale=pt_BR',
  },

  regiaoAtendida: 'Cuiabá e cidades adjacentes',
} as const;

export type Empresa = typeof empresa;
