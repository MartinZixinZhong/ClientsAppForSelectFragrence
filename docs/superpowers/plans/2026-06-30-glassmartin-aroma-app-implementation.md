# GlassMartin Aroma App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first PWA for GlassMartin customers to browse commercial aroma scenarios, view scent and diffuser recommendations, build an inquiry list, and export the inquiry by text or image.

**Architecture:** Use a Vite React TypeScript single-page app with local JSON data as the runtime source of truth. Keep domain rules in pure TypeScript modules, UI components focused by workflow section, and Excel conversion in a separate Node script that produces `public/data/products.json`.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, `xlsx` for Excel conversion, `html-to-image` for quote image export, CSS modules or plain CSS in `src/styles`.

---

## File Structure

- Create `package.json`: project scripts and dependencies.
- Create `index.html`: Vite app entry.
- Create `vite.config.ts`: React and test configuration.
- Create `tsconfig.json` and `tsconfig.node.json`: TypeScript configuration.
- Create `public/manifest.webmanifest`: PWA install metadata.
- Create `public/sw.js`: static asset and data cache service worker.
- Create `public/data/products.json`: generated sample runtime data used by the app.
- Create `public/images/glassmartin-logo.jpg`: copied brand logo.
- Create `public/images/machines/gas-501f.jpg`: generated or supplied GAS-501F product image sized for machine cards.
- Create `data/source/glassmartin-products.xlsx`: editable source workbook for product data.
- Create `scripts/excel-to-products.mjs`: convert Excel workbook to app JSON.
- Create `src/main.tsx`: React app bootstrap.
- Create `src/App.tsx`: app composition and screen flow.
- Create `src/domain/types.ts`: shared product and quote types.
- Create `src/domain/giftRules.ts`: every-3L gift calculation.
- Create `src/domain/quote.ts`: quote cart totals and export text.
- Create `src/data/loadCatalog.ts`: fetch and validate catalog JSON.
- Create `src/state/useQuoteCart.ts`: quote cart state and persistence.
- Create `src/components/PromoModal.tsx`: first-open promotion modal.
- Create `src/components/Header.tsx`: logo, brand, cart entry.
- Create `src/components/Home.tsx`: scenario entry and popular packages.
- Create `src/components/ScenarioPage.tsx`: recommended scents and machines for one scenario.
- Create `src/components/ProductCard.tsx`: scent selection card.
- Create `src/components/MachineCard.tsx`: diffuser machine card.
- Create `src/components/QuoteCart.tsx`: inquiry list and export controls.
- Create `src/components/QuoteImageCard.tsx`: DOM source used to generate a PNG inquiry card.
- Create `src/pwa/registerServiceWorker.ts`: service worker registration.
- Create `src/styles/app.css`: mobile-first styling.
- Create tests beside domain and component files with `.test.ts` or `.test.tsx` suffix.

---

### Task 1: Scaffold Project And Brand Assets

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `.gitignore`
- Create: `public/images/glassmartin-logo.jpg`
- Create: `public/images/machines/gas-501f.jpg`

- [ ] **Step 1: Initialize git repository**

Run:

```bash
git init
```

Expected: repository initialized in the current workspace.

- [ ] **Step 2: Create package metadata**

Create `package.json`:

```json
{
  "name": "glassmartin-aroma-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest",
    "data:build": "node scripts/excel-to-products.mjs"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "html-to-image": "latest",
    "xlsx": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules` and `package-lock.json` are created.

- [ ] **Step 4: Create Vite and TypeScript config**

Create `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create HTML entry and ignore file**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#111111" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>GlassMartin 空间香氛服务</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `.gitignore`:

```gitignore
node_modules
dist
.env
.DS_Store
.superpowers
```

- [ ] **Step 6: Copy logo asset**

Run:

```powershell
Copy-Item -LiteralPath 'D:\香薰品牌资料\Logo\Glassmartin-jpg5、.jpg' -Destination 'public\images\glassmartin-logo.jpg' -Force
```

Expected: `public/images/glassmartin-logo.jpg` exists.

- [ ] **Step 7: Add GAS-501F product image**

Create `public/images/machines/gas-501f.jpg` as a real product visual. If the user supplies a photographed GAS-501F source image, copy that file into this path. If no photographed source image is available, use image generation with this prompt and save the generated bitmap to this path:

```text
Clean commercial product photo of a compact white plug-in aroma diffuser machine, Bluetooth app control style, front three-quarter view, isolated on a white studio background, soft shadow, premium hotel fragrance equipment catalog image, no text, no logo, no people.
```

- [ ] **Step 8: Commit scaffold**

Run:

```bash
git add .
git commit -m "chore: scaffold GlassMartin aroma app"
```

Expected: first commit is created.

---

### Task 2: Add Domain Types, Sample Catalog, And Gift Rule Tests

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/giftRules.ts`
- Create: `src/domain/giftRules.test.ts`
- Create: `src/test/setup.ts`
- Create: `public/data/products.json`

- [ ] **Step 1: Create test setup**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 2: Define domain types**

Create `src/domain/types.ts`:

```ts
export type ScenarioId =
  | 'hotel'
  | 'entertainment'
  | 'wellness'
  | 'showroom'
  | 'office'
  | 'retail'
  | 'deodorizing';

export interface PriceTier {
  minLiters: number;
  maxLiters: number | null;
  label: string;
  referencePriceText: string;
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  subtitle: string;
  sortOrder: number;
}

export interface Scent {
  id: string;
  name: string;
  description: string;
  toneNote: string;
  scenarioIds: ScenarioId[];
  isRecommended: boolean;
  isRegularStock: boolean;
  isInquiryOnly: boolean;
  priceTiers: PriceTier[];
}

export interface Machine {
  id: string;
  model: string;
  name: string;
  image: string;
  coverageText: string;
  sellingPoints: string[];
  scenarioIds: ScenarioId[];
  isRecommended: boolean;
  isGiftMachine: boolean;
}

export interface PackageOption {
  id: string;
  name: string;
  scenarioId: ScenarioId;
  description: string;
  scentIds: string[];
  suggestedLiters: number;
  machineItems: Array<{ machineId: string; quantity: number }>;
}

export interface Promotion {
  enabled: boolean;
  title: string;
  body: string;
  buttonText: string;
}

export interface Settings {
  brandName: string;
  brandSubtitle: string;
  giftStepLiters: number;
  giftMachineId: string;
  finalQuoteNotice: string;
}

export interface Catalog {
  settings: Settings;
  promotion: Promotion;
  scenarios: Scenario[];
  scents: Scent[];
  machines: Machine[];
  packages: PackageOption[];
}

export interface QuoteScentItem {
  scentId: string;
  liters: number;
}

export interface QuoteMachineItem {
  machineId: string;
  quantity: number;
}

export interface QuoteCart {
  scenarioId: ScenarioId | null;
  scents: QuoteScentItem[];
  machines: QuoteMachineItem[];
}
```

