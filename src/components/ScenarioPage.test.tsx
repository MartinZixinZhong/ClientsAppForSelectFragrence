import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ScenarioPage } from './ScenarioPage';
import type { Catalog } from '../domain/types';

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
      id: 'gm051801',
      name: '威斯汀白茶 / Westin White Tea',
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
      name: 'GAS-501F 插电蓝牙 WiFi 4G 款',
      image: '/images/machines/gas-501f.jpg',
      coverageText: '500-1000m³',
      sellingPoints: ['蓝牙', 'WiFi'],
      scenarioIds: ['hotel'],
      isRecommended: true,
      isGiftMachine: true,
    },
  ],
  packages: [],
};

describe('ScenarioPage', () => {
  it('uses tabs to separate scent selection from diffuser machines', async () => {
    render(
      <ScenarioPage
        catalog={catalog}
        scenarioId="hotel"
        scentLiters={{}}
        machineQuantities={{}}
        onChangeScentLiters={vi.fn()}
        onChangeMachineQuantity={vi.fn()}
        onBackHome={vi.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: '选择香型和用量' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: '查看香薰扩香机' })).toBeInTheDocument();
    expect(screen.getByText('威斯汀白茶 / Westin White Tea')).toBeInTheDocument();
    expect(screen.queryByText('GAS-501F 插电蓝牙 WiFi 4G 款')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: '查看香薰扩香机' }));

    expect(screen.getByRole('tab', { name: '查看香薰扩香机' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('GAS-501F 插电蓝牙 WiFi 4G 款')).toBeInTheDocument();
    expect(screen.queryByText('威斯汀白茶 / Westin White Tea')).not.toBeInTheDocument();
  });
});
