import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';

import { PillTabBar } from '@/components/layout';
import { useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

export default function TabsLayout() {
  const { introSeen, splashSeen, account, unlocked } = useApp();
  if (!splashSeen) return <Redirect href="/splash" />;
  if (!introSeen) return <Redirect href="/intro" />;
  if (account && !unlocked) return <Redirect href="/account/unlock" />;
  return (
    <Tabs
      tabBar={(props) => <PillTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: color.surfaceWarm } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="path" options={{ title: 'My Path' }} />
      <Tabs.Screen name="ask" options={{ title: 'Ask' }} />
      <Tabs.Screen name="resources" options={{ title: 'Resources' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
