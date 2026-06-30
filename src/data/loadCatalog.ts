import type { Catalog } from '../domain/types';

export async function loadCatalog(): Promise<Catalog> {
  const response = await fetch('/data/products.json');
  if (!response.ok) {
    throw new Error('无法加载产品数据，请稍后重试。');
  }

  return (await response.json()) as Catalog;
}
