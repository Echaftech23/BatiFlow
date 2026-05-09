import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTextInput, PrimaryButton } from "../../ui";
import { ApiError } from "@/api/types";
import { setPendingPasswordReset } from "@/lib/forgotPasswordSession";
import {
  requestPasswordReset,
  verifyPasswordResetCode,
} from "@/services/auth/authService";
import {
  forgotPasswordCodeModalSchema,
  type ForgotPasswordCodeModalValues,
} from "@/shared/schemas/forms";

function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const b = error.body;
    if (typeof b === "object" && b !== null && "message" in b) {
      const m = (b as { message?: unknown }).message;
      if (typeof m === "string" && m.length > 0) return m;
    }
    return error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

type Props = {
  visible: boolean;
  email: string;
  onDismiss: () => void;
};

export function ForgotPasswordCodeModal({ visible, email, onDismiss }: Props) {
  const insetBottom = Math.max(useSafeAreaInsets().bottom, 16);
  const [rootMessage, setRootMessage] = useState<string | null>(null);

  const clearServerError = () => setRootMessage(null);

  const resendMutation = useMutation({
    mutationFn: () => requestPasswordReset(email),
    onMutate: clearServerError,
    onError: (e) =>
      setRootMessage(apiErrorMessage(e, "Échec d'envoi. Réessayez plus tard.")),
  });

  const verifyMutation = useMutation({
    mutationFn: (code: string) => verifyPasswordResetCode(email, code.trim()),
    onMutate: clearServerError,
    onSuccess: (_, code) => {
      setPendingPasswordReset(email, code.trim());
      onDismiss();
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email },
      });
    },
    onError: (e) =>
      setRootMessage(apiErrorMessage(e, "Code incorrect ou expiré.")),
  });

  const { control, handleSubmit, reset, formState } =
    useForm<ForgotPasswordCodeModalValues>({
      resolver: zodResolver(forgotPasswordCodeModalSchema, undefined, {
        mode: "sync",
      }),
      defaultValues: { code: "" },
    });

  useEffect(() => {
    if (visible) {
      reset({ code: "" });
      setRootMessage(null);
      verifyMutation.reset();
      resendMutation.reset();
    }
  }, [visible, reset]);

  const busy =
    verifyMutation.isPending ||
    resendMutation.isPending ||
    formState.isSubmitting;

  const close = () => {
    reset({ code: "" });
    setRootMessage(null);
    verifyMutation.reset();
    resendMutation.reset();
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={close}
    >
      <View className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="relative flex-1 justify-center px-screen-x"
        >
          <Pressable
            accessibilityLabel="Fermer"
            accessibilityRole="button"
            className="absolute inset-0 bg-navy/50"
            onPress={close}
          />
          <Pressable
            className="z-10 mx-auto w-full max-w-[340px] rounded-card bg-surface px-5 pt-5 shadow-card"
            style={{ paddingBottom: insetBottom }}
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="font-quicksand text-subtitle font-bold leading-tight text-navy">
              Entrez votre code
            </Text>
            <Text className="mt-1.5 font-sans text-badge leading-5 text-muted-foreground">
              Code à 4 chiffres envoyé à{" "}
              <Text className="font-sans-semibold text-navy">{email}</Text>
            </Text>

            {rootMessage ? (
              <Text className="mt-3 font-sans text-badge text-destructive">
                {rootMessage}
              </Text>
            ) : null}

            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppTextInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(t) =>
                    onChange(t.replace(/\D/g, "").slice(0, 4))
                  }
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="••••"
                  accessibilityLabel="Code à quatre chiffres"
                  className="mt-4 rounded-input border border-border bg-muted px-4 py-3.5 text-center font-sans text-[20px] font-semibold tracking-[8px] text-navy shadow-none"
                />
              )}
            />
            {formState.errors.code ? (
              <Text className="mt-2 font-sans text-caption text-destructive">
                {formState.errors.code.message}
              </Text>
            ) : null}

            <PrimaryButton
              title="Continuer"
              onPress={() =>
                void handleSubmit(({ code }) =>
                  verifyMutation.mutate(code),
                )()
              }
              loading={busy}
              className="mt-6 rounded-pill bg-primary py-3.5 shadow-fab"
              textClassName="text-center font-sans-semibold text-body text-on-primary"
            />

            <Pressable
              className="mt-4 pb-1 disabled:opacity-50"
              onPress={() => void resendMutation.mutate()}
              disabled={busy}
              accessibilityRole="button"
            >
              <Text className="text-center font-sans-semibold text-caption text-primary">
                Renvoyer le code
              </Text>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
