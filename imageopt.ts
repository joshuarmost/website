// Run with: npm run start:images
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import * as glob from 'glob';

// Source and output folders
const SOURCE_DIR = './public/jpg';
const OUTPUT_DIR = './public/images';
const MAX_WIDTH = 1920;
const QUALITY = 60;

// Ensure output folder exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function optimizeImages() {
  // glob already supports promise API in recent versions
  const files = await glob.glob(`${SOURCE_DIR}/**/*.{jpg,jpeg}`);

  for (const file of files) {
    try {
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);
      const outputPath = path.join(OUTPUT_DIR, `${baseName}.avif`);

      let image = sharp(file);

      const metadata = await image.metadata();
      if (metadata.width > MAX_WIDTH) {
        image = image.resize({ width: MAX_WIDTH });
      }

      await image.avif({ quality: QUALITY }).toFile(outputPath);

      console.log(`Optimized: ${outputPath}`);
    } catch (e) {
      console.error(`Failed to process ${file}:`, e);
    }
  }

  console.log('All images optimized and exported to /images!');
}

// Run the function
optimizeImages();
