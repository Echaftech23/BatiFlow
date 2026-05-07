import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthWaveHeader } from '../../components/AuthWaveHeader';
import { PASSWORD_STRENGTH_MESSAGE_FR } from '@/shared/utils/passwordRules';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/shared/schemas/forms';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [done, setDone] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = (_values: ResetPasswordFormValues) => {
    setDone(true);
    Alert.alert(
      'Bientôt disponible',
      'La réinitialisation sera validée côté serveur avec le jeton reçu par e-mail.',
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
        <Text className="font-sans-bold text-title text-navy">Nouveau mot de passe</Text>
        <Text className="font-sans mt-2 text-body text-muted-foreground">
          {PASSWORD_STRENGTH_MESSAGE_FR}
        </Text>

        <Text className="font-sans-semibold mt-6 text-caption text-navy">
          Nouveau mot de passe
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              className="font-sans mt-2 rounded-input border border-border bg-surface px-4 py-3 text-body text-navy"
            />
          )}
        />
        {errors.password ? (
          <Text className="font-sans mt-1 text-caption text-destructive">
            {errors.password.message}
          </Text>
        ) : null}

        <Text className="font-sans-semibold mt-4 text-caption text-navy">Confirmer</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              className="font-sans mt-2 rounded-input border border-border bg-surface px-4 py-3 text-body text-navy"
            />
          )}
        />
        {errors.confirmPassword ? (
          <Text className="font-sans mt-1 text-caption text-destructive">
            {errors.confirmPassword.message}
          </Text>
        ) : null}

        <Pressable
          onPress={() => void handleSubmit(onSubmit)()}
          className="mt-6 rounded-button bg-primary py-4"
        >
          <Text className="text-center font-sans-semibold text-body text-on-primary">
            {done ? 'Enregistré (démo)' : 'Enregistrer'}
          </Text>
        </Pressable>
        <Link href="/(auth)/login" asChild>
          <Pressable className="mt-6">
            <Text className="text-center font-sans text-caption text-primary">
              Aller à la connexion
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
