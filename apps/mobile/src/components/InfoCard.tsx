import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { lightTheme } from "../theme/theme";

type InfoCardProps = {
  title: string;
  value?: string;
  children?: ReactNode;
};

export function InfoCard({ title, value, children }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    borderRadius: 12,
    backgroundColor: lightTheme.colors.surface
  },
  title: {
    color: lightTheme.colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  value: {
    marginTop: 8,
    color: lightTheme.colors.maroon,
    fontSize: 24,
    fontWeight: "800"
  }
});
