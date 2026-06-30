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

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  linkType: 'scenario' | 'package' | 'none';
  targetId: string;
  sortOrder: number;
  enabled: boolean;
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
  banners: Banner[];
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
