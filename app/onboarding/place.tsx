import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FooterButton, QuestionScreen } from '@/components/layout';
import { DemoNotice, OptionCard } from '@/components/ui';
import { MUNICIPALITY_OPTIONS } from '@/content/steps';
import { useApp } from '@/state/AppState';
import { space } from '@/theme/tokens';

export default function Place() {
  // Opened from Profile with ?edit=1: save and go back instead of continuing.
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const go = (href: Parameters<typeof router.push>[0]) => (edit ? router.back() : router.push(href));
  const { profile, update } = useApp();
  return (
    <QuestionScreen
      step={2}
      total={4}
      title="Where are you living now?"
      helper="Local services are different in each city. We only use this to show the right ones."
      footer={
        <FooterButton
          label="Continue"
          arrow
          disabled={!profile.municipality}
          hint="Choose where you live now to continue."
          onPress={() => go('/onboarding/household')}
        />
      }
    >
      <View style={{ gap: space[3] }}>
        {MUNICIPALITY_OPTIONS.map((m) => (
          <OptionCard
            key={m.id}
            icon="map-pin"
            title={m.label}
            selected={profile.municipality === m.id}
            onPress={() => update({ municipality: m.id })}
          />
        ))}
      </View>
      {profile.municipality === 'elsewhere' ? (
        <DemoNotice text="The pilot covers Kitchener, Waterloo and Cambridge. You can still build a plan, but local services may not apply to you." />
      ) : null}
    </QuestionScreen>
  );
}
