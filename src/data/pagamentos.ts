export const pagamentos = {
  eyebrow: 'Formas de pagamento',
  titulo: 'Quatro caminhos até o seu sistema.',

  modalidades: [
    {
      rotulo: 'Menor custo total',
      titulo: 'À vista',
      texto: 'Vamos buscar a melhor oferta disponível no mercado.',
      textoExpandido:
        'Sem juros de cartão nem de financiamento, o valor à vista reduz o investimento total em relação a qualquer forma parcelada. É a opção de menor custo final, para quem já tem o valor disponível.',
    },
    {
      rotulo: 'Até 18x',
      titulo: 'Cartão de crédito',
      texto: 'Parcelado em até 18 meses, direto no cartão — sem sair de casa.',
      textoExpandido:
        'Parcelamos em até 18 meses direto na maquininha ou por link de pagamento, sem burocracia extra e sem precisar assinar contrato de financiamento. É a forma mais rápida de fechar negócio, do orçamento à instalação.',
    },
    {
      rotulo: 'Parceria bancária',
      titulo: 'Financiamento',
      texto: 'Parceria com vários bancos e carência de até 120 dias para pagar a primeira parcela.',
      textoExpandido:
        'Trabalhamos com bancos parceiros especializados em financiamento de energia solar. Depois da análise de crédito, você tem carência de até 120 dias antes de começar a pagar — o sistema já gerando enquanto a primeira parcela ainda não venceu.',
    },
  ],

  // Nunca usar a palavra "consórcio" em nenhum lugar do site (copy, alt,
  // title, meta) — o termo correto é sempre "compra programada".
  compraProgramada: {
    titulo: 'Compra programada',
    texto:
      'Parcelas mensais sem os juros de um financiamento tradicional. A contemplação — quando o crédito é liberado para a instalação — é garantida até a 4ª parcela, prevista em contrato.',
    textoExpandido:
      'Você entra no grupo e paga parcelas mensais fixas, sem os juros de um financiamento tradicional. O prazo para a contemplação — a liberação do crédito para a instalação — está definido em contrato: no mais tardar, na 4ª parcela.',
  },

  escada: [
    { mes: 1, percentual: 25 },
    { mes: 2, percentual: 50 },
    { mes: 3, percentual: 75 },
    { mes: 4, percentual: 100 },
  ] as const,

  // VALIDAR COM A ADMINISTRADORA ANTES DE PUBLICAR
  avisoLegal:
    'Condições conforme contrato. Percentuais e prazo de contemplação seguem as regras da administradora.',

  cta: {
    label: 'Falar com um consultor sobre pagamento',
  },
} as const;
