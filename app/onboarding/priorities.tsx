import { router } from 'expo-router';
import { View } from 'react-native';

import { FooterButton, QuestionScreen } from '@/components/layout';
import { OptionCard, Txt } from '@/components/ui';
import { PRIORITY_OPTIONS } from '@/content/steps';
import { MAX_PRIORITIES } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

export default function Priorities() {
  const { profile, togglePriority } = useApp();
  const count = profile.priorities.length;
  return (
    <QuestionScreen
      step={5}
      total={5}
      title="What matters most right now?"
      helper={`Pick up to ${MAX_PRIORITIES}. We'll put these first in your plan.`}
      footer={
        <FooterButton
          label={count ? 'See my plan' : 'Pick at least one'}
          arrow={count > 0}
          disabled={count === 0}
          onPress={() => router.push('/onboarding/ready')}
        />
      }
    >
      <Txt variant="label" style={{ color: count === MAX_PRIORITIES ? color.warning : color.textBrand }} accessibilityLiveRegion="polite">
        {count} of {MAX_PRIORITIES} selected{count === MAX_PRIORITIES ? '. Remove one to pick another.' : ''}
      </Txt>
      <View style={{ gap: space[3] }}>
        {PRIORITY_OPTIONS.map((p) => {
          const selected = profile.priorities.includes(p.id);
          return (
            <OptionCard
              key={p.id}
              multi
              icon={p.icon as never}
              title={p.label}
              helper={p.helper}
              selected={selected}
              onPress={() => togglePriority(p.id)}
            />
          );
        })}
      </View>
    </QuestionScreen>
  );
}
