import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountScreen, CodeInput, maskContact, NoteCard, TextLink } from '@/components/account';
import { DemoNotice, Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

// v3.1 "OB10 Verify". Prototype: no text is sent, any 6 digits work.
export default function Verify() {
  const { flow = 'create' } = useLocalSearchParams<{ flow?: string }>();
  const { draft, account } = useApp();
  const [code, setCode] = useState('');
  const contact = draft.contact ?? account?.contact;

  return (
    <AccountScreen
      icon="smartphone"
      title="Enter the 6-digit code"
      helper={`We sent it by text to ${maskContact(contact)}.`}
      primary={{ label: 'Continue', disabled: code.length < 6, hint: 'Enter all 6 digits.', onPress: () => router.push(`/account/passcode?flow=${flow}&stage=create`) }}
    >
      <CodeInput value={code} onChange={setCode} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Resend code in 0:58
        </Txt>
        <TextLink label="Wrong number?" onPress={() => router.back()} />
      </View>
      <NoteCard icon="clock">Not getting a text? Messages can take a few minutes to arrive.</NoteCard>
      <DemoNotice text="Prototype: no text is sent. Enter any 6 digits." />
    </AccountScreen>
  );
}
