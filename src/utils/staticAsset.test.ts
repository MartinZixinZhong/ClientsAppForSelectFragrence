import { describe, expect, it } from 'vitest';
import { withBasePath } from './staticAsset';

describe('withBasePath', () => {
  it('prefixes root-relative image paths with the deployment base path', () => {
    expect(withBasePath('/images/banners/hotel-lobby.jpg', '/ClientsAppForSelectFragrence/')).toBe(
      '/ClientsAppForSelectFragrence/images/banners/hotel-lobby.jpg',
    );
  });

  it('keeps root deployments root-relative', () => {
    expect(withBasePath('/images/glassmartin-logo.jpg', '/')).toBe('/images/glassmartin-logo.jpg');
  });

  it('does not change external or data URLs', () => {
    expect(withBasePath('https://example.com/image.jpg', '/ClientsAppForSelectFragrence/')).toBe(
      'https://example.com/image.jpg',
    );
    expect(withBasePath('data:image/png;base64,abc', '/ClientsAppForSelectFragrence/')).toBe(
      'data:image/png;base64,abc',
    );
  });
});
