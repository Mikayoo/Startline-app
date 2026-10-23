import { router } from 'expo-router';
import { View } from 'react-native';

import { FooterButton, QuestionScreen } from '@/components/layout';
import { OptionCard } from '@/components/ui';
import { HOUSEHOLD_OPTIONS } from '@/content/steps';
import { useApp } from '@/state/AppState';
import { space } from '@/theme/tokens';

export default function Household() {
  const { profile, update } = useApp();
  return (
    <QuestionScreen
      step={3}
      total={5}
      title="Who is with you in Canada?"
      helper="This helps us add steps like school registration. We don't ask for names."
      footer={
        <>
          <FooterButton label="Continue" arrow disabled={!profile.household} onPress={() => router.push('/onboarding/status')} />
          <FooterButton
            tone="ghost"
            label="Skip this question"
            onPress={() => {
              update({ household: null });
              router.push('/onboarding/status');
            }}
          />
        </>
      }
    >
      <View style={{ gap: space[3] }}>
        {HOUSEHOLD_OPTIONS.map((h) => (
          <OptionCard
            key={h.id}
            icon={h.icon as never}
            title={h.label}
            selected={profile.household === h.id}
            onPress={() => update({ household: h.id })}
          />
        ))}
      </View>
    </QuestionScreen>
  );
}
