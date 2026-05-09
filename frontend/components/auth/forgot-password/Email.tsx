import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ForgotPasswordCodeModal } from "./ForgotPasswordCodeModal";
import { ForgotPasswordAuthShell } from "./AuthShell";
import { AppTextInput, FormField, PrimaryButton } from "../../ui";
import { ApiError } from "@/api/types";
import { requestPasswordReset } from "@/services/auth/authService";
import { applyApiErrorsToForm } from "@/shared/utils/applyApiFieldErrors";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/shared/schemas/forms";

type Props = {
  onBack: () => void;
};

export function ForgotPasswordEnterEmail({ onBack }: Props) {
  const bottomPad = Math.max(useSafeAreaInsets().bottom, 24);
  const [rootMessage, setRootMessage] = useState<string | null>(null);
  const [modalEmail, setModalEmail] = useState("");
  const [codeModalVisible, setCodeModalVisible] = useState(false);

  const sendCodeMutation = useMutation({
    mutationFn: (addr: string) => requestPasswordReset(addr),
  });

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema, undefined, { mode: "sync" }),
    defaultValues: { email: "" },
  });

  const submitEmail = form.handleSubmit(async ({ email }) => {
    setRootMessage(null);
    const trimmed = email.trim();
    try {
      await sendCodeMutation.mutateAsync(trimmed);
      setModalEmail(trimmed.toLowerCase());
      setCodeModalVisible(true);
    } catch (e) {
      if (e instanceof ApiError) {
        applyApiErrorsToForm(e.body, form.setError, setRootMessage, ["email"]);
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
        "Vous recevrez un code à 4 chiffres.",
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
              <Text className="mb-2 text-caption text-destructive">{rootMessage}</Text>
            ) : null}
            <FormField
              label="Adresse e-mail"
              stacked={false}
              labelRequired={false}
              error={form.formState.errors.email?.message}
            >
              <Controller
                control={form.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    placeholder="Entrez votre e-mail"
                    className="mt-2 rounded-input bg-surface px-5 py-5 font-sans text-badge text-navy shadow-card"
                  />
                )}
              />
            </FormField>
          </View>
          <PrimaryButton
            title="Envoyer le code"
            loading={sendCodeMutation.isPending || form.formState.isSubmitting}
            className="mb-4 rounded-pill bg-primary py-[17.5px] shadow-fab"
            onPress={() => void submitEmail()}
          />
        </View>
      </KeyboardAvoidingView>

      <ForgotPasswordCodeModal
        visible={codeModalVisible}
        email={modalEmail}
        onDismiss={() => setCodeModalVisible(false)}
      />
    </ForgotPasswordAuthShell>
  );
}
