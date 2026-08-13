import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  TIPOS_IMOVEL,
  VALOR_CONTA_MIN,
  VALOR_CONTA_MAX,
  VALOR_CONTA_PASSO,
  VALOR_CONTA_PADRAO,
  CONSUMO_KWH_MIN,
  CONSUMO_KWH_MAX,
  CONSUMO_KWH_PASSO,
  reaisParaKwh,
  kwhParaReais,
  calcularSimulacao,
  type TipoImovel,
} from '../data/calculo';
import { linkWhatsapp } from '../lib/whatsapp';

type UnidadeEntrada = 'reais' | 'kwh';

const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const formatoUmaCasa = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatoInteiro = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
});

/** Anima um número até o valor-alvo em `duracaoMs`, com easing de saída.
 *  Pula direto para o valor final se o usuário preferir menos movimento. */
function useContagemAnimada(valorAlvo: number, duracaoMs = 600): number {
  const [valorExibido, setValorExibido] = useState(valorAlvo);
  const valorAnteriorRef = useRef(valorAlvo);
  const frameRef = useRef(0);

  useEffect(() => {
    const reduzMovimento =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduzMovimento) {
      valorAnteriorRef.current = valorAlvo;
      setValorExibido(valorAlvo);
      return;
    }

    const valorInicial = valorAnteriorRef.current;
    const diferenca = valorAlvo - valorInicial;
    if (diferenca === 0) return;

    const inicioTempo = performance.now();

    function animar(agora: number) {
      const progresso = Math.min((agora - inicioTempo) / duracaoMs, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      setValorExibido(valorInicial + diferenca * suavizado);

      if (progresso < 1) {
        frameRef.current = requestAnimationFrame(animar);
      } else {
        valorAnteriorRef.current = valorAlvo;
      }
    }

    frameRef.current = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frameRef.current);
  }, [valorAlvo, duracaoMs]);

  return valorExibido;
}

function lerNumeroDoInput(evento: Event): number {
  const alvo = evento.currentTarget as HTMLInputElement;
  return Number(alvo.value);
}

function lerTextoDoInput(evento: Event): string {
  const alvo = evento.currentTarget as HTMLInputElement;
  return alvo.value;
}

