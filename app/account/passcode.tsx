import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { AccountScreen, hashPasscode, Keypad, PASSCODE_LENGTH, PasscodeDots } from '@/components/account';
import { Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

// v3.1 "A4 Create passcode" and "A5 Confirm passcode".
export default function Passcode() {
  const { flow = 'create', stage = 'create' } = useLocalSearchParams<{ flow?: string; stage?: string }>();
  const { draft, setDraft, updateAccount, unlock } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (code.length < PASSCODE_LENGTH) return;
    if (stage === 'create') {
      setDraft({ pendingPasscode: code });
      setCode('');
      router.push(`/account/passcode?flow=${flow}&stage=confirm`);
      return;
    }
    if (code !== draft.pendingPasscode) {
      setError("Those didn't match. Try again.");
      setCode('');
      return;
    }
    hashPasscode(code).then(async (passcodeHash) => {
      if (flow === 'reset') {
        await updateAccount({ passcodeHash });
        unlock();
        router.replace('/');
        return;
      }
      setDraft({ passcodeHash, pendingPasscode: undefined });
      router.push(`/account/faceid?flow=${flow}`);
    });
  }, [code, stage, flow, draft.pendingPasscode, setDraft, updateAccount, unlock]);

  return (
    <AccountScreen
      icon="lock"
      title={stage === 'create' ? 'Create a passcode' : 'Confirm your passcode'}
      helper={stage === 'create' ? 'Choose 6 digits to keep your information private on this phone.' : 'Enter the same 6 digits again.'}
    >
      <PasscodeDots count={code.length} />
      {error ? (
        <Txt variant="caption" style={{ color: color.error, textAlign: 'center' }} accessibilityLiveRegion="polite">
          {error}
        </Txt>
      ) : null}
      <Keypad value={code} onChange={(v) => { setError(''); setCode(v); }} />
    </AccountScreen>
  );
}
