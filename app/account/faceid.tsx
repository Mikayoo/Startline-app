import * as LocalAuthentication from 'expo-local-authentication';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { AccountScreen, NoteCard } from '@/components/account';
import { useApp } from '@/state/AppState';

// v3.1 "A6 Face ID". Uses the phone's own face or fingerprint unlock.
export default function FaceId() {
  const { flow = 'create' } = useLocalSearchParams<{ flow?: string }>();
  const { setDraft } = useApp();
  const [available, setAvailable] = useState<boolean | null>(null);
  const label = Platform.OS === 'ios' ? 'Face ID' : 'fingerprint or face unlock';
  const next = () => router.push(flow === 'create' ? '/account/name' : `/account/ready?flow=${flow}`);

  useEffect(() => {
    Promise.all([LocalAuthentication.hasHardwareAsync(), LocalAuthentication.isEnrolledAsync()])
      .then(([hw, enrolled]) => setAvailable(hw && enrolled))
      .catch(() => setAvailable(false));
  }, []);

  return (
    <AccountScreen
      icon="smile"
      title={`Unlock with ${label}`}
      helper="Faster than a passcode, and your information stays private on this phone."
      primary={{
        label: available === false ? 'Continue' : `Turn on ${Platform.OS === 'ios' ? 'Face ID' : 'unlock'}`,
        onPress: async () => {
          if (available) {
            const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Turn on quick unlock for Startline' });
            setDraft({ faceId: res.success });
          }
          next();
        },
      }}
      secondary={{ label: 'Not now', onPress: () => { setDraft({ faceId: false }); next(); } }}
    >
      <NoteCard icon="lock">Your face data stays on your phone. Startline never sees it.</NoteCard>
      {available === false ? <NoteCard icon="info">This phone doesn't have {label} set up. You can use your passcode.</NoteCard> : null}
    </AccountScreen>
  );
}