export default function SimuladorEconomia() {
  const [valorConta, setValorConta] = useState(VALOR_CONTA_PADRAO);
  const [unidade, setUnidade] = useState<UnidadeEntrada>('reais');
  const [tipoImovel, setTipoImovel] = useState<TipoImovel>('residencia');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cidade, setCidade] = useState('');

  const resultado = useMemo(() => calcularSimulacao(valorConta, tipoImovel), [valorConta, tipoImovel]);

  const potenciaAnimada = useContagemAnimada(resultado.potenciaSugeridaKwp);
  const economiaMensalAnimada = useContagemAnimada(resultado.economiaMensal);
  const economia25AnosAnimada = useContagemAnimada(resultado.economia25Anos);
  // Anos é sempre derivado dos meses animados (não tem sua própria animação),
  // pra payback em meses e em anos nunca mostrarem números inconsistentes.
  const paybackMesesAnimado = useContagemAnimada(resultado.paybackMeses);
  const paybackAnosAnimado = paybackMesesAnimado / 12;

  function aoMudarValorConta(valor: number) {
    if (Number.isNaN(valor)) return;
    setValorConta(Math.min(VALOR_CONTA_MAX, Math.max(VALOR_CONTA_MIN, valor)));
  }

  function aoMudarConsumoKwh(consumoKwh: number) {
    if (Number.isNaN(consumoKwh)) return;
    const consumoClamped = Math.min(CONSUMO_KWH_MAX, Math.max(CONSUMO_KWH_MIN, consumoKwh));
    aoMudarValorConta(kwhParaReais(consumoClamped));
  }

  const consumoKwhExibido = reaisParaKwh(valorConta);

  const podeEnviar = nome.trim().length > 1 && whatsapp.trim().length >= 8;

  function enviarProposta() {
    if (!podeEnviar) return;

    const tipoRotulo = TIPOS_IMOVEL.find((tipo) => tipo.valor === tipoImovel)?.rotulo ?? tipoImovel;

    const mensagem = [
      'Olá! Vim da seção Simulador do site. Simulei minha economia e quero uma proposta detalhada.',
      '',
      `Nome: ${nome}`,
      `Cidade: ${cidade.trim() || 'não informada'}`,
      `WhatsApp para contato: ${whatsapp}`,
      `Tipo de imóvel: ${tipoRotulo}`,
      `Conta média informada: ${formatoMoeda.format(valorConta)}`,
      '',
      'Resultado da simulação:',
      `- Potência sugerida: ${formatoUmaCasa.format(resultado.potenciaSugeridaKwp)} kWp`,
      `- Economia mensal estimada: ${formatoMoeda.format(resultado.economiaMensal)}`,
      `- Economia em 25 anos: ${formatoMoeda.format(resultado.economia25Anos)}`,
      `- Payback estimado: ${formatoInteiro.format(resultado.paybackMeses)} meses (≈ ${formatoUmaCasa.format(resultado.paybackAnos)} anos)`,
    ].join('\n');

    const link = linkWhatsapp(mensagem);
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  return (
    <section id="simulador" class="section-y bg-papel text-grafite">
      <div class="mx-auto max-w-7xl px-6 md:px-10">
        <div class="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div class="text-center md:col-span-5 md:text-left">
            <span class="font-mono text-mono uppercase tracking-widest text-grafite/60">Simulador</span>
            <h2 class="font-display mt-3 text-display-lg">Quanto você pode economizar?</h2>

            <div class="mt-10">
              <span class="font-mono text-mono uppercase tracking-widest text-grafite/60">Unidade</span>
              <div
                role="group"
                aria-label="Unidade de entrada"
                class="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start"
              >
                <button
                  type="button"
                  aria-pressed={unidade === 'reais'}
                  onClick={() => setUnidade('reais')}
                  class={
                    unidade === 'reais'
                      ? 'border-b-2 border-grafite pb-1 text-body-sm font-medium text-grafite'
                      : 'border-b-2 border-transparent pb-1 text-body-sm text-grafite/60 transition hover:border-grafite/30 hover:text-grafite'
                  }
                >
                  Valor da conta (R$)
                </button>
                <button
                  type="button"
                  aria-pressed={unidade === 'kwh'}
                  onClick={() => setUnidade('kwh')}
                  class={
                    unidade === 'kwh'
                      ? 'border-b-2 border-grafite pb-1 text-body-sm font-medium text-grafite'
                      : 'border-b-2 border-transparent pb-1 text-body-sm text-grafite/60 transition hover:border-grafite/30 hover:text-grafite'
                  }
                >
                  Consumo (kWh)
                </button>
              </div>
            </div>

            {unidade === 'reais' ? (
              <div class="mt-8">
                <label
                  for="valor-conta-slider"
                  class="font-mono text-mono uppercase tracking-widest text-grafite/60"
                >
                  Valor médio da conta de luz
                </label>

                <p class="font-mono mt-3 text-display-md tabular-nums">{formatoMoeda.format(valorConta)}</p>

                <input
                  id="valor-conta-slider"
                  type="range"
                  min={VALOR_CONTA_MIN}
                  max={VALOR_CONTA_MAX}
                  step={VALOR_CONTA_PASSO}
                  value={valorConta}
                  onInput={(e) => aoMudarValorConta(lerNumeroDoInput(e))}
                  class="simulador-slider mt-4"
                />

                <div class="mt-2 flex items-center justify-between font-mono text-mono text-grafite/60">
                  <span>{formatoMoeda.format(VALOR_CONTA_MIN)}</span>
                  <span>{formatoMoeda.format(VALOR_CONTA_MAX)}</span>
                </div>

                <label for="valor-conta-numero" class="mt-4 block text-body-sm text-grafite/70">
                  Ou digite o valor exato
                </label>
                <input
                  id="valor-conta-numero"
                  type="number"
                  min={VALOR_CONTA_MIN}
                  max={VALOR_CONTA_MAX}
                  step={VALOR_CONTA_PASSO}
                  value={valorConta}
                  onInput={(e) => aoMudarValorConta(lerNumeroDoInput(e))}
                  class="mx-auto mt-2 w-36 border border-grafite/20 bg-transparent px-3 py-2 text-body-sm text-grafite md:mx-0"
                />
              </div>
            ) : (
              <div class="mt-8">
                <label
                  for="consumo-kwh-slider"
                  class="font-mono text-mono uppercase tracking-widest text-grafite/60"
                >
                  Consumo médio mensal
                </label>

                <p class="font-mono mt-3 text-display-md tabular-nums">
                  {formatoInteiro.format(consumoKwhExibido)}
                  <span class="text-body-lg"> kWh</span>
                </p>

                <input
                  id="consumo-kwh-slider"
                  type="range"
                  min={CONSUMO_KWH_MIN}
                  max={CONSUMO_KWH_MAX}
                  step={CONSUMO_KWH_PASSO}
                  value={consumoKwhExibido}
                  onInput={(e) => aoMudarConsumoKwh(lerNumeroDoInput(e))}
                  class="simulador-slider mt-4"
                />

                <div class="mt-2 flex items-center justify-between font-mono text-mono text-grafite/60">
                  <span>{formatoInteiro.format(CONSUMO_KWH_MIN)} kWh</span>
                  <span>{formatoInteiro.format(CONSUMO_KWH_MAX)} kWh</span>
                </div>

                <label for="consumo-kwh-numero" class="mt-4 block text-body-sm text-grafite/70">
                  Ou digite o valor exato
                </label>
                <input
                  id="consumo-kwh-numero"
                  type="number"
                  min={CONSUMO_KWH_MIN}
                  max={CONSUMO_KWH_MAX}
                  step={CONSUMO_KWH_PASSO}
                  value={Math.round(consumoKwhExibido)}
                  onInput={(e) => aoMudarConsumoKwh(lerNumeroDoInput(e))}
                  class="mx-auto mt-2 w-36 border border-grafite/20 bg-transparent px-3 py-2 text-body-sm text-grafite md:mx-0"
                />
              </div>
            )}

            <div class="mt-10">
              <span class="font-mono text-mono uppercase tracking-widest text-grafite/60">Tipo de imóvel</span>
              <div
                role="group"
                aria-label="Tipo de imóvel"
                class="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start"
              >
                {TIPOS_IMOVEL.map((tipo) => (
                  <button
                    type="button"
                    key={tipo.valor}
                    aria-pressed={tipoImovel === tipo.valor}
                    onClick={() => setTipoImovel(tipo.valor)}
                    class={
                      tipoImovel === tipo.valor
                        ? 'border-b-2 border-grafite pb-1 text-body-sm font-medium text-grafite'
                        : 'border-b-2 border-transparent pb-1 text-body-sm text-grafite/60 transition hover:border-grafite/30 hover:text-grafite'
                    }
                  >
                    {tipo.rotulo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div class="text-center md:col-span-6 md:col-start-7 md:text-left">
            <div class="border-l-2 border-coroa bg-grafite/[0.03] px-6 py-8 md:px-8">
              <div class="grid grid-cols-1 gap-y-8">
                <div>
                  <span class="font-mono text-mono uppercase tracking-widest text-grafite/60">
                    Potência sugerida
                  </span>
                  <p class="font-mono mt-2 whitespace-nowrap text-display-md tabular-nums">
                    {formatoUmaCasa.format(potenciaAnimada)}
                    <span class="text-body-lg"> kWp</span>
                  </p>
                </div>
                <div>
                  <span class="font-mono text-mono uppercase tracking-widest text-grafite/60">
                    Payback estimado
                  </span>
                  <p class="font-mono mt-2 whitespace-nowrap text-display-md tabular-nums">
                    {formatoInteiro.format(paybackMesesAnimado)}
                    <span class="text-body-lg"> meses</span>
                  </p>
                  <p class="font-mono mt-1 whitespace-nowrap text-body-sm tabular-nums text-grafite/60">
                    ≈ {formatoUmaCasa.format(paybackAnosAnimado)} anos
                  </p>
                </div>
                <div>
                  <span class="font-mono text-mono uppercase tracking-widest text-grafite/60">Economia mensal</span>
                  <p class="font-mono mt-2 whitespace-nowrap text-display-md tabular-nums">
                    {formatoMoeda.format(economiaMensalAnimada)}
                  </p>
                </div>
                <div>
                  <span class="font-mono text-mono uppercase tracking-widest text-grafite/60">
                    Economia em 25 anos
                  </span>
                  <p class="font-mono mt-2 whitespace-nowrap text-display-md tabular-nums">
                    {formatoMoeda.format(economia25AnosAnimada)}
                  </p>
                </div>
              </div>

              <p class="mt-8 text-mono text-grafite/60">
                Estimativa. O valor final depende de uma análise técnica do seu consumo e do seu telhado.
              </p>
            </div>

            <div class="mt-8">
              {!mostrarFormulario ? (
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(true)}
                  class="rounded-sm bg-coroa px-6 py-3 text-body-sm font-medium text-grafite transition hover:brightness-95"
                >
                  Receber proposta detalhada
                </button>
              ) : (
                <div class="mx-auto max-w-md text-left md:mx-0">
                  <div class="flex flex-col gap-4">
                    <div>
                      <label for="campo-nome" class="text-body-sm text-grafite/70">
                        Nome
                      </label>
                      <input
                        id="campo-nome"
                        type="text"
                        value={nome}
                        onInput={(e) => setNome(lerTextoDoInput(e))}
                        class="mt-1 w-full border border-grafite/20 bg-transparent px-3 py-2 text-body-sm text-grafite"
                      />
                    </div>
                    <div>
                      <label for="campo-whatsapp" class="text-body-sm text-grafite/70">
                        WhatsApp
                      </label>
                      <input
                        id="campo-whatsapp"
                        type="tel"
                        value={whatsapp}
                        onInput={(e) => setWhatsapp(lerTextoDoInput(e))}
                        placeholder="(65) 90000-0000"
                        class="mt-1 w-full border border-grafite/20 bg-transparent px-3 py-2 text-body-sm text-grafite"
                      />
                    </div>
                    <div>
                      <label for="campo-cidade" class="text-body-sm text-grafite/70">
                        Cidade
                      </label>
                      <input
                        id="campo-cidade"
                        type="text"
                        value={cidade}
                        onInput={(e) => setCidade(lerTextoDoInput(e))}
                        class="mt-1 w-full border border-grafite/20 bg-transparent px-3 py-2 text-body-sm text-grafite"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!podeEnviar}
                      onClick={enviarProposta}
                      class="mt-2 self-start rounded-sm bg-coroa px-6 py-3 text-body-sm font-medium text-grafite transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Enviar e continuar no WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
