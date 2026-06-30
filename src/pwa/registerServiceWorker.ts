import { withBasePath } from '../utils/staticAsset';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(withBasePath('/sw.js'));
    });
  }
}
