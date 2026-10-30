import { router } from 'expo-router';
import { useState } from 'react';

import { AccountScreen, Field, TextLink } from '@/components/account';
import { DemoNotice, Txt } from '@/components/ui';
import { formatPhone, isValidEmail, isValidPhone, phoneDigits } from '@/logic/account';
import { useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

// v3.1 "A1 Log in". Phone first, email as the fallback.
export default function Login() {
  const { setDraft } = useApp();
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');
  const valid = mode === 'phone' ? isValidPhone(value) : isValidEmail(value);

  return (
    <AccountScreen
      icon={mode === 'phone' ? 'smartphone' : 'mail'}
      title="Welcome back"
      helper={mode === 'phone' ? 'Enter the phone number linked to your Startline account.' : 'Enter the email linked to your Startline account.'}
      primary={{
        label: 'Continue',
        disabled: !valid,
        hint: mode === 'phone' ? 'Enter a 10-digit mobile number.' : 'Enter your email address.',
        onPress: () => {
          setDraft({ contact: { kind: mode, value: value.trim() } });
          router.push(mode === 'phone' ? '/account/verify?flow=login' : '/account/email?flow=login');
        },
      }}
      secondary={{ label: mode === 'phone' ? 'Continue with email' : 'Continue with phone', onPress: () => { setMode(mode === 'phone' ? 'email' : 'phone'); setValue(''); } }}
    >
      {mode === 'phone' ? (
        <Field label="Mobile number" prefix="CA +1" value={value} onChangeText={(v) => setValue(formatPhone(v))} placeholder="(519) 555-0142" keyboardType="phone-pad" autoComplete="tel" autoFocus />
      ) : (
        <Field label="Email" value={value} onChangeText={setValue} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" autoFocus />
      )}
      {mode === 'phone' && phoneDigits(value).length === 10 && !valid ? (
        <Txt variant="caption" style={{ color: color.error }} accessibilityLiveRegion="polite">
          Check the number. Canadian area codes and numbers don't start with 0 or 1.
        </Txt>
      ) : null}
      {mode === 'phone' ? (
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Lost access to this number? You can sign in with your email instead.
        </Txt>
      ) : null}
      <TextLink label="New to Startline? Create an account" onPress={() => router.replace('/account/save')} />
      <DemoNotice text="Prototype: there is no server yet, so signing in starts a new account on this phone." />
    </AccountScreen>
  );
}
