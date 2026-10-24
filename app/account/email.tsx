import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { AccountScreen, maskContact, NoteCard } from '@/components/account';
import { useApp } from '@/state/AppState';

// v3.1 "A2 Email verification" and "A3 Email resent".
export default function EmailCheck() {
  const { flow = 'create' } = useLocalSearchParams<{ flow?: string }>();
  const { draft, account } = useApp();
  const [resent, setResent] = useState(false);
  const contact = draft.contact ?? account?.contact;

  return (
    <AccountScreen
      icon="send"
      title="Check your email"
      helper={`We sent a link to ${maskContact(contact)}. Tap it to confirm your account, then come back here.`}
      primary={{ label: 'Continue', onPress: () => router.push(`/account/passcode?flow=${flow}&stage=create`) }}
      secondary={resent ? { label: 'Use a different email', onPress: () => router.back() } : { label: 'Resend email', onPress: () => setResent(true) }}
    >
      {resent ? (
        <NoteCard icon="check" tone="success">
          New link sent. Check your inbox. You can request another link in 0:58.
        </NoteCard>
      ) : (
        <NoteCard icon="clock">Can't find it? Check your spam folder. Links expire after 24 hours.</NoteCard>
      )}
      <NoteCard icon="alert-circle" tone="warning">
        Prototype: no email is sent. Tap Continue.
      </NoteCard>
    </AccountScreen>
  );
}
