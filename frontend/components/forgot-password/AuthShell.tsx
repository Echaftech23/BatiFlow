import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

import { LoginBrandLogo } from "../LoginBrandLogo";

const HEADER_BG = "#15325B";

const BACK_SHADOW = {
  shadowColor: "#1A2B48",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
} as const;

type HeaderTypography = "paragraph" | "stacked";

type Props = {
  /** One or more lines; `paragraph` joins with a space (email hero). */
  headerLines: readonly string[];
  /** `paragraph`: single block under the logo. `stacked`: two-line reset style. */
  headerTypography?: HeaderTypography;
  onBack: () => void;
  children: ReactNode;
};

/** Navy header + white rounded card body (forgot / reset password flow). */
export function ForgotPasswordAuthShell({
  headerLines,
  headerTypography = "stacked",
  onBack,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const copy =
    headerTypography === "paragraph" ? headerLines.join(" ") : null;

  return (
    <View className="flex-1" style={{ backgroundColor: HEADER_BG }}>
      <View
        className="px-screen-x pb-4"
        style={{ paddingTop: insets.top + 22 }}
      >
        <View className="relative min-h-[52px] justify-center mb-10">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={onBack}
            className="absolute left-0 top-0 z-10 h-10 w-10 items-center justify-center rounded-full bg-white"
            style={BACK_SHADOW}
          >
            <ChevronLeft size={22} color="#000000" strokeWidth={2} />
          </Pressable>
          <View className="items-center pt-14">
            <LoginBrandLogo width={40} height={35} />
            {headerTypography === "paragraph" && copy ? (
              <Text className="mx-4 mt-6 text-center font-medium text-[16px] leading-normal text-white">
                {copy}
              </Text>
            ) : (
              <View className="mt-6 max-w-[300px] gap-y-2 px-4">
                {headerLines.map((line, idx) => (
                  <Text
                    key={`${idx}-${line.slice(0, 32)}`}
                    className="text-center font-meduim text-medium leading-normal text-white"
                  >
                    {line}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
      <View className="flex-1 overflow-hidden rounded-t-[40px] bg-white pt-6">
        {children}
      </View>
    </View>
  );
}
