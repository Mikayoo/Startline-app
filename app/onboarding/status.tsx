import { View } from 'react-native';

import { FooterButton, LockNote, QuestionScreen, useNext } from '@/components/layout';
import { OptionCard, Txt } from '@/components/ui';
import { STATUS_OPTIONS } from '@/content/steps';
import { useApp } from '@/state/AppState';
import { font, space } from '@/theme/tokens';

// "v3.1 / OB03 Your situation"
export default function StatusQuestion() {
  const { profile, update } = useApp();
  const next = useNext('/onboarding/place');
  return (
    <QuestionScreen
      step={1}
      total={4}
      title="Which situation fits you?"
      helper="Choose the closest one. You can change it later."
      footer={<FooterButton label="Continue" arrow hint="Choose one to continue." disabled={!profile.status} onPress={next} style={{ minHeight: 56 }} />}
    >
      <View style={{ gap: space[3] }} accessibilityRole="radiogroup">
        {STATUS_OPTIONS.map((s) => (
          <OptionCard
            key={s.id}
            icon={s.icon as never}
            title={s.label}
            helper={s.helper}
            selected={profile.status === s.id}
            onPress={() => update({ status: s.id })}
          />
        ))}
      </View>
      <LockNote>
        <Txt variant="caption" style={{ fontFamily: font.semibold }}>Why we ask: </Txt>
        services have different rules. Startline isn't connected to IRCC.
      </LockNote>
    </QuestionScreen>
  );
}
