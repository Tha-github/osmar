import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const ORIGEM = 'src/assets/parceiros';
const DESTINO = 'src/assets/parceiros/recortado';
const ARQUIVOS = ['banco-1.png', 'banco-2.png', 'banco-3.png'];
const LIMIAR_ALPHA = 10; // ignora pixels quase totalmente transparentes (anti-aliasing)

await mkdir(DESTINO, { recursive: true });

for (const arquivo of ARQUIVOS) {
  const caminho = `${ORIGEM}/${arquivo}`;
  const img = sharp(caminho);
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const alpha = data[idx + 3];
      if (alpha > LIMIAR_ALPHA) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    console.log(`${arquivo}: nenhum pixel visível encontrado — pulando`);
    continue;
  }

  const boxWidth = maxX - minX + 1;
  const boxHeight = maxY - minY + 1;

  // Redimensiona para uma resolução razoável — os logos são exibidos a
  // ~20-26px de altura; 600px no lado maior já cobre telas retina com
  // folga, sem carregar um PNG de vários MB para um elemento minúsculo.
  const maiorLado = Math.max(boxWidth, boxHeight);
  const escala = Math.min(1, 600 / maiorLado);
  const larguraFinal = Math.round(boxWidth * escala);
  const alturaFinal = Math.round(boxHeight * escala);

  await sharp(caminho)
    .extract({ left: minX, top: minY, width: boxWidth, height: boxHeight })
    .resize(larguraFinal, alturaFinal)
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${DESTINO}/${arquivo}`);

  console.log(
    `${arquivo}: caixa real ${boxWidth}x${boxHeight} (de ${width}x${height}) | proporção ${(boxWidth / boxHeight).toFixed(2)}`,
  );
}
