import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { BookingPageHeader } from "@/components/appointments/BookingPageHeader";
import { getBookedSlots } from "@/services/appointments/appointmentsService";

const ALL_SLOTS = [
  "09:00", "09:30",
  "10:00", "10:30",
  "12:00", "12:30",
  "14:00", "14:30",
  "16:00", "17:30",
] as const;

function slotIndex(slot: string) {
  return ALL_SLOTS.indexOf(slot as (typeof ALL_SLOTS)[number]);
}

export default function BookingSlotScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["booked-slots", date],
    queryFn: () => getBookedSlots(date),
    enabled: !!date,
    staleTime: 30_000,
  });

  const bookedSet = new Set(bookedSlots);

  const handlePress = (slot: string) => {
    if (bookedSet.has(slot)) return;

    if (!from) {
      setFrom(slot);
      setTo(null);
      return;
    }
    if (slot === from) {
      setFrom(null);
      setTo(null);
      return;
    }
    const fi = slotIndex(from);
    const ti = slotIndex(slot);
    if (ti > fi) {
      // Check that no booked slot falls between from and to
      const range = ALL_SLOTS.slice(fi, ti + 1);
      const conflict = range.some((s) => bookedSet.has(s) && s !== from);
      if (conflict) {
        setFrom(slot);
        setTo(null);
      } else {
        setTo(slot);
      }
    } else {
      setFrom(slot);
      setTo(null);
    }
  };

  const getSlotState = (slot: string): "from" | "to" | "booked" | "idle" => {
    if (bookedSet.has(slot)) return "booked";
    if (slot === from) return "from";
    if (slot === to) return "to";
    return "idle";
  };

  const canProceed = !!from && !!to;

  return (
    <View className="flex-1 bg-background">
      <BookingPageHeader
        title="Choisissez un créneau"
        subtitle="Créneaux affichés en heure locale (Paris)"
      />
      <View className="flex-1 px-screen-x pb-6">
        <View className="flex-1 flex-col">
          {/* Slot grid */}
          <View className="flex-1 flex-row flex-wrap gap-5">
            {ALL_SLOTS.map((t) => {
              const state = getSlotState(t);
              const isBooked = state === "booked";
              const isSelected = state === "from" || state === "to";

              return (
                <Pressable
                  key={t}
                  onPress={() => handlePress(t)}
                  disabled={isBooked}
                  style={{ marginBottom: 4 }}
                  className={[
                    "min-w-[44%] flex-1 rounded-full border py-3.5",
                    isBooked
                      ? "border-[#E5E5E5] bg-[#F3F4F6]"
                      : isSelected
                        ? "border-navy bg-navy"
                        : "border-border bg-surface",
                  ].join(" ")}
                >
                  <Text
                    className={[
                      "text-center font-sans-semibold text-[16px]",
                      isBooked
                        ? "text-[#A3A3A3] line-through"
                        : isSelected
                          ? "text-on-primary"
                          : "text-navy",
                    ].join(" ")}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mb-6 mt-auto">
            <Pressable
              disabled={!canProceed}
              onPress={() =>
                date &&
                from &&
                to &&
                router.push({
                  pathname: "/(app)/booking/client",
                  params: { date, slotFrom: from, slotTo: to },
                })
              }
              className={`rounded-full py-4 ${!canProceed ? "bg-[#E5E5E5]" : "bg-primary"}`}
            >
              <Text
                className={`text-center font-sans-semibold text-body ${!canProceed ? "text-[#A3A3A3]" : "text-on-primary"}`}
              >
                Suivant
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
