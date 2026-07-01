import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QuoteCart } from './QuoteCart';
import type { Catalog, QuoteCart as QuoteCartState } from '../domain/types';

const toPngMock = vi.hoisted(() =>
  vi.fn(async (_node: HTMLElement, _options?: Record<string, unknown>) => 'data:image/png;base64,glassmartin'),
);

vi.mock('html-to-image', () => ({
  toPng: toPngMock,
}));

const catalog: Catalog = {
  settings: {
    brandName: 'GlassMartin',
    brandSubtitle: '澳洲品牌 · 空间香氛服务',
    giftStepLiters: 3,
    giftMachineId: 'gas-501f',
    finalQuoteNotice: '最终报价以 GlassMartin 确认方案为准。',
  },
  promotion: { enabled: true, title: '近期大促', body: '活动', buttonText: '查看推荐方案' },
  scenarios: [{ id: 'hotel', name: '酒店 / 大堂 / 走廊', subtitle: '酒店场景', sortOrder: 1 }],
  banners: [],
  scents: [
    {
      id: 'white-tea-hotel',
      name: '白茶酒店香',
      description: '',
      toneNote: '',
      scenarioIds: ['hotel'],
      isRecommended: true,
      isRegularStock: true,
      isInquiryOnly: false,
      priceTiers: [],
    },
  ],
  machines: [
    {
      id: 'gas-501f',
      model: 'GAS-501F',
      name: 'GAS-501F 插电蓝牙 APP 款',
      image: '',
      coverageText: '',
      sellingPoints: [],
      scenarioIds: ['hotel'],
      isRecommended: true,
      isGiftMachine: true,
    },
  ],
  packages: [],
};

describe('QuoteCart', () => {
  beforeEach(() => {
    toPngMock.mockClear();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows gift count based on total liters', () => {
    const cart: QuoteCartState = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 6 }],
      machines: [],
    };

    const { container } = render(<QuoteCart cart={cart} catalog={catalog} onClose={vi.fn()} onClear={vi.fn()} />);

    expect(container.querySelector('.gift-line')).toHaveTextContent('满赠扩香机：GAS-501F 插电蓝牙 APP 款 × 2 台');
  });

  it('captures a temporary on-page image node instead of the offscreen hidden source', async () => {
    const cart: QuoteCartState = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 3 }],
      machines: [],
    };

    render(<QuoteCart cart={cart} catalog={catalog} onClose={vi.fn()} onClear={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: '生成图片' }));

    await waitFor(() => expect(toPngMock).toHaveBeenCalledTimes(1));
    const capturedNode = toPngMock.mock.calls[0]?.[0] as HTMLElement;

    expect(capturedNode).toHaveClass('quote-image-capture-stage');
    expect(capturedNode).not.toHaveClass('quote-image-hidden');
    expect(capturedNode.textContent).toContain('空间香氛服务询价清单');
    expect(document.querySelector('.quote-image-capture-stage')).not.toBeInTheDocument();
  });

  it('confirms before clearing the purchase list', async () => {
    const onClear = vi.fn();
    const onClose = vi.fn();
    const cart: QuoteCartState = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 3 }],
      machines: [{ machineId: 'gas-501f', quantity: 1 }],
    };
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<QuoteCart cart={cart} catalog={catalog} onClose={onClose} onClear={onClear} />);

    await userEvent.click(screen.getByRole('button', { name: '清空采购清单' }));

    expect(window.confirm).toHaveBeenCalledWith('确定要清空当前采购清单吗？');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
