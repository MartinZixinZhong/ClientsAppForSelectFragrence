import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('labels the cart button as a purchase list', () => {
    render(
      <Header
        brandName="GlassMartin"
        brandSubtitle="澳洲品牌 · 空间香氛服务"
        cartCount={2}
        onOpenCart={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: '采购清单 2' })).toBeInTheDocument();
  });
});
