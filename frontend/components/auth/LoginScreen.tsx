import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoginBrandLogo } from '../LoginBrandLogo';
import { SocialAuthPanel } from '../SocialAuthPanel';
import { AppTextInput, FormField, PasswordInput, PrimaryButton } from '../ui';
import { ApiError } from '@/api/types';
import { useLoginMutation } from '@/hooks/auth/useLoginMutation';
import { applyApiErrorsToForm } from '@/shared/utils/applyApiFieldErrors';
import { loginSchema, type LoginFormValues } from '@/shared/schemas/forms';

const CTA_SHADOW = {
  shadowColor: '#F27427',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 12,
  elevation: 10,
} as const;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [rootMessage, setRootMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema, undefined, { mode: 'sync' }),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setRootMessage(null);
    try {
      await loginMutation.mutateAsync({
        email: values.email.trim(),
        password: values.password,
      });
      router.replace('/(app)/(tabs)');
    } catch (e) {
      if (e instanceof ApiError) {
        applyApiErrorsToForm(e.body, setError, setRootMessage, ['email', 'password']);
      } else {
        setRootMessage(e instanceof Error ? e.message : 'Impossible de joindre le serveur.');
      }
    }
  };

  return (
    <View className="relative h-full bg-white">
      <View
        className="absolute inset-0 left-[-170px] top-[-220px] h-[480px] w-[640px] overflow-hidden rounded-full bg-auth-navy"
        pointerEvents="none"
      />
      <View className="flex-1 flex-col justify-between gap-36">
        <StatusBar style="light" />
        <View className="relative flex overflow-hidden px-7 pb-5" style={{ paddingTop: insets.top + 30 }}>
          <View>
            <LoginBrandLogo width={40} height={35} />
            <Text className="mt-5 text-[16px] leading-6 text-white">
              Gerez vos chantiers et vos devis en toute simplicite.
            </Text>
          </View>
        </View>
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView className="flex-1" contentContainerClassName="px-screen-x pb-10 pt-1" keyboardShouldPersistTaps="handled" style={{ marginTop: -18 }}>
            {rootMessage ? <Text className="mb-2 text-caption text-destructive">{rootMessage}</Text> : null}
            <FormField label="Adresse e-mail" stacked={false} error={errors.email?.message}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextInput value={value} onChangeText={onChange} onBlur={onBlur} autoCapitalize="none" keyboardType="email-address" autoComplete="email" placeholder="Entrez votre e-mail" />
                )}
              />
            </FormField>
            <FormField label="Mot de passe" error={errors.password?.message}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput value={value} onChangeText={onChange} onBlur={onBlur} showPassword={showPassword} onTogglePassword={() => setShowPassword((v) => !v)} />
                )}
              />
            </FormField>
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable className="mt-3 self-end">
                <Text className="text-badge font-medium text-[#525252]">Mot de passe oublie ?</Text>
              </Pressable>
            </Link>
            <PrimaryButton
              title="Se connecter"
              loading={isSubmitting || loginMutation.isPending}
              onPress={() => void handleSubmit(onSubmit)()}
              style={CTA_SHADOW}
              className="mt-12 rounded-pill bg-primary py-4 disabled:opacity-60"
            />
            <SocialAuthPanel
              mode="login"
              onAuthenticated={() => router.replace('/(app)/(tabs)')}
            />
            <Link href="/(auth)/register" asChild>
              <Pressable className="mt-8">
                <Text className="text-center text-badge text-muted-foreground">
                  Pas encore de compte ?{' '}
                  <Text className="text-badge font-medium text-navy">Creer un compte</Text>
                </Text>
              </Pressable>
            </Link>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
