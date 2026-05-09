import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BatiCalendar } from "@/lib/calendarTheme";
import { BookingPageHeader } from "@/components/appointments/BookingPageHeader";
import { useAppointmentsQuery } from "@/hooks/appointments/useAppointmentsQuery";
import { computeFullyBookedDates } from "@/shared/schemas/appointmentsSchemas";

export default function BookingDateScreen() {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const { data: appointments } = useAppointmentsQuery();

  const fullyBookedDates = useMemo(
    () => computeFullyBookedDates(appointments ?? []),
    [appointments],
  );

  const markedDates = useMemo(() => {
    const map: Record<string, object> = {};

    for (const date of fullyBookedDates) {
      map[date] = { disabled: true, disableTouchEvent: true };
    }

    if (dateKey) {
      map[dateKey] = {
        ...map[dateKey],
        selected: true,
        selectedColor: "#F27427",
        selectedTextColor: "#FFFFFF",
      };
    }

    return map;
  }, [fullyBookedDates, dateKey]);

  const isSelectedFullyBooked = dateKey ? fullyBookedDates.has(dateKey) : false;

  return (
    <View className="flex-1 bg-background">
      <BookingPageHeader
        title="Choisissez une date"
        subtitle="Les dates grisées sont entièrement réservées"
      />
      <View className="flex-1 flex-col justify-between px-screen-x pb-6">
        <BatiCalendar
          markedDates={markedDates}
          onDayPress={(dateString) => {
            if (!fullyBookedDates.has(dateString)) setDateKey(dateString);
          }}
        />
        <Pressable
          disabled={!dateKey || isSelectedFullyBooked}
          onPress={() =>
            dateKey &&
            !isSelectedFullyBooked &&
            router.push({
              pathname: "/(app)/booking/slot",
              params: { date: dateKey },
            })
          }
          className={`mb-6 rounded-full py-4 ${!dateKey || isSelectedFullyBooked ? "bg-[#E5E5E5]" : "bg-primary"}`}
        >
          <Text
            className={`text-center font-sans-semibold text-body ${!dateKey || isSelectedFullyBooked ? "text-[#A3A3A3]" : "text-on-primary"}`}
          >
            Suivant
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
