import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FooterButton, QuestionScreen } from '@/components/layout';
import { Card, OptionCard, Txt } from '@/components/ui';
import { STATUS_OPTIONS } from '@/content/steps';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

export default function StatusQuestion() {
  // Opened from Profile with ?edit=1: save and go back instead of continuing.
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const go = (href: Parameters<typeof router.push>[0]) => (edit ? router.back() : router.push(href));
  const { profile, update } = useApp();
  return (
    <QuestionScreen
      step={1}
      total={4}
      title="Which describes you best?"
      helper="Optional. Some steps depend on your immigration status. You can skip this and see general steps."
      footer={
        <>
          <FooterButton label="Continue" arrow hint="Choose one to continue, or skip this question." disabled={!profile.status} onPress={() => go('/onboarding/place')} />
          <FooterButton
            tone="ghost"
            label="Skip this question"
            onPress={() => {
              update({ status: null });
              go('/onboarding/place');
            }}
          />
        </>
      }
    >
      <View style={{ gap: space[3] }}>
        {STATUS_OPTIONS.map((s) => (
          <OptionCard
            key={s.id}
            title={s.label}
            helper={s.helper}
            selected={profile.status === s.id}
            onPress={() => update({ status: s.id })}
          />
        ))}
      </View>
      <Card style={{ backgroundColor: color.brandSubtle, shadowOpacity: 0 }}>
        <Txt variant="label" style={{ color: color.textBrand, marginBottom: 4 }}>
          Why we ask
        </Txt>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Your answer stays on this phone. Startline never shares it with IRCC or anyone else.
        </Txt>
      </Card>
    </QuestionScreen>
  );
}
