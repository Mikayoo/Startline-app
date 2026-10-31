import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StepCard } from '@/components/StepCard';
import { Chip, DemoNotice, Txt } from '@/components/ui';
import { placeLabel, PlannedStep, RULES_VERSION } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, palette, radius, space } from '@/theme/tokens';

const STAGES: { id: PlannedStep['stage']; title: string; helper: string }[] = [
  { id: 'now', title: 'Now', helper: 'DO THESE FIRST' },
  { id: 'soon', title: 'Soon', helper: 'COMING UP SOON' },
  { id: 'later', title: 'Later', helper: 'ONCE YOU ARE SETTLED' },
];

export default function Path() {
  const insets = useSafeAreaInsets();
  const { plan, profile, done } = useApp();
  const place = placeLabel(profile);
  const total = plan.steps.length;
  const finished = plan.steps.filter((s) => done.has(s.step.id)).length;

  const [stage, setStage] = useState<PlannedStep['stage']>('now');
  const items = plan.steps.filter((s) => s.stage === stage);
  const current = STAGES.find((s) => s.id === stage)!;

  return (
    <ScrollView style={{ backgroundColor: color.surfaceWarm }} contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 130, gap: space[4] }}>
      <View>
        <Txt variant="label" style={{ color: color.textBrand }}>
          YOUR ROADMAP
        </Txt>
        <Txt variant="display" accessibilityRole="header">
          My Path
        </Txt>
      </View>
      <LinearGradient colors={[palette.teal800, palette.deep]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.xl, padding: space[5], gap: space[3] }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Starting plan
            </Txt>
            <Txt variant="title" style={{ color: palette.white }}>
              {finished} of {total} steps done
            </Txt>
          </View>
          <Chip tone="media" icon="map-pin" label={place} />
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }} accessibilityRole="progressbar" accessibilityLabel={`${finished} of ${total} steps done`}>
          {plan.steps.map((s) => (
            <View key={s.step.id} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: done.has(s.step.id) ? palette.teal300 : 'rgba(255,255,255,0.2)' }} />
          ))}
        </View>
      </LinearGradient>
      <View style={{ flexDirection: 'row', backgroundColor: palette.white, borderRadius: radius.pill, padding: 4 }}>
        {STAGES.map((st) => {
          const count = plan.steps.filter((s) => s.stage === st.id).length;
          const on = st.id === stage;
          return (
            <Pressable
              key={st.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              onPress={() => setStage(st.id)}
              style={{ flex: 1, alignItems: 'center', paddingVertical: space[3], borderRadius: radius.pill, backgroundColor: on ? palette.teal700 : 'transparent' }}
            >
              <Txt variant="button" style={{ color: on ? palette.white : color.textSecondary }}>
                {st.title} · {count}
              </Txt>
            </Pressable>
          );
        })}
      </View>
      <Txt variant="label" style={{ color: color.textSecondary }}>
        {current.helper}
      </Txt>
      {items.map((item) => (
        <StepCard key={item.step.id} item={item} index={plan.steps.indexOf(item)} done={done.has(item.step.id)} place={place} highlight={stage === 'now' && item === items.find((i) => !done.has(i.step.id))} />
      ))}
      {items.length === 0 ? <Txt style={{ color: color.textSecondary }}>Nothing here yet. New steps appear as you move forward.</Txt> : null}
      <DemoNotice text={`Plan rules ${RULES_VERSION}. Prototype content, not yet reviewed by a caseworker.`} />
    </ScrollView>
  );
}
