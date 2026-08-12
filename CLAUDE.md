# OZ Energia Solar — Regras de Projeto

## Projeto

Site institucional e de conversão da **OZ Energia Solar**, Cuiabá/MT.  
Serviços: projeto, venda, instalação, monitoramento e manutenção de sistemas fotovoltaicos.

**Diferencial central:** monitoramento com garantia contratual — se a conta de energia vier fora do previsto por falha da OZ, a OZ paga a diferença. Esse ponto orienta a hierarquia de copy em todas as dobras.

---

## Conceito Visual

**Instrumentação solar.** O site tem a linguagem de um instrumento de medição bem desenhado — curvas de geração, leituras, irradiância, anotações técnicas. Não é folheto.

**Marca-metáfora:** eclipse. O contraste entre claro e escuro é o princípio estruturante de cada página, seção e componente. Toda decisão visual deve ser explicável por essa metáfora.

---

## Tokens de Design

Definidos em `src/styles/tokens.css`. Usar **exclusivamente** estes valores — nenhuma cor fora da paleta.

```css
--umbra:    #121212;  /* fundo escuro principal — quase preto, não #000 puro */
--penumbra: #262626;  /* fundo escuro secundário */
--dia:      #EDEAE3;  /* texto sobre escuro */
--papel:    #F7F5F0;  /* fundo claro principal */
--grafite:  #14141C;  /* texto sobre claro */
--coroa:    #FD7018;  /* laranja de acento */
--luz:      #FFE9B0;  /* âmbar suave */
```

**Modo padrão:** claro (`--papel`, `--grafite`).  
**Escuro apenas em:** hero, seção de manutenção e rodapé.  
**`--coroa` é acento cirúrgico:** traços de 1–2 px, arcos, sublinhados e um único CTA por dobra. Nunca em blocos grandes, nunca como fundo de seção.

---

## Tipografia

| Uso | Família | Variação |
|---|---|---|
| Display / headings | Archivo (variável) | `wdth` 110–120, `wght` 600 |
| Corpo | Instrument Sans | 400 / 500 |
| Eyebrows, rótulos, unidades, números | Martian Mono | 400, caixa alta, tracking largo |

**Escala de tamanhos (px):** 72 / 56 / 40 / 28 / 20 / 17 / 15 / 13  
**Corpo:** 17 px, `line-height` 1.65, medida máxima 68 caracteres.

**Fontes proibidas:** Inter, Poppins, Montserrat, Roboto, Open Sans — e qualquer outra fora da lista acima.  
**Entrega:** fontes locais via `@fontsource-variable`.

---

## Layout e Grid

- Grid de **12 colunas assimétrico**: coluna esquerda estreita reservada para rótulos em Martian Mono; conteúdo principal deslocado para a direita.
- **Divisor de seção:** arco SVG de 1 px na cor `--coroa`. Nunca linha reta horizontal.
- Responsivo até **360 px** sem quebra de layout.

---

## Proibições Absolutas

Qualquer item abaixo invalida a entrega — refaça antes de considerar pronto.

- Emojis em qualquer lugar (código, copy, comentários visíveis ao usuário).
- Fileira de 3 ou 4 cards iguais com borda fina.
- Numeração decorativa 01 / 02 / 03 onde não há sequência real de passos.
- Fundo preto puro (`#000` ou equivalente).
- Gradiente roxo-azul.
- Ícones genéricos de "check" em círculo.
- Frases de venda vazias: "soluções inovadoras", "excelência em atendimento", "qualidade garantida", e similares.
- Texto placeholder ou lorem ipsum em qualquer estado (dev ou produção).
- Bibliotecas de componentes prontas: shadcn/ui, DaisyUI, Bootstrap, Flowbite etc.

---

## Copy

- **Idioma:** português do Brasil, sentence case.
- **Voz:** ativa, verbos simples, específico em vez de esperto.
- **Botões:** dizem exatamente o que acontece ao clicar. ("Solicitar orçamento", "Ver como funciona o monitoramento", "Falar com a equipe técnica" — nunca "Saiba mais".)
- **Números e unidades:** formatados em Martian Mono. Prefira dados reais (kWh, anos de garantia, % de economia documentada) a afirmações vagas.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Astro 5 |
| Estilos | Tailwind 4 (sem `@apply` desnecessário) |
| Tipagem | TypeScript estrito |
| Conteúdo | `src/data/*.ts` — todos os textos editáveis ficam aqui |
| Interatividade | Ilhas Astro apenas onde indispensável |
| Fontes | `@fontsource-variable/archivo`, `@fontsource/instrument-sans`, `@fontsource/martian-mono` |

---

## Qualidade

- Responsivo: testado em 360 px, 768 px, 1280 px e 1440 px.
- Foco visível no teclado em todos os elementos interativos.
- `prefers-reduced-motion` respeitado — nenhuma animação obrigatória.
- Contraste mínimo **AA** (WCAG 2.1) em todas as combinações texto/fundo.
- HTML semântico: `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<h1>`–`<h6>` em ordem lógica.

---

## Estrutura de Arquivos Esperada

```
src/
  styles/
    tokens.css       ← única fonte de verdade para cores
  data/
    *.ts             ← todo conteúdo editável (textos, números, depoimentos)
  components/
    *.astro          ← componentes sem biblioteca externa
  pages/
    index.astro
```

---

## Desenvolvimento

Ao iniciar o servidor de dev, use modo background:

```
astro dev --background
```

Gerencie o servidor com `astro dev stop`, `astro dev status` e `astro dev logs`.

Documentação completa: https://docs.astro.build

---

## Como Tomar Decisões de Design

Antes de qualquer escolha visual, responda:

1. **Isso soa como instrumentação solar ou como folheto?** Se folheto, refaça.
2. **Esse elemento existe em outro site de energia solar do Brasil?** Se sim, questione se ele deve existir aqui.
3. **O âmbar está sendo usado como acento ou como fundo?** Se fundo, remova.
4. **O copy diz algo específico ou poderia ser de qualquer empresa?** Se qualquer empresa, reescreva.
