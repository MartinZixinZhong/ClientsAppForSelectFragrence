import { describe, expect, it } from 'vitest';
import { rowsToCatalog } from './excel-to-products.mjs';

describe('rowsToCatalog', () => {
  it('converts workbook rows into catalog JSON', () => {
    const catalog = rowsToCatalog({
      scenes: [{ id: 'hotel', name: '酒店 / 大堂 / 走廊', subtitle: '酒店场景', sortOrder: 1 }],
      scents: [
        {
          id: 'white-tea-hotel',
          name: '白茶酒店香',
          description: '干净柔和',
          toneNote: '茶香',
          scenarioIds: 'hotel,office',
          isRecommended: 'TRUE',
          isRegularStock: 'TRUE',
          isInquiryOnly: 'FALSE',
          priceTiers: '1-3L:参考区间价;4-9L:参考区间价;10L+:参考区间价',
        },
      ],
      machines: [
        {
          id: 'gas-501f',
          model: 'GAS-501F',
          name: 'GAS-501F 插电蓝牙 APP 款',
          image: '/images/machines/gas-501f.jpg',
          coverageText: '中小型商业空间',
          sellingPoints: '插电使用,蓝牙连接,APP 控制',
          scenarioIds: 'hotel,office',
          isRecommended: 'TRUE',
          isGiftMachine: 'TRUE',
        },
      ],
      packages: [
        {
          id: 'hotel-basic',
          name: '酒店大堂基础方案',
          scenarioId: 'hotel',
          description: '基础询价方案',
          scentIds: 'white-tea-hotel',
          suggestedLiters: 5,
          machineItems: 'gas-501f:1',
        },
      ],
      settings: [
        {
          brandName: 'GlassMartin',
          brandSubtitle: '澳洲品牌 · 空间香氛服务',
          giftStepLiters: 3,
          giftMachineId: 'gas-501f',
          finalQuoteNotice: '最终报价以 GlassMartin 确认方案为准。',
        },
      ],
      promotions: [
        {
          enabled: 'TRUE',
          title: '近期大促',
          body: '采购满指定金额/升数，可赠送 GAS-501F 插电蓝牙 APP 款扩香机。',
          buttonText: '查看推荐方案',
        },
      ],
    });

    expect(catalog.settings.giftStepLiters).toBe(3);
    expect(catalog.scents[0].scenarioIds).toEqual(['hotel', 'office']);
    expect(catalog.scents[0].priceTiers[2]).toEqual({
      minLiters: 10,
      maxLiters: null,
      label: '10L+',
      referencePriceText: '参考区间价',
    });
    expect(catalog.machines[0].isGiftMachine).toBe(true);
    expect(catalog.packages[0].machineItems).toEqual([{ machineId: 'gas-501f', quantity: 1 }]);
  });
});
