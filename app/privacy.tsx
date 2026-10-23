import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, DemoNotice, IconButton, PillButton, Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

const STORED: [string, string][] = [
  ['Language', 'To show the app in your language'],
  ['City', 'To show local services'],
  ['Who is with you', 'Optional. To add steps like school registration'],
  ['Status', 'Optional. To show steps that depend on it'],
  ['Priorities', 'To order your plan'],
  ['Steps you finished', 'To track your progress'],
];

export default function Privacy() {
  const insets = useSafeAreaInsets();
  const { saved, savePlan, deleteData } = useApp();
  const [deleted, setDeleted] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 60, gap: space[4] }}>
      <IconButton icon="arrow-left" label="Back" onPress={() => router.back()} />
      <Txt variant="screenHeading" accessibilityRole="header">
        Your information
      </Txt>
      <Txt style={{ color: color.textSecondary }}>
        {saved
          ? 'Your plan is saved on this phone. It is not sent to Startline, IRCC or anyone else.'
          : 'Your answers are only kept while the app is open. Save your plan to keep it on this phone.'}
      </Txt>
      <Card style={{ gap: space[3] }}>
        <Txt variant="cardTitle">What Startline keeps, and why</Txt>
        {STORED.map(([k, v]) => (
          <View key={k} style={{ gap: 2 }}>
            <Txt variant="label">{k}</Txt>
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              {v}
            </Txt>
          </View>
        ))}
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Startline never asks for your name in the plan, your documents, your address or your case number.
        </Txt>
      </Card>
      {!saved ? <PillButton label="Save my plan on this phone" onPress={() => savePlan()} /> : null}
      <PillButton
        tone="ghost"
        label={deleted ? 'Your data was deleted' : 'Delete my data'}
        disabled={deleted}
        onPress={async () => {
          await deleteData();
          setDeleted(true);
        }}
      />
      <DemoNotice text="Prototype. The final privacy policy needs a privacy reviewer's approval before the pilot." />
    </ScrollView>
  );
}
