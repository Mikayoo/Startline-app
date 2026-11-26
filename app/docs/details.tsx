import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AccountScreen, Field, NoteCard } from '@/components/account';
import { Chip, Txt } from '@/components/ui';
import { DocumentDetails, maskId, SAMPLE_READ } from '@/content/documents';
import { color, space } from '@/theme/tokens';

// v3.1 "58 Check the details". Startline reads, the person decides. Details
// live in this screen's state only: they tailor the step once and are dropped
// when the screen closes. Nothing is written to storage or an account.
export default function Details() {
  const [d, setD] = useState<DocumentDetails>({ name: SAMPLE_READ.name, uci: SAMPLE_READ.uci, expiry: SAMPLE_READ.expiry });
  const [showId, setShowId] = useState(false);
  const set = (k: keyof DocumentDetails) => (v: string) => setD((p) => ({ ...p, [k]: v }));
  return (
    <AccountScreen
      title="Is this right?"
      helper="From your Refugee Protection Claimant Document. Check each detail and change anything that’s wrong."
      primary={{ label: 'Use these details', onPress: () => router.dismissTo('/docs') }}
      secondary={{ label: 'Retake photo', onPress: () => router.replace('/docs/scan') }}
    >
      <Chip tone="brand" icon="smartphone" label="Read on this phone" />
      <Field label="Name" value={d.name} onChangeText={set('name')} autoComplete="off" />
      {showId ? (
        <Field label="Client ID (UCI)" value={d.uci} onChangeText={set('uci')} keyboardType="number-pad" autoComplete="off" />
      ) : (
        <Pressable accessibilityRole="button" accessibilityLabel="Show client ID" onPress={() => setShowId(true)}>
          <View pointerEvents="none">
            <Field label="Client ID (UCI) · tap to show" value={maskId(d.uci)} onChangeText={() => {}} />
          </View>
        </Pressable>
      )}
      <View style={{ gap: space[1] }}>
        <Field label="Expiry date" value={d.expiry} onChangeText={set('expiry')} autoComplete="off" />
        {SAMPLE_READ.unsure.includes('expiry') ? (
          <Txt variant="caption" style={{ color: color.warning }}>
            Please check. This part of the photo was hard to read.
          </Txt>
        ) : null}
      </View>
      <NoteCard icon="lock">Used once to show steps that apply to you, then deleted. Nothing is saved.</NoteCard>
    </AccountScreen>
  );
}
