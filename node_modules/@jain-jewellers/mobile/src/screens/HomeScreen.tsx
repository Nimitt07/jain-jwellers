import { Text, View, StyleSheet } from "react-native";
import { brand, categories, currentDemoRate, formatINR, seedProducts } from "@jain-jewellers/shared";
import { InfoCard } from "../components/InfoCard";
import { Logo } from "../components/Logo";
import { Screen } from "../components/Screen";
import { lightTheme } from "../theme/theme";

export function HomeScreen() {
  return (
    <Screen eyebrow={brand.tagline} title="Jain Jewellers">
      <View style={styles.hero}>
        <Logo size={76} />
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Wedding season collections are live</Text>
          <Text style={styles.heroCopy}>Explore hallmark jewellery, live prices and Jain Jewels Club benefits.</Text>
        </View>
      </View>

      <InfoCard title={`Live ${currentDemoRate.city} 22K rate`} value={`${formatINR(currentDemoRate.rate22k)} / g`} />

      <View style={styles.grid}>
        {categories.map((category) => (
          <View key={category} style={styles.category}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
      </View>

      <InfoCard title="Trending Now">
        {seedProducts.map((product) => (
          <Text key={product.id} style={styles.listItem}>{product.name}</Text>
        ))}
      </InfoCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "row",
    gap: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: lightTheme.colors.maroon
  },
  heroText: {
    flex: 1,
    justifyContent: "center"
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800"
  },
  heroCopy: {
    marginTop: 6,
    color: "#F6E7D5",
    lineHeight: 20
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  category: {
    width: "31%",
    minHeight: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: lightTheme.colors.border
  },
  categoryText: {
    color: lightTheme.colors.text,
    fontWeight: "800",
    textAlign: "center"
  },
  listItem: {
    paddingTop: 10,
    color: lightTheme.colors.text,
    fontWeight: "700"
  }
});
