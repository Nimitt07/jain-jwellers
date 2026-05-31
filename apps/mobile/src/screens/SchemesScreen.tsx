import { Text } from "react-native";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";

export function SchemesScreen() {
  return (
    <Screen eyebrow="Monthly saving plans" title="Jain Saving Schemes">
      <InfoCard title="Golden Bloom" value="11 EMIs">
        <Text>Get 18% off making charges at maturity.</Text>
      </InfoCard>
      <InfoCard title="Golden Glow" value="Locked grams">
        <Text>Accumulate gold grams monthly and buy at locked rate.</Text>
      </InfoCard>
      <InfoCard title="Smart Pick" value="Design upfront">
        <Text>Select a design now, pay monthly, collect on maturity.</Text>
      </InfoCard>
    </Screen>
  );
}
