const EXTERNAL_URL_PATTERN = /^(https?:)?\/\//;

export function withBasePath(path: string, baseUrl = import.meta.env.BASE_URL): string {
  if (EXTERNAL_URL_PATTERN.test(path) || path.startsWith('data:')) {
    return path;
  }

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return `${normalizedBaseUrl}${normalizedPath}`;
}
