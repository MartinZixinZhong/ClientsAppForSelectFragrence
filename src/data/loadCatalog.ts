import type { Catalog } from '../domain/types';

export function getCatalogDataUrl(baseUrl = import.meta.env.BASE_URL): string {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBaseUrl}data/products.json`;
}

export async function loadCatalog(): Promise<Catalog> {
  const response = await fetch(getCatalogDataUrl());
  if (!response.ok) {
    throw new Error('无法加载产品数据，请稍后重试。');
  }

  return (await response.json()) as Catalog;
}
