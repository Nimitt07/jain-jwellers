import "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { darkTheme, lightTheme } from "./src/theme/theme";

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <NavigationContainer
      theme={{
        ...(scheme === "dark" ? DarkTheme : DefaultTheme),
        colors: {
          ...(scheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
          primary: theme.colors.gold,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border
        }
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
}
