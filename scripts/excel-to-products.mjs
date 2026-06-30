import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
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
    banners: (rows.banners ?? []).map((row) => ({
      id: String(row.id),
      title: String(row.title),
      subtitle: String(row.subtitle),
      image: String(row.image),
      linkType: String(row.linkType || 'none'),
      targetId: String(row.targetId || ''),
      sortOrder: Number(row.sortOrder),
      enabled: bool(row.enabled),
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
  const workbook = XLSX.read(fs.readFileSync(sourcePath));
  return rowsToCatalog({
    scenes: sheetRows(workbook, 'scenes'),
    scents: sheetRows(workbook, 'scents'),
    machines: sheetRows(workbook, 'machines'),
    packages: sheetRows(workbook, 'packages'),
    settings: sheetRows(workbook, 'settings'),
    promotions: sheetRows(workbook, 'promotions'),
    banners: sheetRows(workbook, 'banners'),
  });
}

if (path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = readWorkbookToCatalog(SOURCE);
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`Wrote ${OUTPUT}`);
}
