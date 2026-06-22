import { readdir, mkdir, stat, rename, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, relative, dirname } from 'node:path';
import sharp from 'sharp';

const ASSETS_DIR = 'src/assets';
const ORYGINAL_DIR = 'oryginal';
const COMPRESSED_DIR = 'compressed';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

const SKIP_DIRS = new Set([
  'i18n',
  'contact',
  'jobs',
  'offer',
  'privacy-policy',
  ORYGINAL_DIR,
  COMPRESSED_DIR,
]);

let totalOriginalSize = 0;
let totalCompressedSize = 0;
let processedCount = 0;
let skippedCount = 0;

function bytesToMb(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

async function findImages(dir) {
  const images = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const subImages = await findImages(fullPath);
      images.push(...subImages);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        images.push(fullPath);
      }
    }
  }

  return images;
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

async function processAssetDir(assetDirName) {
  const assetDir = join(ASSETS_DIR, assetDirName);
  const oryginalBase = join(assetDir, ORYGINAL_DIR);
  const compressedBase = join(assetDir, COMPRESSED_DIR);

  const images = await findImages(assetDir);

  if (images.length === 0) {
    return;
  }

  console.log(`\n${assetDirName}/`);

  for (const imagePath of images) {
    const relativePath = relative(assetDir, imagePath);
    const oryginalPath = join(oryginalBase, relativePath);
    const compressedPath = join(compressedBase, relativePath);

    if (existsSync(compressedPath)) {
      skippedCount++;
      continue;
    }

    await mkdir(dirname(oryginalPath), { recursive: true });
    await mkdir(dirname(compressedPath), { recursive: true });

    const origStat = await stat(imagePath);

    await rename(imagePath, oryginalPath);

    await compressImage(oryginalPath, compressedPath);

    const compStat = await stat(compressedPath);

    if (compStat.size > origStat.size) {
      await rm(compressedPath);
      await rename(oryginalPath, imagePath);
      console.log(`  ${relativePath}  ${bytesToMb(origStat.size)}MB  (skipped — already optimized)`);
      skippedCount++;
      continue;
    }

    totalOriginalSize += origStat.size;
    totalCompressedSize += compStat.size;

    const saved = ((1 - compStat.size / origStat.size) * 100).toFixed(1);
    console.log(`  ${relativePath}  ${bytesToMb(origStat.size)}MB → ${bytesToMb(compStat.size)}MB  (-${saved}%)`);
    processedCount++;
  }
}

async function main() {
  const assetDirs = await readdir(ASSETS_DIR, { withFileTypes: true });

  for (const entry of assetDirs) {
    if (!entry.isDirectory()) continue;
    if (SKIP_DIRS.has(entry.name)) continue;

    await processAssetDir(entry.name);
  }

  const totalSaved = totalOriginalSize > 0
    ? ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)
    : '0.0';

  console.log(`\nDone. Compressed ${processedCount} images (${skippedCount} skipped).`);
  console.log(`Total: ${bytesToMb(totalOriginalSize)}MB → ${bytesToMb(totalCompressedSize)}MB  (-${totalSaved}%)`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
