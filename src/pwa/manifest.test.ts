/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

interface WebManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
}

interface WebManifest {
  start_url: string;
  scope: string;
  icons: WebManifestIcon[];
}

function readManifest(): WebManifest {
  return JSON.parse(readFileSync(join(process.cwd(), 'public', 'manifest.webmanifest'), 'utf8')) as WebManifest;
}

describe('manifest.webmanifest', () => {
  it('uses relative app paths so GitHub Pages installs launch inside the project', () => {
    const manifest = readManifest();

    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
  });

  it('provides complete icons for standard and maskable mobile launchers', () => {
    const manifest = readManifest();

    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: 'icons/app-icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        }),
        expect.objectContaining({
          src: 'icons/app-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        }),
        expect.objectContaining({
          src: 'icons/app-icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        }),
      ]),
    );
  });
});
