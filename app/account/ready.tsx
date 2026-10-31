import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AccountScreen, SuccessBadge } from '@/components/account';
import { Card, Txt } from '@/components/ui';
import { placeLabel } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

// v3.1 "A9 Account ready".
export default function AccountReady() {
  const { flow = 'create' } = useLocalSearchParams<{ flow?: string }>();
  const { commitAccount, plan, profile, account } = useApp();

  useEffect(() => {
    if (!account) commitAccount();
  }, [account, commitAccount]);

  return (
    <AccountScreen
      back={false}
      hero={
        <View style={{ marginTop: space[8], marginBottom: space[2] }}>
          <SuccessBadge />
        </View>
      }
      title={flow === 'login' ? "You're signed in" : 'Your plan is saved'}
      helper={flow === 'login' ? 'Welcome back. Your passcode now protects Startline on this phone.' : 'Pick up where you left off. Your steps and reminders are now safe in your account.'}
      primary={{ label: 'Return to my plan', onPress: () => router.replace('/') }}
    >
      <Card style={{ gap: 2 }}>
        <Txt variant="cardTitle">
          {plan.steps.length} steps · {placeLabel(profile)}
        </Txt>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          {account?.name ? `Saved for ${account.name}` : 'Saved to your account'}
        </Txt>
      </Card>
    </AccountScreen>
  );
}