- [ ] **Step 3: Write gift rule tests**

Create `src/domain/giftRules.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { calculateGiftMachineCount } from './giftRules';

describe('calculateGiftMachineCount', () => {
  it('returns 0 when total oil liters are below 3L', () => {
    expect(calculateGiftMachineCount(2.9, 3)).toBe(0);
  });

  it('returns 1 when total oil liters reach 3L', () => {
    expect(calculateGiftMachineCount(3, 3)).toBe(1);
  });

  it('returns one gift machine for every full 3L', () => {
    expect(calculateGiftMachineCount(6, 3)).toBe(2);
    expect(calculateGiftMachineCount(9.5, 3)).toBe(3);
  });

  it('returns 0 when the configured gift step is invalid', () => {
    expect(calculateGiftMachineCount(6, 0)).toBe(0);
  });
});
```

- [ ] **Step 4: Run test to verify failure**

Run:

```bash
npm test -- src/domain/giftRules.test.ts
```

Expected: FAIL because `src/domain/giftRules.ts` does not exist.

- [ ] **Step 5: Implement gift rule**

Create `src/domain/giftRules.ts`:

```ts
export function calculateGiftMachineCount(totalOilLiters: number, giftStepLiters: number): number {
  if (!Number.isFinite(totalOilLiters) || !Number.isFinite(giftStepLiters)) {
    return 0;
  }

  if (totalOilLiters < 0 || giftStepLiters <= 0) {
    return 0;
  }

  return Math.floor(totalOilLiters / giftStepLiters);
}
```

- [ ] **Step 6: Add sample runtime catalog**

Create `public/data/products.json`:

```json
{
  "settings": {
    "brandName": "GlassMartin",
    "brandSubtitle": "澳洲品牌 · 空间香氛服务",
    "giftStepLiters": 3,
    "giftMachineId": "gas-501f",
    "finalQuoteNotice": "最终报价以 GlassMartin 确认方案为准。"
  },
  "promotion": {
    "enabled": true,
    "title": "近期大促",
    "body": "采购满指定金额/升数，可赠送 GAS-501F 插电蓝牙 APP 款扩香机。",
    "buttonText": "查看推荐方案"
  },
  "scenarios": [
    { "id": "hotel", "name": "酒店 / 大堂 / 走廊", "subtitle": "稳重、干净、留香稳定的常备香型", "sortOrder": 1 },
    { "id": "entertainment", "name": "KTV / 酒吧 / 台球 / 网咖", "subtitle": "扩散明显，适合高人流娱乐商业空间", "sortOrder": 2 },
    { "id": "wellness", "name": "会所 / SPA / 足浴", "subtitle": "放松、舒缓、停留感更强的香氛方案", "sortOrder": 3 },
    { "id": "showroom", "name": "售楼处 / 展厅", "subtitle": "提升来访体验和空间记忆点", "sortOrder": 4 },
    { "id": "office", "name": "办公室 / 商务空间", "subtitle": "清爽、克制、适合长时间停留", "sortOrder": 5 },
    { "id": "retail", "name": "商场 / 零售门店", "subtitle": "增强品牌识别和停留体验", "sortOrder": 6 },
    { "id": "deodorizing", "name": "卫生间 / 除味空间", "subtitle": "强调除味、清洁感和持续扩散", "sortOrder": 7 }
  ],
  "scents": [
    {
      "id": "white-tea-hotel",
      "name": "白茶酒店香",
      "description": "干净、柔和、适合酒店大堂和走廊。",
      "toneNote": "茶香 / 木质",
      "scenarioIds": ["hotel", "office", "showroom"],
      "isRecommended": true,
      "isRegularStock": true,
      "isInquiryOnly": false,
      "priceTiers": [
        { "minLiters": 1, "maxLiters": 3, "label": "1-3L", "referencePriceText": "参考区间价" },
        { "minLiters": 4, "maxLiters": 9, "label": "4-9L", "referencePriceText": "参考区间价" },
        { "minLiters": 10, "maxLiters": null, "label": "10L+", "referencePriceText": "参考区间价" }
      ]
    },
    {
      "id": "night-club-energy",
      "name": "活力娱乐场景香",
      "description": "扩散明显，适合 KTV、酒吧、台球和网咖空间。",
      "toneNote": "果香 / 琥珀",
      "scenarioIds": ["entertainment"],
      "isRecommended": true,
      "isRegularStock": true,
      "isInquiryOnly": false,
      "priceTiers": [
        { "minLiters": 1, "maxLiters": 3, "label": "1-3L", "referencePriceText": "参考区间价" },
        { "minLiters": 4, "maxLiters": 9, "label": "4-9L", "referencePriceText": "参考区间价" },
        { "minLiters": 10, "maxLiters": null, "label": "10L+", "referencePriceText": "参考区间价" }
      ]
    }
  ],
  "machines": [
    {
      "id": "gas-501f",
      "model": "GAS-501F",
      "name": "GAS-501F 插电蓝牙 APP 款",
      "image": "/images/machines/gas-501f.jpg",
      "coverageText": "适用于中小型商业空间",
      "sellingPoints": ["插电使用", "蓝牙连接", "APP 控制"],
      "scenarioIds": ["hotel", "entertainment", "wellness", "office", "retail"],
      "isRecommended": true,
      "isGiftMachine": true
    }
  ],
  "packages": [
    {
      "id": "hotel-basic",
      "name": "酒店大堂基础方案",
      "scenarioId": "hotel",
      "description": "适合酒店大堂、走廊等公共区域的基础询价方案。",
      "scentIds": ["white-tea-hotel"],
      "suggestedLiters": 5,
      "machineItems": [{ "machineId": "gas-501f", "quantity": 1 }]
    },
    {
      "id": "entertainment-regular",
      "name": "娱乐空间常备方案",
      "scenarioId": "entertainment",
      "description": "适合 KTV、酒吧、台球、网咖等空间的常备询价方案。",
      "scentIds": ["night-club-energy"],
      "suggestedLiters": 6,
      "machineItems": [{ "machineId": "gas-501f", "quantity": 2 }]
    }
  ]
}
```

