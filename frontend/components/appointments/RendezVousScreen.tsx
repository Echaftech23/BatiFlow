import { router } from "expo-router";
import { Bell, CalendarDays, List, Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ApiError } from "@/api/types";
import { AppointmentCard } from "../AppointmentCard";
import { DayAppointmentsModal } from "./DayAppointmentsModal";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { RegisterBrandLogo } from "@/components/register/RegisterBrandLogo";
import { useAppointmentsQuery } from "@/hooks/appointments/useAppointmentsQuery";
import { useConfirmAppointmentMutation } from "@/hooks/appointments/useConfirmAppointmentMutation";
import { BatiCalendar } from "@/lib/calendarTheme";
import {
  appointmentsToMarkedDates,
  type Appointment,
} from "@/shared/schemas/appointmentsSchemas";

type ViewMode = "list" | "calendar";

export default function RendezVousScreen() {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalDay, setModalDay] = useState<string | null>(null);
  const { data, isPending, isError, error, refetch, isRefetching } =
    useAppointmentsQuery();
  const items = data ?? [];
  const confirmMutation = useConfirmAppointmentMutation();

  const onConfirm = (id: string) => {
    confirmMutation.mutate(id, {
      onError: (e) => {
        const msg =
          e instanceof ApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Echec de la confirmation";
        Alert.alert("Confirmation", msg);
      },
    });
  };

  const modalItems: Appointment[] = modalDay
    ? items.filter((a) => a.dateKey === modalDay)
    : [];
  const markedDates = useMemo(() => {
    const base = appointmentsToMarkedDates(items);
    const out: Record<
      string,
      {
        marked?: boolean;
        dotColor?: string;
        selected?: boolean;
        selectedColor?: string;
      }
    > = { ...base };
    if (selectedDay)
      out[selectedDay] = {
        ...out[selectedDay],
        selected: true,
        selectedColor: "#F27427",
        marked: out[selectedDay]?.marked ?? false,
        dotColor: out[selectedDay]?.dotColor ?? "#F27427",
      };
    return out;
  }, [items, selectedDay]);

  if (isPending && items.length === 0)
    return <GlobalLoader label="Chargement des rendez-vous..." />;

  return (
    <View className="flex-1 bg-background">
      {/* Header — logo + notification icon */}
      <View
        className="bg-surface px-screen-x pb-3"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <RegisterBrandLogo width={40} height={36} />
          <Pressable
            hitSlop={24}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={24} color="#1A2B48" strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* Title + view mode switch */}
      <View className="mt-8 px-screen-x">
        <Text className="font-bold text-title font-quicksand text-navy">
          Mes rendez-vous
        </Text>

        <View className="mt-4 rounded-full border border-border bg-muted p-1">
          <View className="flex-row gap-1">
            <Pressable
              onPress={() => setViewMode("list")}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-full py-2.5 ${viewMode === "list" ? "bg-surface" : ""}`}
              style={viewMode === "list" ? shadows.segmented : undefined}
            >
              <List
                size={15}
                color={viewMode === "list" ? "#1A2B48" : "#9CA3AF"}
                strokeWidth={2}
              />
              <Text
                className={`font-sans-medium text-body ${viewMode === "list" ? "text-navy" : "text-muted-foreground"}`}
              >
                Vue liste
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode("calendar")}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-full py-2.5 ${viewMode === "calendar" ? "bg-surface" : ""}`}
              style={viewMode === "calendar" ? shadows.segmented : undefined}
            >
              <CalendarDays
                size={15}
                color={viewMode === "calendar" ? "#1A2B48" : "#9CA3AF"}
                strokeWidth={2}
              />
              <Text
                className={`font-sans-medium text-body ${viewMode === "calendar" ? "text-navy" : "text-muted-foreground"}`}
              >
                Vue calendrier
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      {viewMode === "list" ? (
        <FlatList
          data={items}
          keyExtractor={(a) => a.id}
          contentContainerClassName="px-screen-x py-4 pb-28"
          ListHeaderComponent={
            isError ? (
              <Text className="mb-2 font-sans text-caption text-destructive">
                {error instanceof Error
                  ? error.message
                  : "Erreur reseau ou serveur."}
              </Text>
            ) : isRefetching ? (
              <View className="mb-2 flex-row items-center gap-2">
                <ActivityIndicator color="#F27427" />
                <Text className="font-sans text-caption text-muted-foreground">
                  Actualisation...
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <AppointmentCard item={item} onConfirm={onConfirm} />
          )}
          ItemSeparatorComponent={() => <View className="h-4" />}
        />
      ) : (
        <View className="flex-1 px-screen-x pb-28 pt-5">
          <BatiCalendar
            markedDates={markedDates}
            onDayPress={(dateString) => {
              setSelectedDay(dateString);
              if (items.some((a) => a.dateKey === dateString))
                setModalDay(dateString);
            }}
          />
        </View>
      )}
      <Pressable
        onPress={() => router.push("/(app)/booking/date")}
        className="absolute right-4 h-[72px] w-[73px] items-center justify-center rounded-full bg-primary"
        style={[shadows.fab, { bottom: 10 }]}
      >
        <Plus size={40} color="#FFFFFF" strokeWidth={2} />
      </Pressable>
      <DayAppointmentsModal
        day={modalDay}
        items={modalItems}
        onClose={() => setModalDay(null)}
        onConfirm={onConfirm}
      />
    </View>
  );
}

const shadows = StyleSheet.create({
  segmented: {
    shadowColor: "#1A2B48",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  fab: {
    shadowColor: "#F27427",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
});
