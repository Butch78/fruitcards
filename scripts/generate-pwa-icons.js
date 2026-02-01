import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <text x="256" y="360" font-family="Arial, sans-serif" font-size="300" fill="white" text-anchor="middle">🍎</text>
</svg>`;

const sizes = [192, 512];

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = join(publicDir, `pwa-${size}x${size}.png`);
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: pwa-${size}x${size}.png`);
  }

  // Also generate apple-touch-icon
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated: apple-touch-icon.png');
}

generateIcons().catch(console.error);
