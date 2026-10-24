import { router } from 'expo-router';

import { AccountScreen, maskContact, NoteCard } from '@/components/account';
import { Card, Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

// v3.1 "A13 Reset passcode".
export default function ResetPasscode() {
  const { account } = useApp();
  const isPhone = account?.contact.kind !== 'email';
  return (
    <AccountScreen
      icon="lock"
      title="Reset your passcode"
      helper={`We'll ${isPhone ? 'text a code' : 'email a link'} to the ${isPhone ? 'number' : 'email'} on your account. Then you can choose a new passcode.`}
      primary={{ label: isPhone ? 'Send code' : 'Send link', onPress: () => router.push(isPhone ? '/account/verify?flow=reset' : '/account/email?flow=reset') }}
    >
      <Card style={{ gap: 2 }}>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          {isPhone ? 'Mobile number' : 'Email'}
        </Txt>
        <Txt variant="cardTitle">{maskContact(account?.contact)}</Txt>
      </Card>
      <NoteCard icon="info">Your plan, steps and contacts stay saved while you reset.</NoteCard>
    </AccountScreen>
  );
}
