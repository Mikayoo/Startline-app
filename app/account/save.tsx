import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountScreen, Field, NoteCard, TextLink } from '@/components/account';
import { Card, Txt } from '@/components/ui';
import { municipalityLabel } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

// v3.1 "OB09 Save your plan". Starts the create-account flow.
export default function SavePlan() {
  const { plan, profile, setDraft, savePlan } = useApp();
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [value, setValue] = useState('');
  const valid = mode === 'phone' ? value.replace(/\D/g, '').length >= 10 : /.+@.+\..+/.test(value);

  return (
    <AccountScreen
      title="Save your plan"
      helper="Keep your plan, reminders and contacts safe, even if you change phones."
      topRight={{ label: 'Not now', onPress: () => router.back() }}
      primary={{
        label: 'Continue',
        disabled: !valid,
        onPress: () => {
          setDraft({ contact: { kind: mode, value: value.trim() } });
          router.push(mode === 'phone' ? '/account/verify?flow=create' : '/account/email?flow=create');
        },
      }}
      secondary={{ label: mode === 'phone' ? 'Use email instead' : 'Use a phone number instead', onPress: () => { setMode(mode === 'phone' ? 'email' : 'phone'); setValue(''); } }}
    >
      <Card style={{ gap: 2 }}>
        <Txt variant="cardTitle">
          {plan.steps.length} steps · {municipalityLabel(profile.municipality)}
        </Txt>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Your starting plan
        </Txt>
      </Card>
      {mode === 'phone' ? (
        <Field label="Mobile number" prefix="CA +1" value={value} onChangeText={setValue} placeholder="(519) 555-0142" keyboardType="phone-pad" autoComplete="tel" />
      ) : (
        <Field label="Email" value={value} onChangeText={setValue} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" />
      )}
      <Txt variant="caption" style={{ color: color.textSecondary }}>
        No Canadian number yet? Use any number, or your email.
      </Txt>
      <Card style={{ gap: space[2] }}>
        <Txt variant="cardTitle">Before you continue</Txt>
        <Txt style={{ color: color.textSecondary }}>
          Your account only stores your plan, reminders and saved contacts. Startline never shares them with IRCC or any government office.
        </Txt>
      </Card>
      <NoteCard icon="alert-circle" tone="warning">
        Prototype: your account is kept on this phone only. No text or email is sent.
      </NoteCard>
      <View style={{ alignItems: 'center' }}>
        <TextLink
          label="Save on this phone only, without an account"
          onPress={async () => {
            await savePlan();
            router.back();
          }}
        />
      </View>
    </AccountScreen>
  );
}
