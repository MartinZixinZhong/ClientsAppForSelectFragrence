import { describe, expect, it } from 'vitest';
import { getCatalogDataUrl } from './loadCatalog';

describe('getCatalogDataUrl', () => {
  it('uses the configured base path for GitHub Pages deployments', () => {
    expect(getCatalogDataUrl('/ClientsAppForSelectFragrence/')).toBe(
      '/ClientsAppForSelectFragrence/data/products.json',
    );
  });

  it('keeps the root path for local and root deployments', () => {
    expect(getCatalogDataUrl('/')).toBe('/data/products.json');
  });
});
