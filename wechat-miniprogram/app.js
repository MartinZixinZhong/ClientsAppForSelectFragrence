const catalog = require('./data/products');
const {
  calculateCartCount,
  clearCart,
  upsertMachineQuantity,
  upsertScentLiters,
} = require('./utils/quote');

const STORAGE_KEY = 'glassmartin.quoteCart';

App({
  globalData: {
    catalog,
    cart: clearCart(),
  },

  onLaunch() {
    const storedCart = wx.getStorageSync(STORAGE_KEY);
    if (storedCart && typeof storedCart === 'object') {
      this.globalData.cart = {
        ...clearCart(),
        ...storedCart,
      };
    }
  },

  setCart(cart) {
    this.globalData.cart = cart;
    wx.setStorageSync(STORAGE_KEY, cart);
  },

  setScenario(scenarioId) {
    this.setCart({
      ...this.globalData.cart,
      scenarioId,
    });
  },

  setScentLiters(scentId, liters) {
    this.setCart(upsertScentLiters(this.globalData.cart, scentId, liters));
  },

  setMachineQuantity(machineId, quantity) {
    this.setCart(upsertMachineQuantity(this.globalData.cart, machineId, quantity));
  },

  clearPurchaseCart() {
    this.setCart(clearCart());
  },

  getCartCount() {
    return calculateCartCount(this.globalData.cart);
  },
});
