import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BannerCarousel } from './BannerCarousel';
import type { Banner } from '../domain/types';

const banners: Banner[] = [
  {
    id: 'hotel-promo',
    title: '酒店空间香氛方案',
    subtitle: '让客户一进门就记住你的空间气味',
    image: '/images/banners/hotel-lobby.jpg',
    linkType: 'scenario',
    targetId: 'hotel',
    sortOrder: 1,
    enabled: true,
  },
  {
    id: 'entertainment-promo',
    title: '娱乐空间香氛方案',
    subtitle: '适合 KTV、酒吧、台球和网咖',
    image: '/images/banners/entertainment.jpg',
    linkType: 'scenario',
    targetId: 'entertainment',
    sortOrder: 2,
    enabled: true,
  },
];

describe('BannerCarousel', () => {
  it('renders enabled banners above the scenario chooser', () => {
    render(<BannerCarousel banners={banners} onSelectTarget={vi.fn()} />);

    expect(screen.getByRole('region', { name: '品牌广告轮播' })).toBeInTheDocument();
    expect(screen.getByText('酒店空间香氛方案')).toBeInTheDocument();
    expect(screen.getByAltText('酒店空间香氛方案')).toHaveAttribute('src', '/images/banners/hotel-lobby.jpg');
  });
});
