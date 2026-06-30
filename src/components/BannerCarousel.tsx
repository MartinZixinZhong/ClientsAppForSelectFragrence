import { useEffect, useMemo, useState } from 'react';
import type { Banner } from '../domain/types';

interface BannerCarouselProps {
  banners: Banner[];
  onSelectTarget: (banner: Banner) => void;
}

export function BannerCarousel({ banners, onSelectTarget }: BannerCarouselProps) {
  const enabledBanners = useMemo(
    () => banners.filter((banner) => banner.enabled).slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [banners],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (enabledBanners.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % enabledBanners.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [enabledBanners.length]);

  if (enabledBanners.length === 0) {
    return null;
  }

  const activeBanner = enabledBanners[activeIndex] ?? enabledBanners[0];

  return (
    <section className="banner-carousel" role="region" aria-label="品牌广告轮播">
      <button className="banner-slide" type="button" onClick={() => onSelectTarget(activeBanner)}>
        <img src={activeBanner.image} alt={activeBanner.title} />
        <span className="banner-overlay">
          <span className="eyebrow">GlassMartin Campaign</span>
          <strong>{activeBanner.title}</strong>
          <span>{activeBanner.subtitle}</span>
        </span>
      </button>
      {enabledBanners.length > 1 ? (
        <div className="banner-dots" aria-label="广告轮播切换">
          {enabledBanners.map((banner, index) => (
            <button
              aria-label={`显示广告：${banner.title}`}
              className={index === activeIndex ? 'active' : ''}
              key={banner.id}
              type="button"
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
