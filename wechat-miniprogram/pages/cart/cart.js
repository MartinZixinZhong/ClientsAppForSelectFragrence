const app = getApp();
const { buildQuoteSummary, calculateCartCount, createInquiryText } = require('../../utils/quote');

Page({
  data: {
    summary: null,
    inquiryText: '',
    cartCount: 0,
    finalQuoteNotice: '',
  },

  onShow() {
    this.refreshCart();
  },

  refreshCart() {
    const catalog = app.globalData.catalog;
    const cart = app.globalData.cart;
    this.setData({
      summary: buildQuoteSummary(cart, catalog),
      inquiryText: createInquiryText(cart, catalog),
      cartCount: calculateCartCount(cart),
      finalQuoteNotice: catalog.settings.finalQuoteNotice,
    });
  },

  copyInquiryText() {
    wx.setClipboardData({
      data: this.data.inquiryText,
      success: () => {
        wx.showToast({ title: '已复制询价文本', icon: 'success' });
      },
    });
  },

  clearPurchaseCart() {
    wx.showModal({
      title: '清空采购清单',
      content: '确定要清空当前采购清单吗？',
      confirmText: '清空',
      confirmColor: '#8b2f1c',
      success: (result) => {
        if (!result.confirm) {
          return;
        }
        app.clearPurchaseCart();
        this.refreshCart();
        wx.showToast({ title: '已清空', icon: 'success' });
      },
    });
  },

  goHome() {
    wx.reLaunch({ url: '/pages/home/home' });
  },

  onShareAppMessage() {
    return {
      title: 'GlassMartin 空间香氛询价清单',
      path: '/pages/home/home',
      imageUrl: '/assets/images/glassmartin-logo.jpg',
    };
  },
});
