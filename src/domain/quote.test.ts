import { describe, expect, it } from 'vitest';
import type { Catalog, QuoteCart } from './types';
import { buildQuoteSummary, createInquiryText } from './quote';

const catalog = {
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
} satisfies Catalog;

describe('buildQuoteSummary', () => {
  it('totals liters and calculates one gift machine per full 3L', () => {
    const cart: QuoteCart = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 6 }],
      machines: [{ machineId: 'gas-501f', quantity: 1 }],
    };

    const summary = buildQuoteSummary(cart, catalog);

    expect(summary.totalOilLiters).toBe(6);
    expect(summary.giftMachineCount).toBe(2);
    expect(summary.giftMachine?.model).toBe('GAS-501F');
  });
});

describe('createInquiryText', () => {
  it('creates WeChat-friendly inquiry text', () => {
    const cart: QuoteCart = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 3 }],
      machines: [],
    };

    expect(createInquiryText(cart, catalog)).toContain('满赠扩香机：GAS-501F 插电蓝牙 APP 款 × 1 台');
  });
});
