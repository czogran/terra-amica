import { readdir, mkdir, stat, rename, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import sharp from 'sharp';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

let totalOriginalSize = 0;
let totalCompressedSize = 0;
let processedCount = 0;
let skippedCount = 0;

function bytesToMb(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

async function compressImage(inputPath, outputPath) {
  const ext = extname(inputPath).toLowerCase();
  let pipeline = sharp(inputPath).withMetadata({});

  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  }

  await pipeline.toFile(outputPath);
}

async function main() {
  const realisationDir = process.argv[2];

  if (!realisationDir) {
    console.error('Usage: node scripts/compress-original.mjs <realisation-directory>');
    console.error('Example: node scripts/compress-original.mjs src/assets/realisations/powiat-parczewski-2022');
    process.exit(1);
  }

  const originalDir = join(realisationDir, 'original');
  const compressedDir = join(realisationDir, 'compressed');

  if (!existsSync(originalDir)) {
    console.error(`Directory not found: ${originalDir}`);
    process.exit(1);
  }

  await mkdir(compressedDir, { recursive: true });

  const entries = await readdir(originalDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const ext = extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const inputPath = join(originalDir, entry.name);
    const outputPath = join(compressedDir, entry.name);

    if (existsSync(outputPath)) {
      skippedCount++;
      continue;
    }

    const origStat = await stat(inputPath);

    await compressImage(inputPath, outputPath);

    const compStat = await stat(outputPath);

    if (compStat.size > origStat.size) {
      await rm(outputPath);
      console.log(`  ${entry.name}  ${bytesToMb(origStat.size)}MB  (skipped — already optimized)`);
      skippedCount++;
      continue;
    }

    totalOriginalSize += origStat.size;
    totalCompressedSize += compStat.size;

    const saved = ((1 - compStat.size / origStat.size) * 100).toFixed(1);
    console.log(`  ${entry.name}  ${bytesToMb(origStat.size)}MB \u2192 ${bytesToMb(compStat.size)}MB  (-${saved}%)`);
    processedCount++;
  }

  const totalSaved = totalOriginalSize > 0
    ? ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)
    : '0.0';

  console.log(`\nDone. Compressed ${processedCount} images (${skippedCount} skipped).`);
  console.log(`Total: ${bytesToMb(totalOriginalSize)}MB \u2192 ${bytesToMb(totalCompressedSize)}MB  (-${totalSaved}%)`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
