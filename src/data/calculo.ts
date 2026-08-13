/**
 * Constantes do simulador de economia. Isoladas aqui, uma por uma
 * comentada, para facilitar ajuste futuro sem tocar na lógica ou no
 * componente. Tarifas de energia e custos de instalação mudam com
 * frequência — revisar estes valores periodicamente.
 */

export type TipoImovel = 'residencia' | 'comercio' | 'industria' | 'rural';

export const TIPOS_IMOVEL: { valor: TipoImovel; rotulo: string }[] = [
  { valor: 'residencia', rotulo: 'Residência' },
  { valor: 'comercio', rotulo: 'Comércio' },
  { valor: 'industria', rotulo: 'Indústria' },
  { valor: 'rural', rotulo: 'Rural' },
];

// Irradiância solar média diária em Cuiabá/MT, em kWh/m².dia (HSP) — o
// mesmo valor usado no eyebrow do hero e na assinatura do rodapé.
export const IRRADIANCIA_KWH_M2_DIA = 5.4;

// Fator de desempenho do sistema (performance ratio): perdas de inversor,
// cabeamento, temperatura dos módulos e sujeira acumulada. Valor típico
// para sistemas bem instalados e mantidos: 75%–80%.
export const FATOR_DESEMPENHO_SISTEMA = 0.78;

// Tarifa de energia (TUSD + TE) da Energisa Mato Grosso, classe B1
// residencial, sem impostos — Resolução Homologatória da ANEEL vigente
// desde 08/04/2026. Reajustada anualmente em abril; conferir valor atual
// em aneel.gov.br antes de cada revisão deste arquivo.
export const TARIFA_BASE_KWH = 0.899;

// Multiplicador aproximado para chegar à tarifa final paga pelo cliente,
// incluindo ICMS, PIS/COFINS e contribuição de iluminação pública. A
// alíquota exata varia por faixa de consumo e não é pública por classe —
// este é um valor médio de mercado, não uma fonte oficial da distribuidora.
export const MULTIPLICADOR_IMPOSTOS = 1.27;

// Tarifa média usada só para converter entre R$ e kWh na entrada do
// simulador (alternância de unidade "conta em R$" / "consumo em kWh").
// Não é a tarifa efetiva do dimensionamento, que ainda é ajustada por tipo
// de imóvel logo abaixo.
export const TARIFA_MEDIA_KWH = TARIFA_BASE_KWH * MULTIPLICADOR_IMPOSTOS;

export function reaisParaKwh(valorReais: number): number {
  return valorReais / TARIFA_MEDIA_KWH;
}

export function kwhParaReais(consumoKwh: number): number {
  return consumoKwh * TARIFA_MEDIA_KWH;
}

// Ajuste de tarifa por tipo de imóvel. A tarifa rural (classe B2) tem
// desconto regulatório em relação à residencial (B1). Comércio e indústria
// de baixa tensão (grupo B) ficam próximos da tarifa residencial neste
// modelo simplificado — não diferenciamos por não termos dado segmentado
// confiável para essas duas classes especificamente.
export const MULTIPLICADOR_TARIFA_POR_TIPO: Record<TipoImovel, number> = {
  residencia: 1,
  comercio: 1,
  industria: 1,
  rural: 0.88,
};

// Percentual da conta compensado pela geração própria. Não é 100% porque:
// (a) o cliente continua pagando o custo mínimo de disponibilidade da
// rede, e (b) a Lei 14.300/2022 instituiu cobrança progressiva do "Fio B"
// sobre a energia injetada para novas instalações, reduzindo a compensação
// em relação às regras antigas de net metering. Simplificação: não
// modelamos o cronograma exato de instalação.
export const PERCENTUAL_ECONOMIA_CONTA = 0.88;

// Custo médio por kWp instalado usado no cálculo de payback. Calibrado
// para reproduzir o cenário de referência aprovado pelo cliente — conta de
// R$ 1.200/mês, imóvel residencial, payback em torno de 20 meses — e não
// uma pesquisa independente de mercado. Revalidar com o cliente antes de
// qualquer ajuste, pois o número de meses de payback já foi aprovado por ele.
export const CUSTO_MEDIO_POR_KWP = 2540;

export const DIAS_POR_MES = 30;

export const VALOR_CONTA_MIN = 200;
export const VALOR_CONTA_MAX = 20000;
export const VALOR_CONTA_PASSO = 50;
export const VALOR_CONTA_PADRAO = 450;

// Bandas equivalentes em kWh para a entrada alternativa do simulador —
// derivadas dos limites em R$ pela tarifa média, para os dois modos do
// slider cobrirem sempre a mesma faixa real de contas atendidas.
export const CONSUMO_KWH_MIN = Math.round(reaisParaKwh(VALOR_CONTA_MIN));
export const CONSUMO_KWH_MAX = Math.round(reaisParaKwh(VALOR_CONTA_MAX));
export const CONSUMO_KWH_PASSO = 50;

/**
 * REGRA DE DIMENSIONAMENTO VALIDADA PELO CLIENTE — relação entre consumo
 * mensal (kWh) e potência sugerida (kWp). Isolada nesta função porque essa
 * proporção específica foi conferida e aprovada pelo cliente; qualquer
 * ajuste futuro nela precisa ser revalidado com ele antes de alterar.
 */
export function potenciaSugeridaPorConsumo(consumoMensalKwh: number): number {
  const geracaoDiariaNecessariaKwh = consumoMensalKwh / DIAS_POR_MES;
  return geracaoDiariaNecessariaKwh / (IRRADIANCIA_KWH_M2_DIA * FATOR_DESEMPENHO_SISTEMA);
}

export interface ResultadoSimulacao {
  potenciaSugeridaKwp: number;
  economiaMensal: number;
  /** Soma simples de 25 anos de economia mensal, sem projetar reajuste
   *  tarifário futuro — número conservador de propósito. */
  economia25Anos: number;
  /** Meses é o valor canônico; anos é sempre derivado dele (nunca
   *  calculado separadamente), para os dois nunca divergirem na tela. */
  paybackMeses: number;
  paybackAnos: number;
}

export function calcularSimulacao(valorContaMensal: number, tipoImovel: TipoImovel): ResultadoSimulacao {
  const multiplicadorTipo = MULTIPLICADOR_TARIFA_POR_TIPO[tipoImovel];
  const tarifaEfetivaKwh = TARIFA_BASE_KWH * MULTIPLICADOR_IMPOSTOS * multiplicadorTipo;

  const consumoMensalKwh = valorContaMensal / tarifaEfetivaKwh;
  const potenciaSugeridaKwp = potenciaSugeridaPorConsumo(consumoMensalKwh);

  const economiaMensal = valorContaMensal * PERCENTUAL_ECONOMIA_CONTA;
  const economia25Anos = economiaMensal * 12 * 25;

  const investimentoEstimado = potenciaSugeridaKwp * CUSTO_MEDIO_POR_KWP;
  const paybackMeses = investimentoEstimado / economiaMensal;
  const paybackAnos = paybackMeses / 12;

  return { potenciaSugeridaKwp, economiaMensal, economia25Anos, paybackMeses, paybackAnos };
}
