const app = getApp();

function sortByOrder(items) {
  return [...(items || [])].sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0));
}

Page({
  data: {
    brandName: '',
    brandSubtitle: '',
    scenarios: [],
    packages: [],
    banners: [],
    promotion: null,
    showPromo: true,
    cartCount: 0,
  },

  onShow() {
    const catalog = app.globalData.catalog;
    this.setData({
      brandName: catalog.settings.brandName,
      brandSubtitle: catalog.settings.brandSubtitle,
      scenarios: sortByOrder(catalog.scenarios),
      packages: catalog.packages || [],
      banners: sortByOrder((catalog.banners || []).filter((banner) => banner.enabled)),
      promotion: catalog.promotion,
      cartCount: app.getCartCount(),
    });
  },

  closePromo() {
    this.setData({ showPromo: false });
  },

  selectScenario(event) {
    const scenarioId = event.currentTarget.dataset.id;
    app.setScenario(scenarioId);
    wx.navigateTo({ url: `/pages/scenario/scenario?id=${scenarioId}` });
  },

  addPackage(event) {
    const packageId = event.currentTarget.dataset.id;
    const packageOption = app.globalData.catalog.packages.find((item) => item.id === packageId);
    if (!packageOption) {
      return;
    }

    app.setScenario(packageOption.scenarioId);
    packageOption.scentIds.forEach((scentId) => {
      app.setScentLiters(scentId, packageOption.suggestedLiters);
    });
    packageOption.machineItems.forEach((item) => {
      app.setMachineQuantity(item.machineId, item.quantity);
    });
    wx.navigateTo({ url: '/pages/cart/cart' });
  },

  tapBanner(event) {
    const bannerId = event.currentTarget.dataset.id;
    const banner = this.data.banners.find((item) => item.id === bannerId);
    if (!banner || banner.linkType === 'none') {
      return;
    }

    if (banner.linkType === 'scenario') {
      app.setScenario(banner.targetId);
      wx.navigateTo({ url: `/pages/scenario/scenario?id=${banner.targetId}` });
      return;
    }

    if (banner.linkType === 'package') {
      this.addPackage({ currentTarget: { dataset: { id: banner.targetId } } });
    }
  },

  openCart() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  },

  onShareAppMessage() {
    return {
      title: 'GlassMartin 空间香氛服务',
      path: '/pages/home/home',
      imageUrl: '/assets/images/glassmartin-logo.jpg',
    };
  },
});
