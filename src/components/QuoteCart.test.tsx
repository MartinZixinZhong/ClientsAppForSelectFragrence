import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QuoteCart } from './QuoteCart';
import type { Catalog, QuoteCart as QuoteCartState } from '../domain/types';

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
  it('shows gift count based on total liters', () => {
    const cart: QuoteCartState = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 6 }],
      machines: [],
    };

    const { container } = render(<QuoteCart cart={cart} catalog={catalog} onClose={vi.fn()} />);

    expect(container.querySelector('.gift-line')).toHaveTextContent('满赠扩香机：GAS-501F 插电蓝牙 APP 款 × 2 台');
  });
});
