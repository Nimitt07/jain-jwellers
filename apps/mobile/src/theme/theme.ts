import { brand } from "@jain-jewellers/shared";

export const lightTheme = {
  colors: {
    maroon: brand.colors.maroon,
    gold: brand.colors.gold,
    ivory: brand.colors.ivory,
    background: "#FFF8F0",
    surface: "#FFFFFF",
    text: "#17110D",
    muted: "#6F625A",
    border: "#E9DCCB",
    success: "#16794C"
  }
};

export const darkTheme = {
  colors: {
    maroon: "#3F0710",
    gold: brand.colors.gold,
    ivory: "#241813",
    background: "#110D0B",
    surface: "#1B1411",
    text: "#FFF8F0",
    muted: "#CDBFAF",
    border: "#3A2A24",
    success: "#7EE2A8"
  }
};

export type JainTheme = typeof lightTheme;
