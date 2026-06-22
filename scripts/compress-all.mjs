import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const ASSETS_DIR = 'src/assets';
const REALISATION_DIRS = ['realisations', 'current-realisations'];

const SKIP = new Set(['index.json']);

async function main() {
  const dirs = [];

  for (const parent of REALISATION_DIRS) {
    const parentPath = join(ASSETS_DIR, parent);
    const entries = await readdir(parentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (SKIP.has(entry.name)) continue;
      if (!entry.isDirectory()) continue;

      // verify it has an original/ subdirectory
      try {
        await stat(join(parentPath, entry.name, 'original'));
        dirs.push(join(parentPath, entry.name));
      } catch {
        // skip directories without original/
      }
    }
  }

  console.log(`Found ${dirs.length} realisation directories with originals.\n`);

  for (const dir of dirs) {
    console.log(`\n=== ${dir.replace(/\\/g, '/')} ===`);
    execSync(`node scripts/compress-original.mjs "${dir}"`, {
      stdio: 'inherit',
    });
  }

  console.log('\nAll done.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
