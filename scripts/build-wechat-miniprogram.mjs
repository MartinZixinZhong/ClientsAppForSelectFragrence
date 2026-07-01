import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();

function normalizeMiniProgramImagePath(imagePath) {
  if (!imagePath) {
    return '';
  }

  return `/${String(imagePath).replace(/^\/?images\//, 'assets/images/')}`;
}

export function transformCatalogForWechat(catalog) {
  return {
    ...catalog,
    banners: (catalog.banners ?? []).map((banner) => ({
      ...banner,
      image: normalizeMiniProgramImagePath(banner.image),
    })),
    machines: (catalog.machines ?? []).map((machine) => ({
      ...machine,
      image: normalizeMiniProgramImagePath(machine.image),
    })),
  };
}

function writeCommonJsModule(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `module.exports = ${JSON.stringify(value, null, 2)};\n`, 'utf8');
}

function copyDirectory(sourcePath, targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });

  for (const entry of fs.readdirSync(sourcePath, { withFileTypes: true })) {
    const sourceEntryPath = path.join(sourcePath, entry.name);
    const targetEntryPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourceEntryPath, targetEntryPath);
      continue;
    }

    fs.copyFileSync(sourceEntryPath, targetEntryPath);
  }
}

export function buildWechatMiniProgram({ root = ROOT } = {}) {
  const sourceDataPath = path.join(root, 'public/data/products.json');
  const sourceImagesPath = path.join(root, 'public/images');
  const miniProgramLogoPath = path.join(root, 'data/source/glassmartin-miniprogram-logo.jpg');
  const miniProgramRoot = path.join(root, 'wechat-miniprogram');
  const catalog = transformCatalogForWechat(JSON.parse(fs.readFileSync(sourceDataPath, 'utf8')));

  writeCommonJsModule(path.join(miniProgramRoot, 'data/products.js'), catalog);
  copyDirectory(sourceImagesPath, path.join(miniProgramRoot, 'assets/images'));
  if (fs.existsSync(miniProgramLogoPath)) {
    fs.copyFileSync(miniProgramLogoPath, path.join(miniProgramRoot, 'assets/images/glassmartin-logo.jpg'));
  }

  return catalog;
}

if (path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildWechatMiniProgram();
  console.log('Wrote wechat-miniprogram/data/products.js and synced image assets.');
}
