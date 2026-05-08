import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Check } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ForgotPasswordAuthShell } from "./AuthShell";
import { FormField, PasswordInput, PrimaryButton } from "../ui";
import { ApiError } from "@/api/types";
import { resetPasswordWithToken } from "@/services/auth/authService";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/shared/schemas/forms";

type Rule = { id: string; label: string; test: (p: string) => boolean };

const RULES: Rule[] = [
  {
    id: "len",
    label: "8 caractères minimum",
    test: (p) => p.length >= 8,
  },
  {
    id: "upper",
    label: "1 majuscule",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lower",
    label: "1 minuscule",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "digit",
    label: "1 chiffre",
    test: (p) => /\d/.test(p),
  },
  {
    id: "special",
    label: "1 caractère spécial",
    test: (p) => /[^A-Za-z0-9\s]/.test(p),
  },
];

type Props = {
  resetToken: string;
  onBack: () => void;
  onConfirmSuccess: () => void;
};

export function ForgotPasswordReset({
  resetToken,
  onBack,
  onConfirmSuccess,
}: Props) {
  const insets = useSafeAreaInsets();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rootMessage, setRootMessage] = useState<string | null>(null);

  const resetMutation = useMutation({
    mutationFn: ({ password }: { password: string }) =>
      resetPasswordWithToken(resetToken, password),
    onSuccess: () => onConfirmSuccess(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema, undefined, { mode: "sync" }),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue =
    useWatch({ control, name: "password", defaultValue: "" }) ?? "";

  const ruleStates = useMemo(() => {
    return RULES.map((r) => ({ ...r, ok: r.test(passwordValue) }));
  }, [passwordValue]);

  const submit = handleSubmit(async (values) => {
    setRootMessage(null);
    try {
      await resetMutation.mutateAsync({ password: values.password });
    } catch (e) {
      if (e instanceof ApiError) {
        const msg =
          typeof e.body === "object" &&
          e.body !== null &&
          "message" in e.body &&
          typeof (e.body as { message?: unknown }).message === "string"
            ? (e.body as { message: string }).message
            : e.message;
        setRootMessage(msg);
      } else {
        setRootMessage(
          e instanceof Error ? e.message : "Impossible de joindre le serveur.",
        );
      }
    }
  });

  return (
    <ForgotPasswordAuthShell
      headerLines={[
        "choisissez un nouveau mot de passe",
        "pour sécuriser votre compte.",
      ]}
      onBack={onBack}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 24,
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <View>
            {rootMessage ? (
              <Text className="mb-3 text-caption text-destructive">
                {rootMessage}
              </Text>
            ) : null}
            <FormField
              label="Nouveau mot de passe"
              labelRequired={false}
              stacked={false}
              error={errors.password?.message}
            >
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    showPassword={showPw}
                    onTogglePassword={() => setShowPw((v) => !v)}
                    placeholder="Entrez votre mot de passe"
                  />
                )}
              />
            </FormField>
            <FormField
              label="Confirmer le mot de passe"
              labelRequired={false}
              error={errors.confirmPassword?.message}
            >
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    showPassword={showConfirm}
                    onTogglePassword={() => setShowConfirm((v) => !v)}
                    placeholder="Confirmer votre mot de passe"
                  />
                )}
              />
            </FormField>

            <View className="my-8 rounded-[18.2px] border border-border p-4">
              {ruleStates.map((r) => (
                <View key={r.id} className="flex-row items-center gap-2 py-1">
                  <View
                    className={`rounded-full border border-1 p-0.5 ${r.ok ? "border-[#22C55E]" : "border-[#525252]"}`}
                  >
                    <Check
                      size={12}
                      color={r.ok ? "#22C55E" : "#525252"}
                      strokeWidth={2.5}
                    />
                  </View>
                  <Text
                    className={`flex-1 font-normal text-badge ${r.ok ? "text-navy" : "text-muted-foreground"}`}
                  >
                    {r.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View>
            <PrimaryButton
              title="Confirmer"
              onPress={() => void submit()}
              loading={isSubmitting || resetMutation.isPending}
              className="rounded-pill bg-primary py-[17.5px]"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ForgotPasswordAuthShell>
  );
}
