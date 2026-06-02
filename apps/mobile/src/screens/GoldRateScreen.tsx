import { Text } from "react-native";
import { currentDemoRate, formatINR } from "@jain-jewellers/shared";
import { InfoCard } from "../components/InfoCard";
import { Screen } from "../components/Screen";

export function GoldRateScreen() {
  return (
    <Screen eyebrow="Auto refresh every 5 minutes" title="Gold Rate Tracker">
      <InfoCard title="22K Gold" value={`${formatINR(currentDemoRate.rate22k)} / g`} />
      <InfoCard title="24K Gold" value={`${formatINR(currentDemoRate.rate24k)} / g`} />
      <InfoCard title="20K Gold" value={`${formatINR(currentDemoRate.rate20k)} / g`} />
      <InfoCard title="18K Gold" value={`${formatINR(currentDemoRate.rate18k)} / g`} />
      <InfoCard title="Silver" value={`${formatINR(currentDemoRate.silverRate)} / g`} />
      <Text>Next module will add city comparison, history chart and rate alerts.</Text>
    </Screen>
  );
}
