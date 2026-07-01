const app = getApp();

function mapById(items, idKey, valueKey) {
  return Object.fromEntries((items || []).map((item) => [item[idKey], item[valueKey]]));
}

function formatScent(scent, liters) {
  return {
    ...scent,
    liters: liters || '',
    priceTierText: (scent.priceTiers || [])
      .map((tier) => `${tier.label}：${tier.referencePriceText}`)
      .join('  '),
  };
}

function formatMachine(machine, quantity) {
  return {
    ...machine,
    quantity: quantity || '',
    sellingPointText: (machine.sellingPoints || []).join(' / '),
  };
}

Page({
  data: {
    scenario: null,
    activeTab: 'scents',
    scents: [],
    machines: [],
    cartCount: 0,
    finalQuoteNotice: '',
  },

  onLoad(options) {
    if (options.id) {
      app.setScenario(options.id);
    }
  },

  onShow() {
    this.refreshPage();
  },

  refreshPage() {
    const catalog = app.globalData.catalog;
    const cart = app.globalData.cart;
    const scenarioId = cart.scenarioId || (catalog.scenarios[0] && catalog.scenarios[0].id);
    const scenario = (catalog.scenarios || []).find((item) => item.id === scenarioId);
    const scentLiters = mapById(cart.scents, 'scentId', 'liters');
    const machineQuantities = mapById(cart.machines, 'machineId', 'quantity');
    const scents = (catalog.scents || [])
      .filter((scent) => (scent.scenarioIds || []).includes(scenarioId))
      .sort((left, right) => Number(right.isRecommended) - Number(left.isRecommended))
      .map((scent) => formatScent(scent, scentLiters[scent.id]));
    const machines = (catalog.machines || []).map((machine) => formatMachine(machine, machineQuantities[machine.id]));

    this.setData({
      scenario,
      scents,
      machines,
      cartCount: app.getCartCount(),
      finalQuoteNotice: catalog.settings.finalQuoteNotice,
    });
  },

  switchTab(event) {
    this.setData({ activeTab: event.currentTarget.dataset.tab });
  },

  changeScentLiters(event) {
    app.setScentLiters(event.currentTarget.dataset.id, event.detail.value);
    this.refreshPage();
  },

  changeMachineQuantity(event) {
    app.setMachineQuantity(event.currentTarget.dataset.id, event.detail.value);
    this.refreshPage();
  },

  openCart() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  },

  backHome() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: this.data.scenario ? `${this.data.scenario.name} 香氛方案` : 'GlassMartin 空间香氛服务',
      path: this.data.scenario ? `/pages/scenario/scenario?id=${this.data.scenario.id}` : '/pages/home/home',
      imageUrl: '/assets/images/glassmartin-logo.jpg',
    };
  },
});
