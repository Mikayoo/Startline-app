import { View } from 'react-native';

import { FooterButton, LockNote, QuestionScreen, useNext } from '@/components/layout';
import { OptionCard, Txt } from '@/components/ui';
import { HOUSEHOLD_OPTIONS } from '@/content/steps';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

// "v3.1 / OB05 Household": "Just me", or everyone who is with you.
export default function Household() {
  const { profile, update, toggleHousehold } = useApp();
  const next = useNext('/onboarding/priorities');
  const members = profile.household;
  return (
    <QuestionScreen
      step={3}
      total={4}
      title="Who's settling with you?"
      helper="This helps us show school, childcare, benefits and family housing steps."
      footer={<FooterButton label="Continue" arrow hint="Choose Just me, or who is with you." disabled={members === null} onPress={next} style={{ minHeight: 56 }} />}
    >
      <OptionCard
        icon="user"
        title="Just me"
        helper="Settling on my own"
        selected={members !== null && members.length === 0}
        onPress={() => update({ household: [] })}
      />
      <Txt variant="label" style={{ color: color.textSecondary, letterSpacing: 0.4, marginTop: space[2] }}>
        OR EVERYONE WHO'S WITH YOU
      </Txt>
      <View style={{ gap: space[3] }}>
        {HOUSEHOLD_OPTIONS.map((h) => (
          <OptionCard
            key={h.id}
            multi
            icon={h.icon as never}
            title={h.label}
            helper={h.helper}
            selected={!!members?.includes(h.id)}
            onPress={() => toggleHousehold(h.id)}
          />
        ))}
      </View>
      <LockNote>You can change this anytime in Profile.</LockNote>
    </QuestionScreen>
  );
}