- [ ] **Step 7: Run test to verify pass**

Run:

```bash
npm test -- src/domain/giftRules.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit domain foundation**

Run:

```bash
git add src/domain src/test public/data
git commit -m "feat: add catalog types and gift rules"
```

Expected: commit is created.

---

### Task 3: Build Excel-To-JSON Data Pipeline

**Files:**
- Create: `scripts/excel-to-products.mjs`
- Create: `scripts/excel-to-products.test.mjs`
- Create: `data/source/glassmartin-products.xlsx`
- Modify: `package.json`

- [ ] **Step 1: Write converter behavior test**

Create `scripts/excel-to-products.test.mjs`:

```js
import { describe, expect, it } from 'vitest';
import { rowsToCatalog } from './excel-to-products.mjs';

describe('rowsToCatalog', () => {
  it('converts workbook rows into catalog JSON', () => {
    const catalog = rowsToCatalog({
      scenes: [{ id: 'hotel', name: '酒店 / 大堂 / 走廊', subtitle: '酒店场景', sortOrder: 1 }],
      scents: [{
        id: 'white-tea-hotel',
        name: '白茶酒店香',
        description: '干净柔和',
        toneNote: '茶香',
        scenarioIds: 'hotel,office',
        isRecommended: 'TRUE',
        isRegularStock: 'TRUE',
        isInquiryOnly: 'FALSE',
        priceTiers: '1-3L:参考区间价;4-9L:参考区间价;10L+:参考区间价',
      }],
      machines: [{
        id: 'gas-501f',
        model: 'GAS-501F',
        name: 'GAS-501F 插电蓝牙 APP 款',
        image: '/images/machines/gas-501f.jpg',
        coverageText: '中小型商业空间',
        sellingPoints: '插电使用,蓝牙连接,APP 控制',
        scenarioIds: 'hotel,office',
        isRecommended: 'TRUE',
        isGiftMachine: 'TRUE',
      }],
      packages: [{
        id: 'hotel-basic',
        name: '酒店大堂基础方案',
        scenarioId: 'hotel',
        description: '基础询价方案',
        scentIds: 'white-tea-hotel',
        suggestedLiters: 5,
        machineItems: 'gas-501f:1',
      }],
      settings: [{
        brandName: 'GlassMartin',
        brandSubtitle: '澳洲品牌 · 空间香氛服务',
        giftStepLiters: 3,
        giftMachineId: 'gas-501f',
        finalQuoteNotice: '最终报价以 GlassMartin 确认方案为准。',
      }],
      promotions: [{
        enabled: 'TRUE',
        title: '近期大促',
        body: '采购满指定金额/升数，可赠送 GAS-501F 插电蓝牙 APP 款扩香机。',
        buttonText: '查看推荐方案',
      }],
    });

    expect(catalog.settings.giftStepLiters).toBe(3);
    expect(catalog.scents[0].scenarioIds).toEqual(['hotel', 'office']);
    expect(catalog.scents[0].priceTiers[2]).toEqual({
      minLiters: 10,
      maxLiters: null,
      label: '10L+',
      referencePriceText: '参考区间价',
    });
    expect(catalog.machines[0].isGiftMachine).toBe(true);
    expect(catalog.packages[0].machineItems).toEqual([{ machineId: 'gas-501f', quantity: 1 }]);
  });
});
```

- [ ] **Step 2: Run converter test to verify failure**

Run:

```bash
npm test -- scripts/excel-to-products.test.mjs
```

Expected: FAIL because `rowsToCatalog` is not exported.

- [ ] **Step 3: Implement converter module**

Create `scripts/excel-to-products.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as XLSX from 'xlsx';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'data/source/glassmartin-products.xlsx');
const OUTPUT = path.join(ROOT, 'public/data/products.json');

function bool(value) {
  return String(value).trim().toUpperCase() === 'TRUE';
}

function splitList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePriceTiers(value) {
  return String(value || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [label, referencePriceText] = part.split(':').map((segment) => segment.trim());
      if (label.endsWith('+')) {
        return {
          minLiters: Number(label.replace('L+', '')),
          maxLiters: null,
          label,
          referencePriceText,
        };
      }
      const [min, max] = label.replace('L', '').split('-').map(Number);
      return { minLiters: min, maxLiters: max, label, referencePriceText };
    });
}

function parseMachineItems(value) {
  return String(value || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [machineId, quantity] = part.split(':').map((segment) => segment.trim());
      return { machineId, quantity: Number(quantity) };
    });
}

export function rowsToCatalog(rows) {
  const settingsRow = rows.settings[0];
  const promotionRow = rows.promotions[0];

  return {
    settings: {
      brandName: String(settingsRow.brandName),
      brandSubtitle: String(settingsRow.brandSubtitle),
      giftStepLiters: Number(settingsRow.giftStepLiters),
      giftMachineId: String(settingsRow.giftMachineId),
      finalQuoteNotice: String(settingsRow.finalQuoteNotice),
    },
    promotion: {
      enabled: bool(promotionRow.enabled),
      title: String(promotionRow.title),
      body: String(promotionRow.body),
      buttonText: String(promotionRow.buttonText),
    },
    scenarios: rows.scenes.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      subtitle: String(row.subtitle),
      sortOrder: Number(row.sortOrder),
    })),
    scents: rows.scents.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      description: String(row.description),
      toneNote: String(row.toneNote),
      scenarioIds: splitList(row.scenarioIds),
      isRecommended: bool(row.isRecommended),
      isRegularStock: bool(row.isRegularStock),
      isInquiryOnly: bool(row.isInquiryOnly),
      priceTiers: parsePriceTiers(row.priceTiers),
    })),
    machines: rows.machines.map((row) => ({
      id: String(row.id),
      model: String(row.model),
      name: String(row.name),
      image: String(row.image),
      coverageText: String(row.coverageText),
      sellingPoints: splitList(row.sellingPoints),
      scenarioIds: splitList(row.scenarioIds),
      isRecommended: bool(row.isRecommended),
      isGiftMachine: bool(row.isGiftMachine),
    })),
    packages: rows.packages.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      scenarioId: String(row.scenarioId),
      description: String(row.description),
      scentIds: splitList(row.scentIds),
      suggestedLiters: Number(row.suggestedLiters),
      machineItems: parseMachineItems(row.machineItems),
    })),
  };
}

function sheetRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Missing sheet: ${sheetName}`);
  }
  return XLSX.utils.sheet_to_json(sheet);
}

export function readWorkbookToCatalog(sourcePath) {
  const workbook = XLSX.readFile(sourcePath);
  return rowsToCatalog({
    scenes: sheetRows(workbook, 'scenes'),
    scents: sheetRows(workbook, 'scents'),
    machines: sheetRows(workbook, 'machines'),
    packages: sheetRows(workbook, 'packages'),
    settings: sheetRows(workbook, 'settings'),
    promotions: sheetRows(workbook, 'promotions'),
  });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const catalog = readWorkbookToCatalog(SOURCE);
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`Wrote ${OUTPUT}`);
}
```

- [ ] **Step 4: Run converter test to verify pass**

Run:

```bash
npm test -- scripts/excel-to-products.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Create source workbook**

Run a small Node script from the project root:

```bash
node -e "import('xlsx').then(XLSX=>{const wb=XLSX.utils.book_new(); const sheets={scenes:[{id:'hotel',name:'酒店 / 大堂 / 走廊',subtitle:'稳重、干净、留香稳定的常备香型',sortOrder:1}],scents:[{id:'white-tea-hotel',name:'白茶酒店香',description:'干净柔和',toneNote:'茶香 / 木质',scenarioIds:'hotel,office',isRecommended:'TRUE',isRegularStock:'TRUE',isInquiryOnly:'FALSE',priceTiers:'1-3L:参考区间价;4-9L:参考区间价;10L+:参考区间价'}],machines:[{id:'gas-501f',model:'GAS-501F',name:'GAS-501F 插电蓝牙 APP 款',image:'/images/machines/gas-501f.jpg',coverageText:'适用于中小型商业空间',sellingPoints:'插电使用,蓝牙连接,APP 控制',scenarioIds:'hotel,entertainment,wellness,office,retail',isRecommended:'TRUE',isGiftMachine:'TRUE'}],packages:[{id:'hotel-basic',name:'酒店大堂基础方案',scenarioId:'hotel',description:'基础询价方案',scentIds:'white-tea-hotel',suggestedLiters:5,machineItems:'gas-501f:1'}],settings:[{brandName:'GlassMartin',brandSubtitle:'澳洲品牌 · 空间香氛服务',giftStepLiters:3,giftMachineId:'gas-501f',finalQuoteNotice:'最终报价以 GlassMartin 确认方案为准。'}],promotions:[{enabled:'TRUE',title:'近期大促',body:'采购满指定金额/升数，可赠送 GAS-501F 插电蓝牙 APP 款扩香机。',buttonText:'查看推荐方案'}]}; for(const [name,rows] of Object.entries(sheets)){XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),name)}; XLSX.writeFile(wb,'data/source/glassmartin-products.xlsx')})"
```

Expected: `data/source/glassmartin-products.xlsx` exists with six sheets.

- [ ] **Step 6: Generate app data from Excel**

Run:

```bash
npm run data:build
```

Expected: `public/data/products.json` is regenerated and contains `settings`, `promotion`, `scenarios`, `scents`, `machines`, and `packages`.

- [ ] **Step 7: Commit data pipeline**

Run:

```bash
git add scripts data/source public/data package.json package-lock.json
git commit -m "feat: add Excel catalog export pipeline"
```

Expected: commit is created.

---

### Task 4: Add Catalog Loading, Quote Calculations, And Cart Persistence

**Files:**
- Create: `src/data/loadCatalog.ts`
- Create: `src/domain/quote.ts`
- Create: `src/domain/quote.test.ts`
- Create: `src/state/useQuoteCart.ts`
- Create: `src/state/useQuoteCart.test.tsx`

- [ ] **Step 1: Write quote domain tests**

Create `src/domain/quote.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { Catalog, QuoteCart } from './types';
import { buildQuoteSummary, createInquiryText } from './quote';

const catalog = {
  settings: {
    brandName: 'GlassMartin',
    brandSubtitle: '澳洲品牌 · 空间香氛服务',
    giftStepLiters: 3,
    giftMachineId: 'gas-501f',
    finalQuoteNotice: '最终报价以 GlassMartin 确认方案为准。',
  },
  promotion: { enabled: true, title: '近期大促', body: '活动', buttonText: '查看推荐方案' },
  scenarios: [{ id: 'hotel', name: '酒店 / 大堂 / 走廊', subtitle: '酒店场景', sortOrder: 1 }],
  scents: [{ id: 'white-tea-hotel', name: '白茶酒店香', description: '', toneNote: '', scenarioIds: ['hotel'], isRecommended: true, isRegularStock: true, isInquiryOnly: false, priceTiers: [] }],
  machines: [{ id: 'gas-501f', model: 'GAS-501F', name: 'GAS-501F 插电蓝牙 APP 款', image: '', coverageText: '', sellingPoints: [], scenarioIds: ['hotel'], isRecommended: true, isGiftMachine: true }],
  packages: [],
} satisfies Catalog;

describe('buildQuoteSummary', () => {
  it('totals liters and calculates one gift machine per full 3L', () => {
    const cart: QuoteCart = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 6 }],
      machines: [{ machineId: 'gas-501f', quantity: 1 }],
    };

    const summary = buildQuoteSummary(cart, catalog);

    expect(summary.totalOilLiters).toBe(6);
    expect(summary.giftMachineCount).toBe(2);
    expect(summary.giftMachine?.model).toBe('GAS-501F');
  });
});

