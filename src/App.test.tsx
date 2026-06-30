import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { loadCatalog } from './data/loadCatalog';
import type { Catalog } from './domain/types';

vi.mock('./data/loadCatalog', () => ({
  loadCatalog: vi.fn(),
}));

const catalog: Catalog = {
  settings: {
    brandName: 'GlassMartin',
    brandSubtitle: '澳洲品牌 · 空间香氛服务',
    giftStepLiters: 3,
    giftMachineId: 'gas-501f',
    finalQuoteNotice: '最终报价以 GlassMartin 确认方案为准。',
  },
  promotion: { enabled: false, title: '近期大促', body: '活动', buttonText: '查看推荐方案' },
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
  machines: [],
  packages: [],
};

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.mocked(loadCatalog).mockResolvedValue(catalog);
  });

  it('starts on the home page even when a previous cart selected a scenario', async () => {
    window.localStorage.setItem(
      'glassmartin.quoteCart',
      JSON.stringify({
        scenarioId: 'hotel',
        scents: [{ scentId: 'white-tea-hotel', liters: 6 }],
        machines: [],
      }),
    );

    render(<App />);

    expect(await screen.findByText('选择你的商业场景')).toBeInTheDocument();
    expect(screen.queryByText('返回首页')).not.toBeInTheDocument();
  });
});
