import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthWaveHeader } from '../../components/AuthWaveHeader';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/shared/schemas/forms';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (_values: ForgotPasswordFormValues) => {
    setSubmitted(true);
    Alert.alert(
      'Bientôt disponible',
      'La réinitialisation par e-mail sera branchée sur l’API (endpoints forgot / reset).',
      [{ text: 'OK' }],
    );
  };

  return (
    <View className="flex-1 bg-background">
      <AuthWaveHeader height={100} />
      <View
        className="flex-1 px-screen-x pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable onPress={() => router.back()} className="mb-4 self-start">
          <Text className="font-sans-semibold text-body text-primary">← Retour</Text>
        </Pressable>
        <Text className="font-sans-bold text-title text-navy">Mot de passe oublié</Text>
        <Text className="font-sans mt-2 text-body text-muted-foreground">
          Saisissez votre e-mail pour recevoir un lien de réinitialisation lorsque l’API sera
          configurée.
        </Text>

        <Text className="font-sans-semibold mt-6 text-caption text-navy">E-mail</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="vous@exemple.fr"
              placeholderTextColor="#9CA3AF"
              className="font-sans mt-2 rounded-input border border-border bg-surface px-4 py-3 text-body text-navy"
            />
          )}
        />
        {errors.email ? (
          <Text className="font-sans mt-1 text-caption text-destructive">
            {errors.email.message}
          </Text>
        ) : null}

        <Pressable
          onPress={() => void handleSubmit(onSubmit)()}
          className="mt-6 rounded-button bg-primary py-4"
        >
          <Text className="text-center font-sans-semibold text-body text-on-primary">
            {submitted ? 'Demande enregistrée (démo)' : 'Envoyer le lien'}
          </Text>
        </Pressable>
        <Link href="/(auth)/login" asChild>
          <Pressable className="mt-6">
            <Text className="text-center font-sans text-caption text-primary">
              Retour à la connexion
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
