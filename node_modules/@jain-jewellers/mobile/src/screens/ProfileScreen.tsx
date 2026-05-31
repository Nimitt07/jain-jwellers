import { Text } from "react-native";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";

export function ProfileScreen() {
  return (
    <Screen eyebrow="Jain Jewels Club" title="Profile">
      <InfoCard title="Loyalty tier" value="Gold">
        <Text>Points, orders, schemes, wishlist, invoices, certificates and language settings will live here.</Text>
      </InfoCard>
      <InfoCard title="Help & Support">
        <Text>FAQ, live chat, call us, privacy settings and notification preferences.</Text>
      </InfoCard>
    </Screen>
  );
}
