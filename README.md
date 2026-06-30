# GlassMartin 空间香氛服务 APP

手机端商业香氛选型与询价 PWA。

## 常用命令

- `npm run dev`：本地开发预览
- `npm run build`：生产构建
- `npm test`：运行测试
- `npm run data:build`：从 `data/source/glassmartin-products.xlsx` 导出 `public/data/products.json`

## 产品资料维护

编辑 `data/source/glassmartin-products.xlsx` 中的场景、香型、扩香机、标准方案、首页广告、促销弹窗和设置表，然后运行 `npm run data:build`。

机器图片放在 `public/images/machines/`，Excel 中填写对应图片路径，例如 `/images/machines/gas-501f.jpg`。

首页滚动广告图片放在 `public/images/banners/`，Excel 的 `banners` 表中填写对应图片路径，例如 `/images/banners/hotel-lobby.jpg`。可在 `banners` 表里调整广告标题、副标题、跳转场景、排序和是否启用。

常用表格说明：

- `scenes`：商业场景入口。
- `scents`：香型、适用场景、参考区间价、是否常备/推荐。
- `machines`：扩香机型号、图片、适用面积、卖点、是否推荐。
- `packages`：首页热门标准方案。
- `banners`：首页滚动广告图。
- `promotions`：打开网页后的促销弹窗内容。
- `settings`：品牌信息和每满 3L 赠送机器等规则。

## 赠送规则

默认规则是精油总升数每满 3L，赠送 1 台 GAS-501F 插电蓝牙 APP 款扩香机。规则来自数据文件中的 `settings.giftStepLiters` 和 `settings.giftMachineId`。
