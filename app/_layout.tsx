import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Splash } from '@/components/Splash';
import { AppStateProvider, useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

const SPLASH_MS = 1200;

function Navigator() {
  const { ready } = useApp();
  const [splashDone, setSplashDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);
  if (!ready || !splashDone) return <Splash />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.surfaceWarm } }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="referral" options={{ presentation: 'modal' }} />
      <Stack.Screen name="account/unlock" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="account/ready" options={{ gestureEnabled: false }} />
      <Stack.Screen name="account/document-saved" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  if (!loaded) return <View style={{ flex: 1, backgroundColor: color.surfaceWarm }} />;
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <Navigator />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
