import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from 'react-native';
import { Info } from 'lucide-react-native';

import { AppTextInput, PrimaryButton } from '../ui';
import { RegisterScreenShell } from '../register/RegisterScreenShell';
import { applyApiErrorsToForm } from '@/shared/utils/applyApiFieldErrors';
import { ApiRequestError } from '@/lib/apiClient';
import {
  resendVerification as postResendVerification,
  verifyEmail as postVerifyEmail,
} from '@/services/auth/authService';
import { setAccessToken } from '@/services/storage/secureStore';
import { queryClient } from '@/services/query/queryClient';
import {
  clearRegisterDraft,
} from '../../lib/registerDraft';
import { otpSchema, type OtpFormValues } from '@/shared/schemas/forms';
import { Image } from 'react-native';
import emailImage from '@/assets/icons/mail.png';

const CTA_SHADOW = {
  shadowColor: '#F27427',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 9,
} as const;

export default function RegisterOtpScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const email = typeof emailParam === 'string' ? emailParam : '';
  const [rootMessage, setRootMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (!email) {
      setRootMessage("E-mail manquant. Revenez à l'étape précédente.");
    }
  }, [email]);

  const onResend = async () => {
    setRootMessage(null);
    if (!email) {
      return;
    }
    try {
      await postResendVerification(email);
      Alert.alert('E-mail', "Un nouveau code a été envoyé si l'adresse est éligible.");
    } catch (e) {
      const msg =
        e instanceof ApiRequestError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Échec d'envoi";
      setRootMessage(msg);
    }
  };

  const onSubmit = async (values: OtpFormValues) => {
    setRootMessage(null);
    if (!email) return;
    try {
      const session = await postVerifyEmail(email, values.code);
      await setAccessToken(session.accessToken);
      await clearRegisterDraft();
      await queryClient.invalidateQueries();
      router.push('/(auth)/register/cgu');
    } catch (e) {
      if (e instanceof ApiRequestError) {
        applyApiErrorsToForm(e.body, setError, setRootMessage, ['code']);
      } else {
        setRootMessage(
          e instanceof Error ? e.message : 'Impossible de joindre le serveur.',
        );
      }
    }
  };

  return (
    <RegisterScreenShell
      currentStep={2}
      description="créez votre espace professionnel et commencez à utiliser la plateforme."
    >
      <View className="mt-5 rounded-[24px] border border-[#D1D5DB] bg-white px-5 pb-7 pt-8 mb-10">
        <View className="items-center">
          <View className="h-20 w-20 items-center justify-center rounded-2xl bg-[#FCE9DB]">
            <Image source={emailImage} className="w-8 h-8" resizeMode="contain" />
          </View>
          <Text className="mt-5 text-[#525252] font-quicksand font-bold text-[20px] leading-none text-center">
            Vérifiez votre email
          </Text>
          <Text className="mt-4 text-[#52525B] font-normal text-[14px] leading-none text-center">
            Un code de confirmation a été envoyé à
          </Text>
          <Text className="mt-1 mb-4 text-center font-semibold text-[14px] leading-none">
            {email || '—'}
          </Text>
        </View>

          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                value={value}
                onBlur={onBlur}
                onChangeText={(text) =>
                  onChange(text.replace(/\D/g, '').slice(0, 6))
                }
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Entrer le code ici"
                inputClassName="py-4 text-body rounded-pill bg-[#F3F4F6] font-sans text-[20px] text-[#52525B] leading-[19.83px] tracking-normal text-center"
              />
            )}
          />

          {errors.code ? (
            <Text className="font-sans mt-2 text-center text-caption text-destructive">
              {errors.code.message}
            </Text>
          ) : null}
          {rootMessage ? (
            <Text className="font-sans mt-2 text-center text-caption text-destructive">
              {rootMessage}
            </Text>
          ) : null}

          <PrimaryButton
            title="Confirmer"
            loading={isSubmitting}
            disabled={!email}
            onPress={() => void handleSubmit(onSubmit)()}
            className="mt-16 rounded-pill bg-primary py-4 disabled:opacity-60"
            textClassName="text-center font-semibold text-body leading-[32px] text-white"
            style={CTA_SHADOW}
          />

          <View className="mt-4 flex-row items-center justify-center">
            <Text className="font-sans text-badge font-normal text-[#52525B]">
              vous n’avez pas reçu l’email ?{' '}
            </Text>
            <Pressable disabled={!email} onPress={() => void onResend()}>
              <Text className="font-semibold text-badge">
                Renvoyer
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 border-t border-[#E5E7EB] pt-5">
            <View className="flex-row items-start pr-12">
              <Info size={20} color="#737373" />
              <Text className="font-normal text-badge text-center leading-normal text-[#737373] tracking-normal flex items-center justify-center">
                Pensez à vérifier votre dossier de courriers indésirables (spams).
              </Text>
            </View>
          </View>
      </View>
    </RegisterScreenShell>
  );
}