describe('createInquiryText', () => {
  it('creates WeChat-friendly inquiry text', () => {
    const cart: QuoteCart = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 3 }],
      machines: [],
    };

    expect(createInquiryText(cart, catalog)).toContain('满赠扩香机：GAS-501F 插电蓝牙 APP 款 × 1 台');
  });
});
```

- [ ] **Step 2: Run quote tests to verify failure**

Run:

```bash
npm test -- src/domain/quote.test.ts
```

Expected: FAIL because `quote.ts` does not exist.

- [ ] **Step 3: Implement quote domain**

Create `src/domain/quote.ts`:

```ts
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
```

- [ ] **Step 4: Implement catalog loader**

Create `src/data/loadCatalog.ts`:

```ts
import type { Catalog } from '../domain/types';

export async function loadCatalog(): Promise<Catalog> {
  const response = await fetch('/data/products.json');
  if (!response.ok) {
    throw new Error('无法加载产品数据，请稍后重试。');
  }

  return (await response.json()) as Catalog;
}
```

- [ ] **Step 5: Implement cart hook**

Create `src/state/useQuoteCart.ts`:

```ts
import { useEffect, useMemo, useState } from 'react';
import type { QuoteCart, ScenarioId } from '../domain/types';

const STORAGE_KEY = 'glassmartin.quoteCart';

const emptyCart: QuoteCart = {
  scenarioId: null,
  scents: [],
  machines: [],
};

function readInitialCart(): QuoteCart {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return emptyCart;
  }
  try {
    return JSON.parse(stored) as QuoteCart;
  } catch {
    return emptyCart;
  }
}

export function useQuoteCart() {
  const [cart, setCart] = useState<QuoteCart>(readInitialCart);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return useMemo(() => ({
    cart,
    setScenario: (scenarioId: ScenarioId) => setCart((current) => ({ ...current, scenarioId })),
    setScentLiters: (scentId: string, liters: number) => setCart((current) => ({
      ...current,
      scents: [
        ...current.scents.filter((item) => item.scentId !== scentId),
        { scentId, liters },
      ].filter((item) => item.liters > 0),
    })),
    setMachineQuantity: (machineId: string, quantity: number) => setCart((current) => ({
      ...current,
      machines: [
        ...current.machines.filter((item) => item.machineId !== machineId),
        { machineId, quantity },
      ].filter((item) => item.quantity > 0),
    })),
    clearCart: () => setCart(emptyCart),
  }), [cart]);
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- src/domain/quote.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit domain and state**

Run:

```bash
git add src/data src/domain src/state
git commit -m "feat: add quote calculations and catalog loading"
```

Expected: commit is created.

---

### Task 5: Build Core Mobile UI Flow

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/components/PromoModal.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Home.tsx`
- Create: `src/components/ScenarioPage.tsx`
- Create: `src/components/ProductCard.tsx`
- Create: `src/components/MachineCard.tsx`
- Create: `src/styles/app.css`

- [ ] **Step 1: Write promo modal component test**

Create `src/components/PromoModal.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromoModal } from './PromoModal';

