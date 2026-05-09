import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabEntry = { name: string; label: string; icon: number };

const TABS: TabEntry[] = [
  { name: "index",       label: "Accueil",     icon: require("../../../assets/icons/home.png") as number },
  { name: "rendez-vous", label: "Rendez-vous",  icon: require("../../../assets/icons/calender.png") as number },
  { name: "roi",         label: "ROI",          icon: require("../../../assets/icons/roi.png") as number },
  { name: "parametres",  label: "Paramètres",   icon: require("../../../assets/icons/setting.png") as number },
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t border-border bg-surface px-1 pt-1"
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        shadowColor: "#1A2B48",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 16,
      }}
    >
      {TABS.map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
        const route = routeIndex !== -1 ? state.routes[routeIndex] : null;
        const focused = routeIndex !== -1 && state.index === routeIndex;

        const onPress = () => {
          if (!route) return;
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const accessibilityLabel =
          (route && descriptors[route.key]?.options.tabBarAccessibilityLabel) ??
          tab.label;

        return (
          <Pressable
            key={tab.name}
            onPress={onPress}
            className="flex-1 justify-center gap-[3px] py-2.5"
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={accessibilityLabel}
            android_ripple={route ? { color: "rgba(242,116,39,0.12)", radius: 60 } : undefined}
          >
            <View className={`items-center rounded-pill px-2.5 py-2 ${focused ? "bg-primary" : "bg-transparent"}`}>
              <Image
                source={tab.icon}
                className="h-5 w-5"
                style={{ tintColor: focused ? "#FFFFFF" : "#9CA3AF" }}
                resizeMode="contain"
              />
              <Text className={`text-[11px] leading-[15px] ${focused ? "font-sans-medium text-white" : "font-sans text-[#9CA3AF]"}`}>
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    >
      <Tabs.Screen name="rendez-vous" options={{ title: "Rendez-vous" }} />
      <Tabs.Screen name="parametres" options={{ title: "Paramètres" }} />
    </Tabs>
  );
}
