import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { ApiError } from "@/api/types";
import { useCreateAppointmentMutation } from "@/hooks/appointments/useCreateAppointmentMutation";
import {
  bookingClientSchema,
  type BookingClientFormValues,
} from "@/shared/schemas/forms";
import { applyApiErrorsToForm } from "@/shared/utils/applyApiFieldErrors";
import { rangeToStartsEndsIso } from "@/lib/bookingIso";
import { BookingPageHeader } from "@/components/appointments/BookingPageHeader";
import { BookingClientForm } from "@/components/appointments/BookingClientForm";

export default function BookingClientScreen() {
  const { date, slotFrom, slotTo } = useLocalSearchParams<{
    date: string;
    slotFrom: string;
    slotTo: string;
  }>();
  const dateKey = typeof date === "string" ? date : "";
  const fromKey = typeof slotFrom === "string" ? slotFrom : "";
  const toKey = typeof slotTo === "string" ? slotTo : "";
  const [rootMessage, setRootMessage] = useState<string | null>(null);
  const createAppt = useCreateAppointmentMutation();

  const methods = useForm<BookingClientFormValues>({
    resolver: zodResolver(bookingClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      zip: "",
      city: "",
      serviceLabel: "",
    },
  });

  const onSubmit = async (values: BookingClientFormValues) => {
    try {
      const { startsAt, endsAt } = rangeToStartsEndsIso(dateKey, fromKey, toKey);
      await createAppt.mutateAsync({
        client: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim().toLowerCase(),
          address: values.address.trim(),
          zip: values.zip.trim(),
          city: values.city?.trim() || undefined,
        },
        serviceLabel: values.serviceLabel?.trim() || "Rendez-vous",
        startsAt,
        endsAt,
      });
      router.dismissTo("/(app)/(tabs)/rendez-vous");
    } catch (e) {
      if (e instanceof ApiError)
        applyApiErrorsToForm(e.body, methods.setError, setRootMessage, [
          "name",
          "phone",
          "email",
        ]);
      else
        setRootMessage(
          e instanceof Error
            ? e.message
            : "Impossible de créer le rendez-vous.",
        );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <BookingPageHeader />
      {rootMessage ? (
        <Text className="mx-screen-x mb-2 font-sans text-[12px] text-destructive">
          {rootMessage}
        </Text>
      ) : null}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FormProvider {...methods}>
          <BookingClientForm
            isPending={createAppt.isPending}
            onSubmit={() => void methods.handleSubmit(onSubmit)()}
            title="Comment vous appeler?"
            subtitle="Just random text, if you read this then you pay attention you dont just blindly use AI."
          />
        </FormProvider>
      </KeyboardAvoidingView>
    </View>
  );
}
