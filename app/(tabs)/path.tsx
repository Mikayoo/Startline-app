import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StepCard } from '@/components/StepCard';
import { Card, DemoNotice, Txt } from '@/components/ui';
import { municipalityLabel, PlannedStep, RULES_VERSION } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, palette, radius, space } from '@/theme/tokens';

const STAGES: { id: PlannedStep['stage']; title: string; helper: string }[] = [
  { id: 'now', title: 'Now', helper: 'Start with these' },
  { id: 'soon', title: 'Soon', helper: 'When the first steps are moving' },
  { id: 'later', title: 'Later', helper: 'Worth doing once you are settled' },
];

export default function Path() {
  const insets = useSafeAreaInsets();
  const { plan, profile, done } = useApp();
  const place = municipalityLabel(profile.municipality);
  const total = plan.steps.length;
  const finished = plan.steps.filter((s) => done.has(s.step.id)).length;

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 120, gap: space[5] }}>
      <Txt variant="screenHeading" accessibilityRole="header">
        My path
      </Txt>
      <Card style={{ gap: space[2] }}>
        <Txt variant="cardTitle">
          {finished} of {total} steps done
        </Txt>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: color.borderSubtle, overflow: 'hidden' }} accessibilityRole="progressbar">
          <View style={{ width: `${total ? (finished / total) * 100 : 0}%`, height: 8, borderRadius: 4, backgroundColor: palette.teal700 }} />
        </View>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Ordered by what usually matters first. You can do them in any order.
        </Txt>
      </Card>
      {STAGES.map((stage) => {
        const items = plan.steps.filter((s) => s.stage === stage.id);
        if (!items.length) return null;
        return (
          <View key={stage.id} style={{ gap: space[3] }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: space[2] }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: stage.id === 'now' ? palette.teal700 : color.actionSecondary }}>
                <Txt variant="label" style={{ color: stage.id === 'now' ? palette.white : color.textBrand }}>
                  {stage.title}
                </Txt>
              </View>
              <Txt variant="caption" style={{ color: color.textSecondary }}>
                {stage.helper}
              </Txt>
            </View>
            {items.map((item) => (
              <StepCard key={item.step.id} item={item} index={plan.steps.indexOf(item)} done={done.has(item.step.id)} place={place} />
            ))}
          </View>
        );
      })}
      <DemoNotice text={`Plan rules ${RULES_VERSION}. Prototype content, not yet reviewed by a caseworker.`} />
    </ScrollView>
  );
}
