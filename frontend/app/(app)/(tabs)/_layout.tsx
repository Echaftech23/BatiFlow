import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#F27427";
const INACTIVE = "#9CA3AF";

const TAB_CONFIG = [
  {
    name: "index",
    label: "Accueil",
    icon: require("../../../assets/icons/home.png") as number,
  },
  {
    name: "rendez-vous",
    label: "Rendez-vous",
    icon: require("../../../assets/icons/calender.png") as number,
  },
  {
    name: "roi",
    label: "ROI",
    icon: require("../../../assets/icons/roi.png") as number,
  },
  {
    name: "parametres",
    label: "Paramètres",
    icon: require("../../../assets/icons/setting.png") as number,
  },
] as const;

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const tab = TAB_CONFIG[index];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.item}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={
              options.tabBarAccessibilityLabel ?? tab.label
            }
            android_ripple={{ color: "rgba(242,116,39,0.12)", radius: 60 }}
          >
            <View style={[styles.pill, focused && styles.pillActive]}>
              <Image
                source={tab.icon}
                style={[
                  styles.icon,
                  { tintColor: focused ? "#FFFFFF" : INACTIVE },
                ]}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? "#FFFFFF" : INACTIVE,
                    fontFamily: focused
                      ? "Poppins_500Medium"
                      : "Poppins_400Regular",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8EAEF",
    paddingTop: 4,
    paddingHorizontal: 4,
    shadowColor: "#1A2B48",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 16,
  },
  item: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
    gap: 3,
  },
  pill: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  pillActive: {
    backgroundColor: PRIMARY,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
  },
});

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
    >
      <Tabs.Screen name="index" options={{ title: "Accueil" }} />
      <Tabs.Screen name="rendez-vous" options={{ title: "Rendez-vous" }} />
      <Tabs.Screen name="roi" options={{ title: "ROI" }} />
      <Tabs.Screen name="parametres" options={{ title: "Paramètres" }} />
    </Tabs>
  );
}
