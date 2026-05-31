export const brand = {
  name: "Jain Jewellers",
  tagline: "Pure. Trusted. Timeless.",
  colors: {
    maroon: "#6B0F1A",
    gold: "#C9A84C",
    ivory: "#FFF8F0",
    ink: "#17110D"
  },
  fonts: {
    heading: "Playfair Display",
    body: "Inter"
  }
} as const;

export const categories = [
  "Gold",
  "Diamond",
  "Silver",
  "Platinum",
  "Gemstone",
  "Coins & Bars"
] as const;

export const bottomTabs = ["Home", "Catalogue", "Gold Rate", "Schemes", "Profile"] as const;
