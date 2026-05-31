import { Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { lightTheme } from "../theme/theme";

type LogoProps = {
  size?: number;
};

export function Logo({ size = 64 }: LogoProps) {
  return (
    <LinearGradient
      colors={[lightTheme.colors.maroon, lightTheme.colors.gold]}
      style={[styles.mark, { width: size, height: size, borderRadius: size / 2 }]}
      accessible
      accessibilityLabel="Jain Jewellers JJ diamond logo"
    >
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>JJ</Text>
      <View style={[styles.diamond, { width: size * 0.2, height: size * 0.2 }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "#FFFFFF",
    fontFamily: "Georgia",
    fontWeight: "800",
    letterSpacing: 1
  },
  diamond: {
    position: "absolute",
    bottom: 10,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }]
  }
});
