import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider, useApp } from '@/state/AppState';
import { color, palette } from '@/theme/tokens';

const FONT_WAIT_MS = 2500;

function Navigator() {
  const { ready } = useApp();
  if (!ready) return <View style={{ flex: 1, backgroundColor: palette.deep }} />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.surfaceWarm } }}>
      <Stack.Screen name="splash" options={{ animation: 'fade' }} />
      <Stack.Screen name="intro" options={{ animation: 'fade' }} />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="referral" options={{ presentation: 'modal' }} />
      <Stack.Screen name="account/unlock" options={{ gestureEnabled: false, animation: 'fade' }} />
      <Stack.Screen name="account/ready" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  // Never block on the brand font: on a slow connection (or if a font fails,
  // as Safari's load check can), open with the system font after a short wait.
  const [waited, setWaited] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), FONT_WAIT_MS);
    return () => clearTimeout(t);
  }, []);
  if (!loaded && !fontError && !waited) return <View style={{ flex: 1, backgroundColor: color.surfaceWarm }} />;
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <Navigator />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
