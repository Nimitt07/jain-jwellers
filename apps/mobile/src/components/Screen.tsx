import type { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { brand } from "@jain-jewellers/shared";
import { lightTheme } from "../theme/theme";

type ScreenProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export function Screen({ eyebrow, title, children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: lightTheme.colors.background
  },
  content: {
    padding: 20,
    paddingBottom: 110
  },
  eyebrow: {
    color: brand.colors.gold,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  title: {
    marginTop: 8,
    color: lightTheme.colors.text,
    fontFamily: "Georgia",
    fontSize: 34,
    fontWeight: "700"
  },
  body: {
    marginTop: 18,
    gap: 14
  }
});
