import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { BatiCalendar } from "@/lib/calendarTheme";
import { BookingPageHeader } from "./BookingPageHeader";

export default function BookingDateScreen() {
  const [dateKey, setDateKey] = useState<string | null>(null);

  const markedDates = dateKey
    ? {
        [dateKey]: {
          selected: true,
          selectedColor: "#F27427",
          selectedTextColor: "#FFFFFF",
        },
      }
    : {};

  return (
    <View className="flex-1 bg-background">
      <BookingPageHeader
        title="Choisissez une date"
        subtitle="Sélectionnez une date pour le rendez-vous"
      />
      <View className="flex-1 px-screen-x pb-6">
        <BatiCalendar
          markedDates={markedDates}
          onDayPress={(dateString) => setDateKey(dateString)}
        />
        <Pressable
          disabled={!dateKey}
          onPress={() =>
            dateKey &&
            router.push({
              pathname: "/(app)/booking/slot",
              params: { date: dateKey },
            })
          }
          className={`mt-6 rounded-full py-4 ${!dateKey ? "bg-[#E5E5E5]" : "bg-primary"}`}
        >
          <Text
            className={`text-center font-sans-semibold text-body ${!dateKey ? "text-[#A3A3A3]" : "text-on-primary"}`}
          >
            Suivant
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
