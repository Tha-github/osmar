/**
 * Instituições financeiras parceiras (faixa de credibilidade após "Formas
 * de pagamento"). Para adicionar ou remover um banco, só mexa aqui e na
 * pasta src/assets/parceiros/ — o componente lê os arquivos por nome via
 * import.meta.glob, sem precisar de alteração própria.
 *
 * Os arquivos em src/assets/parceiros/*.png já vêm recortados e
 * redimensionados (ver scripts/recortar-logos.mjs) — sem a margem
 * transparente enorme dos originais, que estão arquivados em
 * src/assets/parceiros/original/ caso precise re-processar.
 *
 * alturaOptica / proporcao: cada logo tem uma altura em px E uma proporção
 * largura/altura própria — não é uma escala matemática igual para todos.
 * Wordmarks horizontais precisam de mais altura para "pesar" o mesmo que
 * um símbolo compacto no mesmo espaço. `proporcao` vem da caixa real do
 * conteúdo (não do canvas do arquivo, que tem margem enorme). Ajustar caso
 * a caso ao trocar por outro logo. Nunca abaixo de 20px de altura.
 *
 * link: nulo até termos autorização expressa da instituição para linkar
 * para o site dela. Logo clicável sem autorização é problema jurídico —
 * não preencher "no chute".
 */
export interface Parceiro {
  nome: string;
  arquivo: string;
  alt: string;
  alturaOptica: number;
  proporcao: number;
  link: string | null;
}

export const parceiros: Parceiro[] = [
  {
    // Consórcio Nacional Solar (Conasol), by Consórcio União.
    // O nome da instituição contém "consórcio" — isso está impresso no
    // próprio logo (pixels da imagem), fora do nosso controle de copy.
    // O alt abaixo evita escrever a palavra por nossa conta; o que
    // aparece visualmente na imagem não dá para editar sem alterar a
    // marca de um parceiro real.
    nome: 'Conasol',
    arquivo: 'banco-1.png',
    alt: 'Logotipo da Conasol',
    alturaOptica: 26,
    proporcao: 2400 / 488,
    link: null,
  },
  {
    nome: 'Banco BV',
    arquivo: 'banco-2.png',
    alt: 'Logotipo do Banco BV',
    alturaOptica: 20,
    proporcao: 1532 / 1112,
    link: null,
  },
  {
    nome: 'Santander Financiamentos',
    arquivo: 'banco-3.png',
    alt: 'Logotipo do Santander Financiamentos',
    alturaOptica: 23,
    proporcao: 2400 / 686,
    link: null,
  },
];

export const parceirosTitulo = 'Financiamento aprovado com';
