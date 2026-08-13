import { empresa } from '../data/empresa';

/**
 * Regra global do site: toda mensagem pré-preenchida de WhatsApp cita a
 * seção de onde o botão partiu (ex.: "Vim da seção Garantia do site...").
 * Fluxos com mensagem mais rica (simulador, formulário de contato) usam
 * esta linha como abertura e completam o restante da mensagem por conta
 * própria — a função abaixo cobre os botões simples de uma seção só.
 */
export function mensagemSecao(secao: string): string {
  return `Olá! Vim da seção ${secao} do site e quero saber mais.`;
}

export function linkWhatsapp(mensagem: string): string {
  return `https://wa.me/55${empresa.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * Nome de exibição de cada seção, indexado pelo id do <section> na página —
 * usado pelo botão flutuante para saber de qual seção o visitante partiu
 * (ele não pertence a uma seção fixa, então detecta por scroll).
 */
export const secaoPorId: Record<string, string> = {
  inicio: 'Início',
  garantia: 'Garantia',
  argumentos: 'Retorno do investimento',
  'como-funciona': 'Como funciona',
  manutencao: 'Monitoramento e manutenção',
  simulador: 'Simulador',
  'formas-de-pagamento': 'Formas de pagamento',
  'para-quem': 'Para quem',
  sobre: 'Sobre',
  faq: 'Perguntas frequentes',
  contato: 'Contato',
};
