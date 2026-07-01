import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const miniRoot = path.join(root, 'wechat-miniprogram');
const PREVIEW_SOURCE_LIMIT_BYTES = 2 * 1024 * 1024;

function sumFileBytes(directory) {
  let total = 0;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      total += sumFileBytes(entryPath);
    } else {
      total += fs.statSync(entryPath).size;
    }
  }

  return total;
}

describe('wechat miniprogram structure', () => {
  it('declares pages that all have js, wxml, and wxss files', () => {
    const appJson = JSON.parse(fs.readFileSync(path.join(miniRoot, 'app.json'), 'utf8'));

    for (const page of appJson.pages) {
      expect(fs.existsSync(path.join(miniRoot, `${page}.js`)), `${page}.js`).toBe(true);
      expect(fs.existsSync(path.join(miniRoot, `${page}.wxml`)), `${page}.wxml`).toBe(true);
      expect(fs.existsSync(path.join(miniRoot, `${page}.wxss`)), `${page}.wxss`).toBe(true);
    }
  });

  it('contains local data and image assets for offline miniprogram preview', () => {
    expect(fs.existsSync(path.join(miniRoot, 'data/products.js'))).toBe(true);
    expect(fs.existsSync(path.join(miniRoot, 'assets/images/glassmartin-logo.jpg'))).toBe(true);
    expect(fs.existsSync(path.join(miniRoot, 'assets/images/banners/hotel-lobby.jpg'))).toBe(true);
    expect(fs.existsSync(path.join(miniRoot, 'assets/images/machines/gas-501f.jpg'))).toBe(true);
  });

  it('uses the official miniprogram AppID', () => {
    const projectConfig = JSON.parse(fs.readFileSync(path.join(miniRoot, 'project.config.json'), 'utf8'));

    expect(projectConfig.appid).toBe('wx45368fc509491335');
    expect(projectConfig.compileType).toBe('miniprogram');
  });

  it('keeps preview source size under the WeChat 2MB limit', () => {
    expect(sumFileBytes(miniRoot)).toBeLessThan(PREVIEW_SOURCE_LIMIT_BYTES);
  });
});
