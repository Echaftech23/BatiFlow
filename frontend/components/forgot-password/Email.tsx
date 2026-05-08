import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ForgotPasswordAuthShell } from "./AuthShell";
import { AppTextInput, FormField, PrimaryButton } from "../ui";
import { ApiError } from "@/api/types";
import { requestPasswordReset } from "@/services/auth/authService";
import { applyApiErrorsToForm } from "@/shared/utils/applyApiFieldErrors";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/shared/schemas/forms";

const INPUT_STANDOFF = {
  shadowColor: "#1A2B48",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
} as const;

const CTA_SHADOW = {
  shadowColor: "#F27427",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 12,
  elevation: 10,
} as const;

type Props = {
  onLinkSent: () => void;
  onBack: () => void;
};

export function ForgotPasswordEnterEmail({ onLinkSent, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 24);
  const [rootMessage, setRootMessage] = useState<string | null>(null);

  const resetMutation = useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema, undefined, { mode: "sync" }),
    defaultValues: { email: "" },
  });

  const submit = handleSubmit(async (values) => {
    setRootMessage(null);
    try {
      await resetMutation.mutateAsync(values.email.trim());
      onLinkSent();
    } catch (e) {
      if (e instanceof ApiError) {
        applyApiErrorsToForm(e.body, setError, setRootMessage, ["email"]);
      } else {
        setRootMessage(
          e instanceof Error ? e.message : "Impossible de joindre le serveur.",
        );
      }
    }
  });

  return (
    <ForgotPasswordAuthShell
      headerTypography="paragraph"
      headerLines={[
        "Entrez votre email professionnel.",
        "Vous recevrez un lien valable 1 heure.",
      ]}
      onBack={onBack}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          className="flex-1 justify-between px-screen-x"
          style={{ paddingBottom: bottomPad }}
        >
          <View>
            {rootMessage ? (
              <Text className="mb-2 text-caption text-destructive">
                {rootMessage}
              </Text>
            ) : null}
            <FormField
              label="Adresse e-mail"
              stacked={false}
              labelRequired={false}
              error={errors.email?.message}
            >
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className="mt-2 rounded-input font- bg-surface"
                    style={INPUT_STANDOFF}
                  >
                    <AppTextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      placeholder="Entrez votre e-mail"
                      inputClassName="border-0 bg-transparent py-5 px-5 text-badge text-navy font-normal tracking-normal shadow-none rounded-input"
                    />
                  </View>
                )}
              />
            </FormField>
          </View>
          <View>
            <PrimaryButton
              title="Envoyer le lien de réinitialisation"
              onPress={() => void submit()}
              loading={isSubmitting || resetMutation.isPending}
              style={CTA_SHADOW}
              className="mb-4 rounded-pill bg-primary py-[17.5px]"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ForgotPasswordAuthShell>
  );
}