describe('PromoModal', () => {
  it('shows promotion before the home content and can be closed', async () => {
    const onClose = vi.fn();
    render(
      <PromoModal
        promotion={{
          enabled: true,
          title: '近期大促',
          body: '采购满指定金额/升数，可赠送 GAS-501F 插电蓝牙 APP 款扩香机。',
          buttonText: '查看推荐方案',
        }}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('近期大促')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '查看推荐方案' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run promo modal test to verify failure**

Run:

```bash
npm test -- src/components/PromoModal.test.tsx
```

Expected: FAIL because `PromoModal.tsx` does not exist.

- [ ] **Step 3: Implement app bootstrap**

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

registerServiceWorker();
```

- [ ] **Step 4: Implement promo modal**

Create `src/components/PromoModal.tsx`:

```tsx
import type { Promotion } from '../domain/types';

interface PromoModalProps {
  promotion: Promotion;
  onClose: () => void;
}

export function PromoModal({ promotion, onClose }: PromoModalProps) {
  if (!promotion.enabled) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="promo-title">
      <div className="promo-modal">
        <p className="eyebrow">GlassMartin</p>
        <h2 id="promo-title">{promotion.title}</h2>
        <p>{promotion.body}</p>
        <button className="primary-button" type="button" onClick={onClose}>
          {promotion.buttonText}
        </button>
        <button className="text-button" type="button" onClick={onClose}>
          先看看首页
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Implement header and home components**

Create `src/components/Header.tsx`:

```tsx
interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Header({ cartCount, onOpenCart }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <img src="/images/glassmartin-logo.jpg" alt="GlassMartin" />
        <div>
          <strong>GlassMartin</strong>
          <span>澳洲品牌 · 空间香氛服务</span>
        </div>
      </div>
      <button className="cart-button" type="button" onClick={onOpenCart}>
        清单 {cartCount}
      </button>
    </header>
  );
}
```

Create `src/components/Home.tsx`:

```tsx
import type { Catalog, PackageOption, Scenario } from '../domain/types';

interface HomeProps {
  catalog: Catalog;
  onSelectScenario: (scenario: Scenario) => void;
  onAddPackage: (packageOption: PackageOption) => void;
}

export function Home({ catalog, onSelectScenario, onAddPackage }: HomeProps) {
  return (
    <main className="screen">
      <section className="hero">
        <h1>为商业空间匹配香型与扩香设备</h1>
        <p>按场景推荐常备香型、参考区间价与扩香机配置，最终报价以询价确认为准。</p>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>Step 1</span>
          <h2>选择你的商业场景</h2>
        </div>
        <div className="card-grid">
          {catalog.scenarios.map((scenario) => (
            <button className="scenario-card" type="button" key={scenario.id} onClick={() => onSelectScenario(scenario)}>
              <strong>{scenario.name}</strong>
              <span>{scenario.subtitle}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>Popular Packages</span>
          <h2>热门标准方案</h2>
        </div>
        <div className="package-list">
          {catalog.packages.map((packageOption) => (
            <article className="package-card" key={packageOption.id}>
              <h3>{packageOption.name}</h3>
              <p>{packageOption.description}</p>
              <button className="primary-button" type="button" onClick={() => onAddPackage(packageOption)}>
                加入询价清单
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Implement product and machine cards**

Create `src/components/ProductCard.tsx`:

```tsx
import type { Scent } from '../domain/types';

interface ProductCardProps {
  scent: Scent;
  liters: number;
  onChangeLiters: (liters: number) => void;
}

export function ProductCard({ scent, liters, onChangeLiters }: ProductCardProps) {
  return (
    <article className="product-card">
      <div>
        <span className="pill">{scent.isRegularStock ? '常备推荐' : '更多可询'}</span>
        <h3>{scent.name}</h3>
        <p>{scent.description}</p>
        <small>{scent.toneNote}</small>
      </div>
      <div className="price-tiers">
        {scent.priceTiers.map((tier) => (
          <span key={tier.label}>{tier.label}：{tier.referencePriceText}</span>
        ))}
      </div>
      <label className="field">
        采购升数
        <input min="0" step="0.5" type="number" value={liters} onChange={(event) => onChangeLiters(Number(event.target.value))} />
      </label>
    </article>
  );
}
```

Create `src/components/MachineCard.tsx`:

```tsx
import type { Machine } from '../domain/types';

interface MachineCardProps {
  machine: Machine;
  quantity: number;
  onChangeQuantity: (quantity: number) => void;
}

export function MachineCard({ machine, quantity, onChangeQuantity }: MachineCardProps) {
  return (
    <article className="machine-card">
      <img src={machine.image} alt={machine.name} />
      <div>
        <span className="pill">{machine.model}</span>
        <h3>{machine.name}</h3>
        <p>{machine.coverageText}</p>
        <small>{machine.sellingPoints.join(' / ')}</small>
      </div>
      <label className="field">
        数量
        <input min="0" step="1" type="number" value={quantity} onChange={(event) => onChangeQuantity(Number(event.target.value))} />
      </label>
    </article>
  );
}
```

- [ ] **Step 7: Implement scenario page**

Create `src/components/ScenarioPage.tsx`:

```tsx
import type { Catalog, ScenarioId } from '../domain/types';
import { MachineCard } from './MachineCard';
import { ProductCard } from './ProductCard';

interface ScenarioPageProps {
  catalog: Catalog;
  scenarioId: ScenarioId;
  scentLiters: Record<string, number>;
  machineQuantities: Record<string, number>;
  onChangeScentLiters: (scentId: string, liters: number) => void;
  onChangeMachineQuantity: (machineId: string, quantity: number) => void;
}

export function ScenarioPage({
  catalog,
  scenarioId,
  scentLiters,
  machineQuantities,
  onChangeScentLiters,
  onChangeMachineQuantity,
}: ScenarioPageProps) {
  const scenario = catalog.scenarios.find((item) => item.id === scenarioId);
  const scents = catalog.scents.filter((scent) => scent.scenarioIds.includes(scenarioId));
  const recommendedScents = scents.filter((scent) => scent.isRecommended || scent.isRegularStock);
  const inquiryScents = scents.filter((scent) => !scent.isRecommended && !scent.isRegularStock);
  const machines = catalog.machines.filter((machine) => machine.scenarioIds.includes(scenarioId));

  return (
    <main className="screen">
      <section className="hero compact">
        <h1>{scenario?.name}</h1>
        <p>{scenario?.subtitle}</p>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>Recommended Scents</span>
          <h2>推荐/常备香型</h2>
        </div>
        {recommendedScents.map((scent) => (
          <ProductCard
            key={scent.id}
            scent={scent}
            liters={scentLiters[scent.id] ?? 0}
            onChangeLiters={(liters) => onChangeScentLiters(scent.id, liters)}
          />
        ))}
      </section>

      {inquiryScents.length > 0 ? (
        <section className="section">
          <div className="section-heading">
            <span>Inquiry Only</span>
            <h2>更多可询香型</h2>
          </div>
          {inquiryScents.map((scent) => (
            <ProductCard
              key={scent.id}
              scent={scent}
              liters={scentLiters[scent.id] ?? 0}
              onChangeLiters={(liters) => onChangeScentLiters(scent.id, liters)}
            />
          ))}
        </section>
      ) : null}

      <section className="section">
        <div className="section-heading">
          <span>Diffuser Machines</span>
          <h2>推荐扩香机</h2>
        </div>
        {machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            quantity={machineQuantities[machine.id] ?? 0}
            onChangeQuantity={(quantity) => onChangeMachineQuantity(machine.id, quantity)}
          />
        ))}
      </section>
    </main>
  );
}
```

- [ ] **Step 8: Implement App composition**

Create `src/App.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { PromoModal } from './components/PromoModal';
import { QuoteCart } from './components/QuoteCart';
import { ScenarioPage } from './components/ScenarioPage';
import { loadCatalog } from './data/loadCatalog';
import type { Catalog, ScenarioId } from './domain/types';
import { useQuoteCart } from './state/useQuoteCart';

export function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState('');
  const [showPromo, setShowPromo] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const { cart, setScenario, setScentLiters, setMachineQuantity } = useQuoteCart();

  useEffect(() => {
    loadCatalog().then(setCatalog).catch((loadError: Error) => setError(loadError.message));
  }, []);

  if (error) {
    return <main className="screen"><p className="error">{error}</p></main>;
  }

  if (!catalog) {
    return <main className="screen"><p>正在加载 GlassMartin 产品资料...</p></main>;
  }

  const cartCount = cart.scents.length + cart.machines.length;
  const scentLiters = Object.fromEntries(cart.scents.map((item) => [item.scentId, item.liters]));
  const machineQuantities = Object.fromEntries(cart.machines.map((item) => [item.machineId, item.quantity]));

  return (
    <>
      {showPromo ? <PromoModal promotion={catalog.promotion} onClose={() => setShowPromo(false)} /> : null}
      <Header cartCount={cartCount} onOpenCart={() => setShowCart(true)} />
      {cart.scenarioId ? (
        <ScenarioPage
          catalog={catalog}
          scenarioId={cart.scenarioId as ScenarioId}
          scentLiters={scentLiters}
          machineQuantities={machineQuantities}
          onChangeScentLiters={setScentLiters}
          onChangeMachineQuantity={setMachineQuantity}
        />
      ) : (
        <Home
          catalog={catalog}
          onSelectScenario={(scenario) => setScenario(scenario.id)}
          onAddPackage={(packageOption) => {
            setScenario(packageOption.scenarioId);
            packageOption.scentIds.forEach((scentId) => setScentLiters(scentId, packageOption.suggestedLiters));
            packageOption.machineItems.forEach((item) => setMachineQuantity(item.machineId, item.quantity));
            setShowCart(true);
          }}
        />
      )}
      {showCart ? <QuoteCart cart={cart} catalog={catalog} onClose={() => setShowCart(false)} /> : null}
    </>
  );
}
```

- [ ] **Step 9: Add mobile-first CSS**

Create `src/styles/app.css` with mobile layout, high-contrast text, compact cards, sticky header, bottom cart drawer, and restrained black/white/gold accents matching the supplied GlassMartin logo.

- [ ] **Step 10: Run promo modal test**

Run:

```bash
npm test -- src/components/PromoModal.test.tsx
```

Expected: PASS.

- [ ] **Step 11: Commit UI flow**

Run:

```bash
git add src index.html
git commit -m "feat: add mobile customer selection flow"
```

Expected: commit is created.

---

### Task 6: Build Quote Cart, Copy Text, And Image Export

**Files:**
- Create: `src/components/QuoteCart.tsx`
- Create: `src/components/QuoteImageCard.tsx`
- Create: `src/components/QuoteCart.test.tsx`
- Modify: `src/domain/quote.ts`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Write cart export test**

Create `src/components/QuoteCart.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QuoteCart } from './QuoteCart';
import type { Catalog, QuoteCart as QuoteCartState } from '../domain/types';

const catalog: Catalog = {
  settings: {
    brandName: 'GlassMartin',
    brandSubtitle: '澳洲品牌 · 空间香氛服务',
    giftStepLiters: 3,
    giftMachineId: 'gas-501f',
    finalQuoteNotice: '最终报价以 GlassMartin 确认方案为准。',
  },
  promotion: { enabled: true, title: '近期大促', body: '活动', buttonText: '查看推荐方案' },
  scenarios: [{ id: 'hotel', name: '酒店 / 大堂 / 走廊', subtitle: '酒店场景', sortOrder: 1 }],
  scents: [{ id: 'white-tea-hotel', name: '白茶酒店香', description: '', toneNote: '', scenarioIds: ['hotel'], isRecommended: true, isRegularStock: true, isInquiryOnly: false, priceTiers: [] }],
  machines: [{ id: 'gas-501f', model: 'GAS-501F', name: 'GAS-501F 插电蓝牙 APP 款', image: '', coverageText: '', sellingPoints: [], scenarioIds: ['hotel'], isRecommended: true, isGiftMachine: true }],
  packages: [],
};

describe('QuoteCart', () => {
  it('shows gift count based on total liters', () => {
    const cart: QuoteCartState = {
      scenarioId: 'hotel',
      scents: [{ scentId: 'white-tea-hotel', liters: 6 }],
      machines: [],
    };

    render(<QuoteCart cart={cart} catalog={catalog} onClose={vi.fn()} />);

    expect(screen.getByText('满赠扩香机：GAS-501F 插电蓝牙 APP 款 × 2 台')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run cart test to verify failure**

Run:

```bash
npm test -- src/components/QuoteCart.test.tsx
```

Expected: FAIL because `QuoteCart.tsx` does not exist.

- [ ] **Step 3: Implement quote image source**

Create `src/components/QuoteImageCard.tsx`:

```tsx
import type { QuoteSummary } from '../domain/quote';
import type { Catalog } from '../domain/types';

interface QuoteImageCardProps {
  catalog: Catalog;
  summary: QuoteSummary;
}

export function QuoteImageCard({ catalog, summary }: QuoteImageCardProps) {
  return (
    <div className="quote-image-card">
      <div className="quote-image-brand">
        <img src="/images/glassmartin-logo.jpg" alt="GlassMartin" />
        <div>
          <strong>{catalog.settings.brandName}</strong>
          <span>{catalog.settings.brandSubtitle}</span>
        </div>
      </div>
      <h2>空间香氛服务询价清单</h2>
      <p>使用场景：{summary.scenario?.name ?? '未选择'}</p>
      <p>精油总升数：{summary.totalOilLiters}L</p>
      {summary.scentItems.map((item) => (
        <p key={item.scent.id}>精油：{item.scent.name} × {item.liters}L</p>
      ))}
      {summary.machineItems.map((item) => (
        <p key={item.machine.id}>扩香机：{item.machine.name} × {item.quantity} 台</p>
      ))}
      {summary.giftMachine && summary.giftMachineCount > 0 ? (
        <p>满赠扩香机：{summary.giftMachine.name} × {summary.giftMachineCount} 台</p>
      ) : null}
      <small>{catalog.settings.finalQuoteNotice}</small>
    </div>
  );
}
```

- [ ] **Step 4: Implement cart drawer**

Create `src/components/QuoteCart.tsx`:

```tsx
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { buildQuoteSummary, createInquiryText } from '../domain/quote';
import type { Catalog, QuoteCart as QuoteCartState } from '../domain/types';
import { QuoteImageCard } from './QuoteImageCard';

interface QuoteCartProps {
  cart: QuoteCartState;
  catalog: Catalog;
  onClose: () => void;
}

export function QuoteCart({ cart, catalog, onClose }: QuoteCartProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const summary = buildQuoteSummary(cart, catalog);
  const inquiryText = createInquiryText(cart, catalog);

  async function copyText() {
    await navigator.clipboard.writeText(inquiryText);
    setCopied(true);
  }

  async function saveImage() {
    if (!imageRef.current) {
      return;
    }
    const dataUrl = await toPng(imageRef.current, { pixelRatio: 2 });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'glassmartin-inquiry.png';
    link.click();
  }

  return (
    <aside className="cart-drawer" aria-label="询价清单">
      <div className="cart-panel">
        <button className="text-button" type="button" onClick={onClose}>关闭</button>
        <h2>询价清单</h2>
        <p>使用场景：{summary.scenario?.name ?? '未选择'}</p>
        <p>精油总升数：{summary.totalOilLiters}L</p>
        {summary.scentItems.map((item) => (
          <p key={item.scent.id}>精油：{item.scent.name} × {item.liters}L</p>
        ))}
        {summary.machineItems.map((item) => (
          <p key={item.machine.id}>扩香机：{item.machine.name} × {item.quantity} 台</p>
        ))}
        {summary.giftMachine && summary.giftMachineCount > 0 ? (
          <p className="gift-line">满赠扩香机：{summary.giftMachine.name} × {summary.giftMachineCount} 台</p>
        ) : null}
        <small>{catalog.settings.finalQuoteNotice}</small>
        <div className="cart-actions">
          <button className="primary-button" type="button" onClick={copyText}>{copied ? '已复制' : '复制文本'}</button>
          <button className="secondary-button" type="button" onClick={saveImage}>生成图片</button>
        </div>
        <div className="quote-image-hidden" ref={imageRef}>
          <QuoteImageCard catalog={catalog} summary={summary} />
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 5: Run cart test to verify pass**

Run:

```bash
npm test -- src/components/QuoteCart.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Manually test copy and image generation**

Run:

```bash
npm run dev
```

Open the local URL, add a 6L scent selection, open the cart, verify `满赠扩香机 × 2 台`, click `复制文本`, and click `生成图片`.

Expected: copied text contains the gift line and the downloaded PNG contains GlassMartin logo and inquiry details.

- [ ] **Step 7: Commit quote cart export**

Run:

```bash
git add src
git commit -m "feat: add inquiry cart exports"
```

Expected: commit is created.

---

### Task 7: Add PWA Install Support And Offline Cache

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/sw.js`
- Create: `src/pwa/registerServiceWorker.ts`
- Modify: `index.html`

- [ ] **Step 1: Create manifest**

Create `public/manifest.webmanifest`:

```json
{
  "name": "GlassMartin 空间香氛服务",
  "short_name": "GlassMartin",
  "description": "GlassMartin 商业空间香氛选型与询价工具",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#111111",
  "icons": [
    {
      "src": "/images/glassmartin-logo.jpg",
      "sizes": "512x512",
      "type": "image/jpeg",
      "purpose": "any"
    }
  ]
}
```

- [ ] **Step 2: Create service worker**

Create `public/sw.js`:

```js
const CACHE_NAME = 'glassmartin-aroma-v1';
const CORE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/data/products.json',
  '/images/glassmartin-logo.jpg',
  '/images/machines/gas-501f.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
```

- [ ] **Step 3: Register service worker**

Create `src/pwa/registerServiceWorker.ts`:

```ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}
```

- [ ] **Step 4: Build app**

Run:

```bash
npm run build
```

Expected: build completes and `dist` exists.

- [ ] **Step 5: Preview production build**

Run:

```bash
npm run preview
```

Expected: local preview serves the built app. In Chrome DevTools Application panel, manifest is detected and service worker is registered.

- [ ] **Step 6: Commit PWA support**

Run:

```bash
git add public src/pwa index.html
git commit -m "feat: add PWA install support"
```

Expected: commit is created.

---

### Task 8: Final Verification And Delivery Notes

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-06-30-glassmartin-aroma-app-design.md` only if implementation reveals a confirmed requirement change.

- [ ] **Step 1: Create README**

Create `README.md`:

```md
# GlassMartin 空间香氛服务 APP

手机端商业香氛选型与询价 PWA。

## 常用命令

- `npm run dev`：本地开发预览
- `npm run build`：生产构建
- `npm test`：运行测试
- `npm run data:build`：从 `data/source/glassmartin-products.xlsx` 导出 `public/data/products.json`

## 产品资料维护

编辑 `data/source/glassmartin-products.xlsx` 中的场景、香型、扩香机、标准方案、促销弹窗和设置表，然后运行 `npm run data:build`。

机器图片放在 `public/images/machines/`，Excel 中填写对应图片路径，例如 `/images/machines/gas-501f.jpg`。

## 赠送规则

默认规则是精油总升数每满 3L，赠送 1 台 GAS-501F 插电蓝牙 APP 款扩香机。规则来自数据文件中的 `settings.giftStepLiters` 和 `settings.giftMachineId`。
```

- [ ] **Step 2: Run all tests**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build pass.

- [ ] **Step 4: Manual mobile flow check**

Run:

```bash
npm run dev
```

Use browser device emulation at 390px width and verify:

- first open shows the recent promotion modal before the homepage;
- homepage shows GlassMartin logo, `澳洲品牌 · 空间香氛服务`, scenario entry, and popular packages;
- entertainment scenario includes KTV / 酒吧 / 台球 / 网咖;
- selecting 6L oil shows 2 gift GAS-501F machines in the inquiry cart;
- copy text includes selected scenario, scents, liters, machines, gift line, and final quote notice;
- generated image includes GlassMartin brand information and inquiry details.

- [ ] **Step 5: Commit documentation and final fixes**

Run:

```bash
git add README.md docs src public data scripts package.json package-lock.json
git commit -m "docs: add GlassMartin app operating notes"
```

Expected: final documentation commit is created.

---

## Self-Review

- Spec coverage: tasks cover brand header, first-open promotion modal, scenario filtering, recommended and inquiry scents, reference price tiers, machine cards, every-3L GAS-501F gift rule, quote text export, quote image export, Excel-to-JSON maintenance, PWA install support, public-link deployment readiness, and README instructions.
- Scope control: backend admin, login, online payment, cloud quote history, automatic final total price, and PDF export remain outside first version.
- Type consistency: `Catalog`, `ScenarioId`, `Scent`, `Machine`, `PackageOption`, `QuoteCart`, `buildQuoteSummary`, and `calculateGiftMachineCount` are defined before use in later tasks.
