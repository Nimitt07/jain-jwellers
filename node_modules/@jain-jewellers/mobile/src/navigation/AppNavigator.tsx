import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { CatalogueScreen } from "../screens/CatalogueScreen";
import { GoldRateScreen } from "../screens/GoldRateScreen";
import { SchemesScreen } from "../screens/SchemesScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { lightTheme } from "../theme/theme";

export type RootTabParamList = {
  Home: undefined;
  Catalogue: undefined;
  "Gold Rate": undefined;
  Schemes: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home-outline",
  Catalogue: "diamond-outline",
  "Gold Rate": "trending-up-outline",
  Schemes: "wallet-outline",
  Profile: "person-circle-outline"
};

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: lightTheme.colors.gold,
        tabBarInactiveTintColor: "#8C7B70",
        tabBarStyle: {
          borderTopColor: "#E9DCCB",
          height: 68,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} color={color} size={size} accessibilityElementsHidden />
        )
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Catalogue" component={CatalogueScreen} />
      <Tab.Screen name="Gold Rate" component={GoldRateScreen} />
      <Tab.Screen name="Schemes" component={SchemesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
