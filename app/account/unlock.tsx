import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { AccountScreen, hashPasscode, Keypad, PASSCODE_LENGTH, PasscodeDots, TextLink } from '@/components/account';
import { Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

// v3.1 "A12 Enter passcode". Shown on launch when an account exists.
export default function Unlock() {
  const { account, unlock } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const done = useCallback(() => {
    unlock();
    router.replace('/');
  }, [unlock]);

  const tryFaceId = useCallback(async () => {
    const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Unlock Startline' }).catch(() => null);
    if (res?.success) done();
  }, [done]);

  useEffect(() => {
    if (account?.faceId) tryFaceId();
  }, [account?.faceId, tryFaceId]);

  useEffect(() => {
    if (code.length < PASSCODE_LENGTH || !account) return;
    hashPasscode(code).then((h) => {
      if (h === account.passcodeHash) done();
      else {
        setError('That passcode is not right. Try again.');
        setCode('');
      }
    });
  }, [code, account, done]);

  return (
    <AccountScreen back={false} icon="lock" title="Enter your passcode" helper={account?.name ? `Welcome back, ${account.name}.` : 'Welcome back.'}>
      <PasscodeDots count={code.length} />
      {error ? (
        <Txt variant="caption" style={{ color: color.error, textAlign: 'center' }} accessibilityLiveRegion="polite">
          {error}
        </Txt>
      ) : null}
      <View style={{ alignItems: 'center', gap: 12 }}>
        <TextLink label="Forgot passcode?" onPress={() => router.push('/account/reset')} />
        {account?.faceId ? <TextLink label="Use Face ID" onPress={tryFaceId} /> : null}
      </View>
      <Keypad value={code} onChange={(v) => { setError(''); setCode(v); }} />
    </AccountScreen>
  );
}
