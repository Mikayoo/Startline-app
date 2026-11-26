import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountScreen, NoteCard } from '@/components/account';
import { Chip, OptionCard } from '@/components/ui';
import { space } from '@/theme/tokens';

const COUNTRIES = ['Afghanistan', 'Eritrea', 'Nigeria', 'Syria'];

// v3.1 "53 Where are you from (optional)". Context only: it never verifies
// identity or status, and the answer is not stored.
export default function Origin() {
  const [choice, setChoice] = useState<string | null>(null);
  return (
    <AccountScreen
      title="Where are you from?"
      helper="It helps us show documents and support that may apply to you."
      primary={{ label: 'Continue', onPress: () => router.back() }}
      secondary={{ label: 'Prefer not to say', onPress: () => router.back() }}
    >
      <Chip tone="brand" icon="star" label="Optional" />
      <View style={{ gap: space[3] }}>
        {COUNTRIES.map((c) => (
          <OptionCard key={c} title={c} selected={choice === c} onPress={() => setChoice(c)} />
        ))}
      </View>
      <NoteCard icon="lock">Your answer stays private. It’s never shared with any government, including your home country.</NoteCard>
    </AccountScreen>
  );
}
