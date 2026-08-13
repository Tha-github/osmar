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
