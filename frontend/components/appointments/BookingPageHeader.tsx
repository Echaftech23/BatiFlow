import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BookingPageHeaderProps = {
  title: string;
  subtitle: string;
};

export function BookingPageHeader({ title, subtitle }: BookingPageHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View
        className="flex-row items-center border-b border-border bg-background px-screen-x"
        style={{ paddingTop: insets.top, height: insets.top + 52 }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          hitSlop={8}
          className="h-10 w-10 items-center justify-center"
        >
          <ArrowLeft size={22} color="#1A2B48" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Title + subtitle below the bar */}
      <View className="mt-6 px-screen-x mb-10">
        <Text className="text-center font-bold font-quicksand text-[20px] text-navy">
          {title}
        </Text>
        <Text className="mt-2 text-center font-sans text-body text-muted-foreground">
          {subtitle}
        </Text>
      </View>
    </>
  );
}
