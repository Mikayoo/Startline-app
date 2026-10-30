import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FooterButton, QuestionScreen } from '@/components/layout';
import { OptionCard } from '@/components/ui';
import { HOUSEHOLD_OPTIONS } from '@/content/steps';
import { useApp } from '@/state/AppState';
import { space } from '@/theme/tokens';

export default function Household() {
  // Opened from Profile with ?edit=1: save and go back instead of continuing.
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const go = (href: Parameters<typeof router.push>[0]) => (edit ? router.back() : router.push(href));
  const { profile, update } = useApp();
  return (
    <QuestionScreen
      step={3}
      total={4}
      title="Who is with you in Canada?"
      helper="This helps us add steps like school registration. We don't ask for names."
      footer={
        <>
          <FooterButton label="Continue" arrow disabled={!profile.household} onPress={() => go('/onboarding/priorities')} />
          <FooterButton
            tone="ghost"
            label="Skip this question"
            onPress={() => {
              update({ household: null });
              go('/onboarding/priorities');
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
