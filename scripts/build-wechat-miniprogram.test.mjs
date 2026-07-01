import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildWechatMiniProgram, transformCatalogForWechat } from './build-wechat-miniprogram.mjs';

const tempRoots = [];

function makeTempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'glassmartin-wechat-'));
  tempRoots.push(root);
  return root;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

describe('buildWechatMiniProgram', () => {
  afterEach(() => {
    for (const root of tempRoots.splice(0)) {
      fs.rmSync(root, { force: true, recursive: true });
    }
  });

  it('rewrites web image paths to miniprogram asset paths', () => {
    const catalog = {
      banners: [{ image: '/images/banners/hotel-lobby.jpg' }],
      machines: [{ image: 'images/machines/gas-501f.jpg' }],
    };

    const transformed = transformCatalogForWechat(catalog);

    expect(transformed.banners[0].image).toBe('/assets/images/banners/hotel-lobby.jpg');
    expect(transformed.machines[0].image).toBe('/assets/images/machines/gas-501f.jpg');
  });

  it('writes local catalog data and copies public images into the miniprogram', () => {
    const root = makeTempRoot();
    const catalog = {
      settings: { brandName: 'GlassMartin' },
      promotion: { enabled: true },
      scenarios: [],
      banners: [{ image: '/images/banners/hotel-lobby.jpg' }],
      scents: [],
      machines: [{ image: '/images/machines/gas-501f.jpg' }],
      packages: [],
    };

    writeFile(path.join(root, 'public/data/products.json'), JSON.stringify(catalog));
    writeFile(path.join(root, 'data/source/glassmartin-miniprogram-logo.jpg'), 'mini-logo');
    writeFile(path.join(root, 'public/images/glassmartin-logo.jpg'), 'logo');
    writeFile(path.join(root, 'public/images/banners/hotel-lobby.jpg'), 'banner');
    writeFile(path.join(root, 'public/images/machines/gas-501f.jpg'), 'machine');

    buildWechatMiniProgram({ root });

    const productsJs = fs.readFileSync(path.join(root, 'wechat-miniprogram/data/products.js'), 'utf8');

    expect(productsJs).toContain('module.exports = ');
    expect(productsJs).toContain('/assets/images/banners/hotel-lobby.jpg');
    expect(fs.readFileSync(path.join(root, 'wechat-miniprogram/assets/images/glassmartin-logo.jpg'), 'utf8')).toBe(
      'mini-logo',
    );
    expect(fs.existsSync(path.join(root, 'wechat-miniprogram/assets/images/machines/gas-501f.jpg'))).toBe(true);
  });
});
