function emptyCart() {
  return {
    scenarioId: null,
    scents: [],
    machines: [],
  };
}

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function upsertScentLiters(cart, scentId, liters) {
  const nextLiters = toNumber(liters);
  return {
    ...cart,
    scents: [
      ...(cart.scents || []).filter((item) => item.scentId !== scentId),
      { scentId, liters: nextLiters },
    ].filter((item) => item.liters > 0),
  };
}

function upsertMachineQuantity(cart, machineId, quantity) {
  const nextQuantity = Math.floor(toNumber(quantity));
  return {
    ...cart,
    machines: [
      ...(cart.machines || []).filter((item) => item.machineId !== machineId),
      { machineId, quantity: nextQuantity },
    ].filter((item) => item.quantity > 0),
  };
}

function findById(items, id) {
  return (items || []).find((item) => item.id === id) || null;
}

function buildQuoteSummary(cart, catalog) {
  const scenario = findById(catalog.scenarios, cart.scenarioId);
  const scentItems = (cart.scents || [])
    .map((item) => ({
      scent: findById(catalog.scents, item.scentId),
      liters: toNumber(item.liters),
    }))
    .filter((item) => item.scent && item.liters > 0);
  const machineItems = (cart.machines || [])
    .map((item) => ({
      machine: findById(catalog.machines, item.machineId),
      quantity: Math.floor(toNumber(item.quantity)),
    }))
    .filter((item) => item.machine && item.quantity > 0);
  const totalOilLiters = scentItems.reduce((total, item) => total + item.liters, 0);
  const giftMachine = findById(catalog.machines, catalog.settings.giftMachineId);
  const giftStepLiters = toNumber(catalog.settings.giftStepLiters) || 3;

  return {
    scenario,
    scentItems,
    machineItems,
    totalOilLiters,
    giftMachine,
    giftMachineCount: giftMachine ? Math.floor(totalOilLiters / giftStepLiters) : 0,
  };
}

function createInquiryText(cart, catalog) {
  const summary = buildQuoteSummary(cart, catalog);
  const lines = [
    `${catalog.settings.brandName} 空间香氛服务询价`,
    `使用场景：${summary.scenario ? summary.scenario.name : '未选择'}`,
    `精油总升数：${summary.totalOilLiters}L`,
  ];

  summary.scentItems.forEach((item) => {
    lines.push(`精油：${item.scent.name} × ${item.liters}L`);
  });
  summary.machineItems.forEach((item) => {
    lines.push(`扩香机：${item.machine.name} × ${item.quantity} 台`);
  });
  if (summary.giftMachine && summary.giftMachineCount > 0) {
    lines.push(`满赠扩香机：${summary.giftMachine.name} × ${summary.giftMachineCount} 台`);
  }
  lines.push(catalog.settings.finalQuoteNotice);

  return lines.join('\n');
}

function calculateCartCount(cart) {
  return (cart.scents || []).length + (cart.machines || []).length;
}

function clearCart() {
  return emptyCart();
}

module.exports = {
  buildQuoteSummary,
  calculateCartCount,
  clearCart,
  createInquiryText,
  upsertMachineQuantity,
  upsertScentLiters,
};
