# GlassMartin WeChat Miniprogram MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native WeChat miniprogram version of the GlassMartin client selection app while preserving the existing GitHub Pages web app.

**Architecture:** Keep the web app untouched and add `wechat-miniprogram/` as a parallel native miniprogram project. Reuse the existing Excel-to-catalog pipeline by generating `public/data/products.json`, then converting it into `wechat-miniprogram/data/products.js` and syncing local image assets.

**Tech Stack:** Native WeChat Mini Program JavaScript, WXML, WXSS, Node.js build scripts, Vitest for reusable data and quote logic checks.

---

### Task 1: Data Sync Pipeline

**Files:**
- Create: `scripts/build-wechat-miniprogram.mjs`
- Create: `scripts/build-wechat-miniprogram.test.mjs`
- Modify: `package.json`
- Create: `data/source/glassmartin-miniprogram-logo.jpg`

- [x] **Step 1: Write tests for catalog image path conversion and asset syncing**

The test verifies that `/images/...` paths become `/assets/images/...`, local image files are copied, and a miniprogram-specific logo overrides the web logo.

- [x] **Step 2: Implement sync script**

`buildWechatMiniProgram()` reads `public/data/products.json`, writes `wechat-miniprogram/data/products.js`, copies `public/images` into `wechat-miniprogram/assets/images`, and prefers `data/source/glassmartin-miniprogram-logo.jpg` for the miniprogram logo.

- [x] **Step 3: Add commands**

`npm.cmd run wechat:sync` runs the Excel build and miniprogram sync together.

### Task 2: Native Miniprogram Shell

**Files:**
- Create: `wechat-miniprogram/app.js`
- Create: `wechat-miniprogram/app.json`
- Create: `wechat-miniprogram/app.wxss`
- Create: `wechat-miniprogram/project.config.json`
- Create: `wechat-miniprogram/sitemap.json`

- [x] **Step 1: Create miniprogram project config**

Use `touristappid` as the temporary AppID so the project can be imported before the official AppID is known.

- [x] **Step 2: Create global app state**

Load local catalog data, persist the cart in WeChat storage, and expose methods for selecting scenarios, scent liters, machine quantities, clearing the cart, and calculating cart count.

### Task 3: Quote Logic

**Files:**
- Create: `wechat-miniprogram/utils/quote.js`
- Create: `scripts/wechat-quote.test.mjs`

- [x] **Step 1: Write tests for cart updates, gift counts, inquiry text, and clear cart**

Tests cover removing zero-liter scents, every-3L gift counts, inquiry text, and full cart clearing.

- [x] **Step 2: Implement reusable quote utilities**

The utility mirrors the web app behavior for summary calculation, inquiry text, and cart item updates.

### Task 4: Pages

**Files:**
- Create: `wechat-miniprogram/pages/home/home.js`
- Create: `wechat-miniprogram/pages/home/home.wxml`
- Create: `wechat-miniprogram/pages/home/home.wxss`
- Create: `wechat-miniprogram/pages/scenario/scenario.js`
- Create: `wechat-miniprogram/pages/scenario/scenario.wxml`
- Create: `wechat-miniprogram/pages/scenario/scenario.wxss`
- Create: `wechat-miniprogram/pages/cart/cart.js`
- Create: `wechat-miniprogram/pages/cart/cart.wxml`
- Create: `wechat-miniprogram/pages/cart/cart.wxss`

- [x] **Step 1: Implement home page**

Show the GlassMartin brand, promotion modal, banner swiper, commercial scenarios, hot packages, and floating cart entry.

- [x] **Step 2: Implement scenario page**

Show the selected scenario with tabs for “选择香型和用量” and “查看香薰扩香机”, with inputs that update the global cart.

- [x] **Step 3: Implement cart page**

Show selected scenario, oil liters, machines, every-3L gift machine count, final quote notice, copy inquiry text, clear cart, and return home.

### Task 5: Validation And Docs

**Files:**
- Create: `scripts/wechat-miniprogram-structure.test.mjs`
- Create: `wechat-miniprogram/README.md`
- Modify: `.gitignore`

- [x] **Step 1: Validate structure**

Tests assert all declared miniprogram pages have `.js`, `.wxml`, and `.wxss` files and that local data and image assets exist.

- [x] **Step 2: Document import and maintenance**

The README explains how to import the miniprogram into WeChat DevTools, replace the AppID, sync Excel changes, and prepare for upload/review.

- [x] **Step 3: Verify**

Run `npm.cmd test`, `set GITHUB_PAGES=true&& npm.cmd run build`, and `npm.cmd run wechat:sync`.
