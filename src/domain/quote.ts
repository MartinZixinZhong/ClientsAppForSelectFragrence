import { calculateGiftMachineCount } from './giftRules';
import type { Catalog, Machine, QuoteCart, Scenario, Scent } from './types';

export interface QuoteSummary {
  scenario: Scenario | null;
  scentItems: Array<{ scent: Scent; liters: number }>;
  machineItems: Array<{ machine: Machine; quantity: number }>;
  totalOilLiters: number;
  giftMachine: Machine | null;
  giftMachineCount: number;
}

export function buildQuoteSummary(cart: QuoteCart, catalog: Catalog): QuoteSummary {
  const scenario = catalog.scenarios.find((item) => item.id === cart.scenarioId) ?? null;
  const scentItems = cart.scents
    .map((item) => {
      const scent = catalog.scents.find((candidate) => candidate.id === item.scentId);
      return scent ? { scent, liters: item.liters } : null;
    })
    .filter((item): item is { scent: Scent; liters: number } => item !== null);

  const machineItems = cart.machines
    .map((item) => {
      const machine = catalog.machines.find((candidate) => candidate.id === item.machineId);
      return machine ? { machine, quantity: item.quantity } : null;
    })
    .filter((item): item is { machine: Machine; quantity: number } => item !== null);

  const totalOilLiters = scentItems.reduce((sum, item) => sum + item.liters, 0);
  const giftMachine = catalog.machines.find((machine) => machine.id === catalog.settings.giftMachineId) ?? null;
  const giftMachineCount = calculateGiftMachineCount(totalOilLiters, catalog.settings.giftStepLiters);

  return { scenario, scentItems, machineItems, totalOilLiters, giftMachine, giftMachineCount };
}

export function createInquiryText(cart: QuoteCart, catalog: Catalog): string {
  const summary = buildQuoteSummary(cart, catalog);
  const lines = [
    'GlassMartin 空间香氛服务询价清单',
    `使用场景：${summary.scenario?.name ?? '未选择'}`,
    `精油总升数：${summary.totalOilLiters}L`,
    ...summary.scentItems.map((item) => `精油：${item.scent.name} × ${item.liters}L`),
    ...summary.machineItems.map((item) => `扩香机：${item.machine.name} × ${item.quantity} 台`),
  ];

  if (summary.giftMachine && summary.giftMachineCount > 0) {
    lines.push(`满赠扩香机：${summary.giftMachine.name} × ${summary.giftMachineCount} 台`);
  }

  lines.push(catalog.settings.finalQuoteNotice);
  return lines.join('\n');
}
