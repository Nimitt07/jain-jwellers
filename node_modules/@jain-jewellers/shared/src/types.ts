export type MetalType = "gold" | "diamond" | "silver" | "platinum" | "gemstone";

export type PurityKt = 18 | 22 | 24 | 925 | 950;

export type ProductCategory =
  | "Gold"
  | "Diamond"
  | "Silver"
  | "Platinum"
  | "Gemstone"
  | "Coins & Bars";

export type ProductSubCategory =
  | "Necklaces"
  | "Rings"
  | "Earrings"
  | "Bangles"
  | "Pendants"
  | "Chains"
  | "Nose Pins"
  | "Anklets"
  | "Bracelets"
  | "Mangalsutra"
  | "Men's Jewellery"
  | "Kids' Collection";

export type Occasion = "Wedding" | "Daily wear" | "Festive" | "Office" | "Gifting";

export type GoldRate = {
  city: string;
  date: string;
  rate22k: number;
  rate24k: number;
  rate18k: number;
  silverRate: number;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  metal: MetalType;
  purityKt: PurityKt;
  grossWeight: number;
  netWeight: number;
  makingChargePct: number;
  labourCharge?: number;
  stoneDetails?: string;
  images: string[];
  stockQty: number;
  hallmarkId: string;
  collectionName: string;
  occasion: Occasion;
  rating: number;
  popularity: number;
  description: string;
  createdAt: string;
};

export type PriceBreakdown = {
  metalValue: number;
  makingCharges: number;
  labourCharge: number;
  taxableAmount: number;
  gst: number;
  total: number;
  ratePerGram: number;
};

export type SchemePlanType = "Golden Bloom" | "Golden Glow" | "Smart Pick";

export type LoyaltyTier = "Silver" | "Gold" | "Platinum" | "Diamond";
