import { Text } from "react-native";
import { calculateProductPrice, currentDemoRate, formatINR, seedProducts } from "@jain-jewellers/shared";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";

export function CatalogueScreen() {
  return (
    <Screen eyebrow="Catalogue" title="Browse Jewellery">
      {seedProducts.map((product) => {
        const price = calculateProductPrice(product, currentDemoRate);
        return (
          <InfoCard key={product.id} title={`${product.subCategory} - ${product.purityKt}K`} value={formatINR(price.total)}>
            <Text>{product.name}</Text>
            <Text>{product.netWeight}g net weight - HUID {product.hallmarkId}</Text>
          </InfoCard>
        );
      })}
    </Screen>
  );
}
