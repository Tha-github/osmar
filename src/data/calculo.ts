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

// Custo médio de mercado por kWp instalado (equipamento + projeto + mão de
// obra) para sistemas residenciais/comerciais de pequeno porte no Brasil,
// 2026. Sistemas maiores tendem a ter custo por kWp menor — não modelado
// aqui, para manter a estimativa simples e conservadora.
export const CUSTO_MEDIO_POR_KWP = 5000;

export const DIAS_POR_MES = 30;

export const VALOR_CONTA_MIN = 200;
export const VALOR_CONTA_MAX = 20000;
export const VALOR_CONTA_PASSO = 50;
export const VALOR_CONTA_PADRAO = 450;

export interface ResultadoSimulacao {
  potenciaSugeridaKwp: number;
  economiaMensal: number;
  /** Soma simples de 25 anos de economia mensal, sem projetar reajuste
   *  tarifário futuro — número conservador de propósito. */
  economia25Anos: number;
  paybackAnos: number;
}

export function calcularSimulacao(valorContaMensal: number, tipoImovel: TipoImovel): ResultadoSimulacao {
  const multiplicadorTipo = MULTIPLICADOR_TARIFA_POR_TIPO[tipoImovel];
  const tarifaEfetivaKwh = TARIFA_BASE_KWH * MULTIPLICADOR_IMPOSTOS * multiplicadorTipo;

  const consumoMensalKwh = valorContaMensal / tarifaEfetivaKwh;
  const geracaoDiariaNecessariaKwh = consumoMensalKwh / DIAS_POR_MES;
  const potenciaSugeridaKwp = geracaoDiariaNecessariaKwh / (IRRADIANCIA_KWH_M2_DIA * FATOR_DESEMPENHO_SISTEMA);

  const economiaMensal = valorContaMensal * PERCENTUAL_ECONOMIA_CONTA;
  const economia25Anos = economiaMensal * 12 * 25;

  const investimentoEstimado = potenciaSugeridaKwp * CUSTO_MEDIO_POR_KWP;
  const paybackAnos = investimentoEstimado / (economiaMensal * 12);

  return { potenciaSugeridaKwp, economiaMensal, economia25Anos, paybackAnos };
}
