import { router } from 'expo-router';
import { useState } from 'react';

import { AccountScreen, Field, NoteCard, TextLink } from '@/components/account';
import { Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

// v3.1 "A1 Log in". Phone first, email as the fallback.
export default function Login() {
  const { setDraft } = useApp();
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');
  const valid = mode === 'phone' ? value.replace(/\D/g, '').length >= 10 : /.+@.+\..+/.test(value);

  return (
    <AccountScreen
      icon={mode === 'phone' ? 'smartphone' : 'mail'}
      title="Welcome back"
      helper={mode === 'phone' ? 'Enter the phone number linked to your Startline account.' : 'Enter the email linked to your Startline account.'}
      primary={{
        label: 'Continue',
        disabled: !valid,
        onPress: () => {
          setDraft({ contact: { kind: mode, value: value.trim() } });
          router.push(mode === 'phone' ? '/account/verify?flow=login' : '/account/email?flow=login');
        },
      }}
      secondary={{ label: mode === 'phone' ? 'Continue with email' : 'Continue with phone', onPress: () => { setMode(mode === 'phone' ? 'email' : 'phone'); setValue(''); } }}
    >
      {mode === 'phone' ? (
        <Field label="Mobile number" prefix="CA +1" value={value} onChangeText={setValue} placeholder="(519) 555-0142" keyboardType="phone-pad" autoComplete="tel" autoFocus />
      ) : (
        <Field label="Email" value={value} onChangeText={setValue} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" autoFocus />
      )}
      {mode === 'phone' ? (
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Lost access to this number? You can sign in with your email instead.
        </Txt>
      ) : null}
      <TextLink label="New to Startline? Create an account" onPress={() => router.replace('/account/save')} />
      <NoteCard icon="alert-circle" tone="warning">
        Prototype: there is no server yet, so signing in starts a new account on this phone.
      </NoteCard>
    </AccountScreen>
  );
}
