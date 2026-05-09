import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { ApiError } from "@/api/types";
import { useCreateAppointmentMutation } from "@/hooks/appointments/useCreateAppointmentMutation";
import {
  bookingClientSchema,
  type BookingClientFormValues,
} from "@/shared/schemas/forms";
import { applyApiErrorsToForm } from "@/shared/utils/applyApiFieldErrors";
import { slotToStartsEndsIso } from "@/lib/bookingIso";
import { BookingPageHeader } from "./BookingPageHeader";

export default function BookingClientScreen() {
  const { date, slot } = useLocalSearchParams<{ date: string; slot: string }>();
  const dateKey = typeof date === "string" ? date : "";
  const slotKey = typeof slot === "string" ? slot : "";
  const [rootMessage, setRootMessage] = useState<string | null>(null);
  const createAppt = useCreateAppointmentMutation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<BookingClientFormValues>({
    resolver: zodResolver(bookingClientSchema),
    defaultValues: { name: "", phone: "", email: "", serviceLabel: "" },
  });

  const onSubmit = async (values: BookingClientFormValues) => {
    try {
      const { startsAt, endsAt } = slotToStartsEndsIso(dateKey, slotKey);
      await createAppt.mutateAsync({
        client: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim().toLowerCase(),
        },
        serviceLabel: values.serviceLabel?.trim() || "Rendez-vous",
        startsAt,
        endsAt,
      });
      router.dismissTo("/(app)/(tabs)/rendez-vous");
    } catch (e) {
      if (e instanceof ApiError)
        applyApiErrorsToForm(e.body, setError, setRootMessage, [
          "name",
          "phone",
          "email",
        ]);
      else
        setRootMessage(
          e instanceof Error
            ? e.message
            : "Impossible de creer le rendez-vous.",
        );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <BookingPageHeader
        title="Infos client"
        subtitle="Renseignez les informations du client"
      />
      <View className="flex-1 px-screen-x pb-10">
        <Text className="mt-4 font-sans text-body text-muted-foreground">
          {dateKey && slotKey
            ? `${dateKey} - ${slotKey}`
            : "Date et creneau non renseignes"}
        </Text>
        {rootMessage ? (
          <Text className="mt-3 font-sans text-caption text-destructive">
            {rootMessage}
          </Text>
        ) : null}
        {(["name", "phone", "email"] as const).map((field) => (
          <Controller
            key={field}
            control={control}
            name={field}
            render={({ field: f }) => (
              <TextInput
                value={f.value}
                onChangeText={f.onChange}
                onBlur={f.onBlur}
                className="font-sans mt-4 rounded-input border border-border bg-surface px-4 py-3 text-body text-navy"
                placeholder={field}
              />
            )}
          />
        ))}
        {errors.email ? (
          <Text className="mt-1 font-sans text-caption text-destructive">
            {errors.email.message}
          </Text>
        ) : null}
        <Pressable
          disabled={createAppt.isPending}
          onPress={() => void handleSubmit(onSubmit)()}
          className={`mt-auto rounded-full py-4 ${createAppt.isPending ? "bg-[#E5E5E5]" : "bg-primary"}`}
        >
          {createAppt.isPending ? (
            <ActivityIndicator color="#A3A3A3" />
          ) : (
            <Text className="text-center font-sans-semibold text-body text-on-primary">
              Enregistrer le rendez-vous
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
