import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

const module = { exports: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(process.cwd(), 'wechat-miniprogram/utils/quote.js'), 'utf8'),
  { module, exports: module.exports },
);
const {
  buildQuoteSummary,
  calculateCartCount,
  clearCart,
  createInquiryText,
  upsertMachineQuantity,
  upsertScentLiters,
} = module.exports;

const catalog = {
  settings: {
    brandName: 'GlassMartin',
    giftStepLiters: 3,
    giftMachineId: 'gas-501f',
    finalQuoteNotice: '最终报价以 GlassMartin 确认方案为准。',
  },
  scenarios: [{ id: 'hotel', name: '酒店 / 大堂 / 走廊' }],
  scents: [{ id: 'white-tea', name: '威斯汀白茶', priceTiers: [] }],
  machines: [{ id: 'gas-501f', name: 'GAS-501F 插电蓝牙 APP 款', isGiftMachine: true }],
};

describe('wechat miniprogram quote utilities', () => {
  it('updates scent liters and machine quantities while dropping zero values', () => {
    const cart = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea', liters: 1 }],
      machines: [{ machineId: 'gas-501f', quantity: 1 }],
    };

    const withoutScent = upsertScentLiters(cart, 'white-tea', 0);
    const withMachine = upsertMachineQuantity(withoutScent, 'gas-501f', 2);

    expect(withoutScent.scents).toEqual([]);
    expect(withMachine.machines).toEqual([{ machineId: 'gas-501f', quantity: 2 }]);
    expect(calculateCartCount(withMachine)).toBe(1);
  });

  it('summarizes gifted machine counts by every 3 liters', () => {
    const summary = buildQuoteSummary(
      {
        scenarioId: 'hotel',
        scents: [{ scentId: 'white-tea', liters: 6 }],
        machines: [],
      },
      catalog,
    );

    expect(summary.totalOilLiters).toBe(6);
    expect(summary.giftMachineCount).toBe(2);
    expect(summary.giftMachine.name).toBe('GAS-501F 插电蓝牙 APP 款');
  });

  it('creates inquiry text and clears the whole cart', () => {
    const cart = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea', liters: 3 }],
      machines: [{ machineId: 'gas-501f', quantity: 1 }],
    };

    expect(createInquiryText(cart, catalog)).toContain('满赠扩香机：GAS-501F 插电蓝牙 APP 款 × 1 台');
    expect(clearCart()).toEqual({ scenarioId: null, scents: [], machines: [] });
  });
});
