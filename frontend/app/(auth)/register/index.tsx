import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

import { RegisterScreenShell } from "@/components/auth/register/RegisterScreenShell";
import {
  AppTextInput,
  FieldError,
  FieldLabel,
  FormField,
  PasswordInput,
  PasswordStrengthBar,
  PrimaryButton,
} from "@/components/ui";
import { applyApiErrorsToForm } from "@/shared/utils/applyApiFieldErrors";
import { ApiRequestError } from "@/lib/apiClient";
import { register as postRegister } from "@/services/auth/authService";
import { saveRegisterDraft } from "@/lib/registerDraft";
import {
  registerIdentitySchema,
  type RegisterIdentityFormValues,
} from "@/shared/schemas/forms";

const CTA_SHADOW = {
  shadowColor: "#F27427",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 12,
  elevation: 10,
} as const;

export default function RegisterIdentityScreen() {
  const [rootMessage, setRootMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterIdentityFormValues>({
    resolver: zodResolver(registerIdentitySchema),
    defaultValues: {
      name: "",
      profession: "",
      phone: "",
      zone: "",
      address: "",
      zip: "",
      city: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (values: RegisterIdentityFormValues) => {
    setRootMessage(null);
    const email = values.email.trim().toLowerCase();
    try {
      await postRegister({
        email,
        password: values.password,
        profile: {
          name: values.name.trim(),
          profession: values.profession.trim(),
          phone: values.phone.trim(),
          zone: values.zone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          zip: values.zip.trim(),
        },
      });
      await saveRegisterDraft({ email });
      router.push({
        pathname: "/(auth)/register/otp",
        params: { email },
      });
    } catch (e) {
      if (e instanceof ApiRequestError) {
        applyApiErrorsToForm(e.body, setError, setRootMessage, [
          "email",
          "password",
          "name",
          "profession",
          "phone",
          "zone",
          "address",
          "zip",
          "city",
        ]);
      } else {
        setRootMessage(
          e instanceof Error ? e.message : "Impossible de joindre le serveur.",
        );
      }
    }
  };

  return (
    <RegisterScreenShell
      currentStep={1}
      description="Créez votre espace professionnel et commencez à utiliser la plateforme."
    >
      {rootMessage ? (
        <Text className="font-sans mb-3 text-caption text-destructive">
          {rootMessage}
        </Text>
      ) : null}

      <FormField
        label="Nom complet"
        stacked={false}
        error={errors.name?.message}
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Thomas Ribeiro"
            />
          )}
        />
      </FormField>

      <FormField label="Métier / spécialité" error={errors.profession?.message}>
        <Controller
          control={control}
          name="profession"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Électricien"
            />
          )}
        />
      </FormField>

      <FormField label="Numéro de téléphone" error={errors.phone?.message}>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="phone-pad"
              placeholder="06 23 45 67 89"
            />
          )}
        />
      </FormField>

      <FormField label="Zone d’intervention" error={errors.zone?.message}>
        <Controller
          control={control}
          name="zone"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Bordeaux et Gironde"
            />
          )}
        />
      </FormField>

      <FormField label="Adresse postale" error={errors.address?.message}>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="12 rue de la République"
            />
          )}
        />
      </FormField>

      <View className="mt-4 flex-row gap-5">
        <View className="min-w-0 flex-[2.5]">
          <FieldLabel>Code postal</FieldLabel>
          <Controller
            control={control}
            name="zip"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                value={value}
                onChangeText={(t) => onChange(t.replace(/\D/g, "").slice(0, 5))}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={5}
                placeholder="75008"
              />
            )}
          />
          <FieldError message={errors.zip?.message} />
        </View>
        <View className="min-w-0 flex-[3]">
          <FieldLabel>Ville</FieldLabel>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                placeholder="Paris"
              />
            )}
          />
          <FieldError message={errors.city?.message} />
        </View>
      </View>

      <FormField label="Adresse e-mail" error={errors.email?.message}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="thomas.ribeiro.elec@gmail.com"
            />
          )}
        />
      </FormField>

      <FormField
        label="Mot de passe"
        error={errors.password?.message}
        errorClassName="font-sans mt-2 text-caption text-destructive"
        footer={<PasswordStrengthBar password={passwordValue} />}
      >
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
            />
          )}
        />
      </FormField>

      <PrimaryButton
        title="Créer mon compte"
        loading={isSubmitting}
        onPress={() => void handleSubmit(onSubmit)()}
        style={CTA_SHADOW}
      />

      <Link href="/(auth)/login" asChild>
        <Pressable className="mt-6 pb-2">
          <Text className="text-center font-sans text-badge text-muted-foreground">
            j&apos;ai déjà un compte -{" "}
            <Text className="font-sans-medium text-badge text-navy">
              Me connecter
            </Text>
          </Text>
        </Pressable>
      </Link>
    </RegisterScreenShell>
  );
}
