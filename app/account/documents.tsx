import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountScreen } from '@/components/account';
import { Chip, OptionCard } from '@/components/ui';
import { DocumentKind } from '@/state/AppState';
import { space } from '@/theme/tokens';

const OPTIONS: { id: DocumentKind | 'none'; title: string; helper: string; icon: 'file-text' | 'globe' | 'help-circle' }[] = [
  { id: 'claimant', title: 'Refugee Protection Claimant Document', helper: 'Often called the brown paper', icon: 'file-text' },
  { id: 'passport', title: 'Passport or other ID', helper: 'From your home country or Canada', icon: 'globe' },
  { id: 'none', title: "I don't have documents yet", helper: 'A settlement worker can help you get them', icon: 'help-circle' },
];

// v3.1 "A10 Documents (context)". Only asked when a step needs it.
export default function Documents() {
  const [choice, setChoice] = useState<DocumentKind | 'none'>('claimant');
  return (
    <AccountScreen
      title="Which document do you have?"
      helper="Choose what you have today. You can add more later."
      primary={{
        label: 'Continue',
        onPress: () => (choice === 'none' ? router.replace('/help') : router.push(`/account/scan-tips?doc=${choice}`)),
      }}
    >
      <Chip tone="brand" icon="star" label="Only asked when a step needs it" />
      <View style={{ gap: space[3] }}>
        {OPTIONS.map((o) => (
          <OptionCard key={o.id} title={o.title} helper={o.helper} icon={o.icon} selected={choice === o.id} onPress={() => setChoice(o.id)} />
        ))}
      </View>
    </AccountScreen>
  );
}
