import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image } from "react-native";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from "@firebase/auth";

import { setAccessToken } from "@/services/storage/secureStore";
import { exchangeFirebaseIdTokenForJwt } from "@/lib/batiflowAuth";
import { queryClient } from "@/services/query/queryClient";
import { getFirebaseAuth } from "@/services/firebase/firebaseAuth";
import { randomNonce } from "../../lib/randomNonce";

WebBrowser.maybeCompleteAuthSession();

function isAppleSignInCanceled(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code?: string }).code === "ERR_REQUEST_CANCELED"
  );
}

type SocialAuthPanelProps = {
  onAuthenticated?: () => void;
  /** Compact “Se connecter avec” row used on the login mock. */
  mode?: "default" | "login";
};

export function SocialAuthPanel({
  onAuthenticated,
  mode = "default",
}: SocialAuthPanelProps) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const isExpoGo = Constants.executionEnvironment === "storeClient";

  const googleConfig = useMemo(
    () => ({
      webClientId: webClientId || undefined,
      iosClientId: iosClientId || undefined,
      androidClientId: androidClientId || undefined,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "batiflow",
        path: "oauthredirect",
      }),
    }),
    [androidClientId, iosClientId, webClientId],
  );

  const [request, response, promptAsync] =
    Google.useIdTokenAuthRequest(googleConfig);

  const exchangeSession = useCallback(async () => {
    const idToken = await getFirebaseAuth().currentUser?.getIdToken();
    if (!idToken) {
      throw new Error("No Firebase session after sign-in");
    }
    const session = await exchangeFirebaseIdTokenForJwt(idToken);
    await setAccessToken(session.accessToken);
    await queryClient.invalidateQueries();
    if (mode === "login") {
      setStatus(null);
    } else {
      setStatus(`API JWT OK — ${session.user.email}`);
    }
    onAuthenticated?.();
  }, [mode, onAuthenticated]);

  useEffect(() => {
    if (response?.type !== "success") {
      return;
    }
    const idToken =
      typeof response.params.id_token === "string"
        ? response.params.id_token
        : undefined;
    if (!idToken) {
      setStatus("Google did not return id_token");
      return;
    }

    void (async () => {
      try {
        setBusy(true);
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(getFirebaseAuth(), credential);
        await exchangeSession();
      } catch (e) {
        setStatus(e instanceof Error ? e.message : "Google sign-in failed");
      } finally {
        setBusy(false);
      }
    })();
  }, [exchangeSession, response]);

  const googleConfigured =
    Platform.OS === "web"
      ? Boolean(webClientId)
      : Platform.OS === "ios"
        ? Boolean(iosClientId && webClientId)
        : Boolean(androidClientId && webClientId);

  const onGoogle = () => {
    if (isExpoGo) {
      Alert.alert(
        "Dev build requis",
        "Google Sign-In ne fonctionne pas dans Expo Go (le proxy auth.expo.io est obsolète).\n\n" +
          "Lancez un dev build :\n  npx expo run:ios\n  npx expo run:android",
      );
      return;
    }
    try {
      getFirebaseAuth();
    } catch (e) {
      Alert.alert(
        "Firebase",
        e instanceof Error ? e.message : "Check EXPO_PUBLIC_FIREBASE_* in .env",
      );
      return;
    }
    if (!googleConfigured) {
      Alert.alert(
        "Configuration",
        "Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID and the native client ID for this platform (see .env.example).",
      );
      return;
    }
    if (!request) {
      Alert.alert("Google", "Auth request is not ready yet.");
      return;
    }
    void promptAsync();
  };

  const onApple = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert(
        "Apple",
        "Sign in with Apple runs on iOS (dev build or device).",
      );
      return;
    }
    try {
      getFirebaseAuth();
    } catch (e) {
      Alert.alert(
        "Firebase",
        e instanceof Error ? e.message : "Check EXPO_PUBLIC_FIREBASE_* in .env",
      );
      return;
    }
    try {
      setBusy(true);
      const rawNonce = await randomNonce();
      const nonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce,
      );
      const apple = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      });
      if (!apple.identityToken) {
        throw new Error("Apple did not return identityToken");
      }
      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: apple.identityToken,
        rawNonce,
      });
      await signInWithCredential(getFirebaseAuth(), credential);
      await exchangeSession();
    } catch (e) {
      if (!isAppleSignInCanceled(e)) {
        setStatus(e instanceof Error ? e.message : "Apple sign-in failed");
      }
    } finally {
      setBusy(false);
    }
  };

  if (mode === "login") {
    return (
      <View className="mt-10 w-full">
        <View className="flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text className="font-sans text-caption text-muted-foreground">
            Se connecter avec
          </Text>
          <View className="h-px flex-1 bg-border" />
        </View>
        <View className="mt-6 flex-row gap-3">
          <Pressable
            disabled={busy || !googleConfigured}
            onPress={onGoogle}
            className="flex-1 items-center justify-center rounded-pill border border-border bg-surface py-3.5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Image
              source={require("@/assets/icons/google.png")}
              style={{ width: 22, height: 22 }}
            />
          </Pressable>
          <Pressable
            disabled={busy}
            onPress={() => {
              void onApple();
            }}
            className="flex-1 items-center justify-center rounded-pill border border-border bg-surface py-3.5 disabled:opacity-50"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <FontAwesome5 name="apple" size={22} color="#000000" brand />
          </Pressable>
        </View>
        {busy ? (
          <View className="items-center py-3">
            <ActivityIndicator />
          </View>
        ) : null}
        {status ? (
          <Text className="font-sans mt-2 text-center text-caption text-destructive">
            {status}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View className="mt-6 w-full max-w-sm gap-3">
      <Text className="font-sans-semibold text-subtitle text-navy">
        Social sign-in (Firebase)
      </Text>
      <Text className="font-sans text-caption text-muted-foreground">
        Uses Firebase Auth on the client, then exchanges the Firebase ID token
        for a BatiFlow JWT via POST /auth/firebase.
      </Text>

      <Pressable
        disabled={busy || !googleConfigured}
        onPress={onGoogle}
        className="rounded-button bg-primary px-4 py-3 disabled:opacity-50"
      >
        <Text className="text-center font-sans-semibold text-body text-on-primary">
          Continue with Google
        </Text>
      </Pressable>

      {Platform.OS === "ios" ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={12}
          style={{ width: "100%", height: 48 }}
          onPress={() => {
            if (busy) return;
            void onApple();
          }}
        />
      ) : null}

      {busy ? (
        <View className="items-center py-2">
          <ActivityIndicator />
        </View>
      ) : null}

      {status ? (
        <Text className="font-sans text-caption text-navy">{status}</Text>
      ) : null}
    </View>
  );
}
