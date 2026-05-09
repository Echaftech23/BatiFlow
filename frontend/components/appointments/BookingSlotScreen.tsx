import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BookingPageHeader } from "./BookingPageHeader";

const SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

export default function BookingSlotScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [slot, setSlot] = useState<string | null>(null);
  return (
    <View className="flex-1 bg-background">
      <BookingPageHeader
        title="Choisissez un créneau"
        subtitle="Créneaux affichés en heure locale (Paris)"
      />
      <View className="flex-1 px-screen-x pb-6">
      <View className="flex-1 flex-col">
        <View className="flex-row flex-wrap gap-4 flex-1">
          {SLOTS.map((t) => {
            const active = slot === t;
            return (
              <Pressable
                key={t}
                onPress={() => setSlot(t)}
                className={`min-w-[44%] flex-1 rounded-full border py-3 ${active ? "border-primary bg-primary" : "border-border bg-surface"}`}
                style={{ marginBottom: 16 }}
              >
                <Text
                  className={`text-center font-sans-semibold text-[17px] ${active ? "text-on-primary" : "text-navy"}`}
                >
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View className="mt-auto mb-6">
          <Pressable
            disabled={!slot}
            onPress={() =>
              date &&
              slot &&
              router.push({
                pathname: "/(app)/booking/client",
                params: { date, slot },
              })
            }
            className={`rounded-full py-4 ${!slot ? "bg-[#E5E5E5]" : "bg-primary"}`}
          >
            <Text
              className={`text-center font-sans-semibold text-body ${!slot ? "text-[#A3A3A3]" : "text-on-primary"}`}
            >
              Continuer
            </Text>
          </Pressable>
        </View>
      </View>
 
      </View>
    </View>
  );
}
