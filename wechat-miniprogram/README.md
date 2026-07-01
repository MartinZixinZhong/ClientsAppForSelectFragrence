# GlassMartin 微信小程序版

这是 GlassMartin 空间香氛服务的原生微信小程序版本。它和现有 GitHub Pages 网页版并存，不会影响网页访问。

## 导入微信开发者工具

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择：`F:\Codex-客户端香型选择以及展示价格\wechat-miniprogram`
4. 当前 `project.config.json` 已配置小程序 AppID：`wx45368fc509491335`。
5. 在开发者工具里预览、真机调试、上传代码。

## 后期修改数据

继续修改：

`F:\Codex-客户端香型选择以及展示价格\data\source\glassmartin-products.xlsx`

修改并保存后运行：

```cmd
npm.cmd run wechat:sync
```

这个命令会：

1. 从 Excel 生成网页数据：`public/data/products.json`
2. 生成小程序数据：`wechat-miniprogram/data/products.js`
3. 同步小程序图片：`wechat-miniprogram/assets/images`

## 小程序专用 Logo

小程序使用：

`F:\Codex-客户端香型选择以及展示价格\data\source\glassmartin-miniprogram-logo.jpg`

每次运行 `npm.cmd run wechat:sync` 时，会把这个 logo 覆盖到：

`F:\Codex-客户端香型选择以及展示价格\wechat-miniprogram\assets\images\glassmartin-logo.jpg`

## 当前功能

- 首页品牌展示、活动弹窗、场景入口、banner、热门标准方案
- 场景页“选择香型和用量 / 查看香薰扩香机”双标签
- 香型升数和扩香机数量选择
- 每 3L 精油赠送 GAS-501F 扩香机规则
- 采购清单、复制询价文本、清空采购清单
- 微信分享基础配置

## 发布提醒

正式发布前需要在微信公众平台完成类目选择、代码上传和提交审核。
