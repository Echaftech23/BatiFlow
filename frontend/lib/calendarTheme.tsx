import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import "@/lib/calendarLocaleFr";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const MONTH_NAMES_SHORT = [
  "JANV",
  "FÉVR",
  "MARS",
  "AVR",
  "MAI",
  "JUIN",
  "JUIL",
  "AOÛT",
  "SEPT",
  "OCT",
  "NOV",
  "DÉC",
];

export const calendarTheme = {
  backgroundColor: "transparent",
  calendarBackground: "transparent",
  textSectionTitleColor: "#6B7280",
  textDayHeaderFontFamily: "Poppins_500Medium",
  textDayHeaderFontSize: 12,
  dayTextColor: "#1A2B48",
  textDayFontFamily: "Poppins_400Regular",
  textDayFontSize: 14,
  textDisabledColor: "#D1D5DB",
  todayTextColor: "#1A2B48",
  selectedDayBackgroundColor: "#F27427",
  selectedDayTextColor: "#FFFFFF",
  monthTextColor: "#1A2B48",
  textMonthFontFamily: "Poppins_600SemiBold",
  textMonthFontSize: 16,
  arrowColor: "#6B7280",
  "stylesheet.calendar.header": {
    week: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 4,
      marginBottom: 8,
    },
  },
} satisfies Record<string, unknown>;

interface DayComponentProps {
  date?: { day: number; month: number; year: number; dateString: string };
  state?: "disabled" | "today" | "";
  marking?: {
    selected?: boolean;
    selectedColor?: string;
    selectedTextColor?: string;
    marked?: boolean;
    dotColor?: string;
  };
  onPress?: (date: { dateString: string }) => void;
}

function CalendarDayComponent({
  date,
  state,
  marking,
  onPress,
}: DayComponentProps) {
  if (!date) return null;

  const isToday = state === "today";
  const isDisabled = state === "disabled";
  const isSelected = marking?.selected;
  const isMarked = marking?.marked;

  const showCircle = isSelected || isMarked;
  const bgColor = showCircle
    ? (marking?.selectedColor ?? "#F27427")
    : "transparent";

  const textColor = showCircle ? "#FFFFFF" : isDisabled ? "#D1D5DB" : "#1A2B48";

  return (
    <Pressable
      onPress={() => onPress?.({ dateString: date.dateString } as any)}
      disabled={isDisabled}
      className="items-center justify-center"
      style={{ width: 40, height: 40 }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: 36,
          height: 36,
          backgroundColor: bgColor,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontFamily: isToday ? "Poppins_600SemiBold" : "Poppins_400Regular",
            fontSize: 14,
            textDecorationLine: isToday && !showCircle ? "underline" : "none",
            textDecorationColor: "#1A2B48",
          }}
        >
          {date.day}
        </Text>
      </View>
    </Pressable>
  );
}

function toDateString(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-01`;
}

interface BatiCalendarProps {
  markedDates?: Record<string, any>;
  onDayPress?: (dateString: string) => void;
}

export function BatiCalendar({ markedDates, onDayPress }: BatiCalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;

  const goBack = useCallback(() => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goForward = useCallback(() => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  return (
    <View>
      {/* Month navigation header */}
      <View className="flex-row items-center justify-between rounded-card bg-white p-5">
        <Pressable
          onPress={goBack}
          hitSlop={12}
          className="flex-row items-center gap-1"
        >
          <ChevronLeft size={18} color="#6B7280" />
          <Text className="font-semibold text-[16px] font-quicksand text-muted-foreground">
            {MONTH_NAMES_SHORT[prevMonth]}
          </Text>
        </Pressable>

        <Text className="font-semibold text-[16px] font-quicksand text-navy">
          {MONTH_NAMES[month]} {year}
        </Text>

        <Pressable
          onPress={goForward}
          hitSlop={12}
          className="flex-row items-center gap-1.5"
        >
          <Text className="font-semibold text-[16px] font-quicksand text-muted-foreground">
            {MONTH_NAMES_SHORT[nextMonth]}
          </Text>
          <ChevronRight size={18} color="#6B7280" />
        </Pressable>
      </View>

      {/* Calendar grid (day names + numbers) */}
      <View className="mt-5 rounded-card bg-surface p-3 shadow-card">
        <Calendar
          key={toDateString(year, month)}
          current={toDateString(year, month)}
          markedDates={markedDates}
          onDayPress={(d) => onDayPress?.(d.dateString)}
          firstDay={1}
          hideArrows
          hideExtraDays={false}
          renderHeader={() => <View style={{ height: 0 }} />}
          theme={calendarTheme}
          dayComponent={(props: any) => (
            <CalendarDayComponent
              date={props.date}
              state={props.state}
              marking={props.marking}
              onPress={() => props.date && onDayPress?.(props.date.dateString)}
            />
          )}
        />
      </View>
    </View>
  );
}
