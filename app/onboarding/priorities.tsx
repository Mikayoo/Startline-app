import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { FooterButton, QuestionScreen, useNext } from '@/components/layout';
import { Txt } from '@/components/ui';
import { Priority, PRIORITY_OPTIONS } from '@/content/steps';
import { MAX_PRIORITIES } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, palette, radius, shadow, space } from '@/theme/tokens';

// "v3.1 / OB06 Priorities": two-column tiles, up to three.
export default function Priorities() {
  const { profile, update, togglePriority } = useApp();
  const next = useNext('/onboarding/review');
  const [suggested, setSuggested] = useState(false);
  const count = profile.priorities.length;
  const full = count === MAX_PRIORITIES;

  // "Help me choose" fills three priorities from the earlier answers.
  const suggest = () => {
    const picks: Priority[] = ['housing'];
    if (profile.status === 'claimant') picks.push('legal');
    picks.push('health');
    if (profile.household?.includes('children')) picks.push('school');
    picks.push('money');
    update({ priorities: picks.slice(0, MAX_PRIORITIES) });
    setSuggested(true);
  };

  return (
    <QuestionScreen
      step={4}
      total={4}
      title="What matters most now?"
      helper={`Pick up to ${MAX_PRIORITIES}. We'll start your plan with these.`}
      footer={<FooterButton label="Continue" arrow hint="Pick at least one." disabled={count === 0} onPress={next} style={{ minHeight: 56 }} />}
    >
      <View style={styles.head}>
        <Txt variant="label" style={{ color: color.textSecondary, letterSpacing: 0.4 }}>
          YOUR TOP PRIORITIES
        </Txt>
        <View style={[styles.count, !count && { backgroundColor: color.borderSubtle }]} accessibilityLiveRegion="polite">
          <Txt variant="label" style={{ color: count ? palette.white : color.textSecondary }}>
            {count} of {MAX_PRIORITIES}
          </Txt>
        </View>
      </View>
      <View style={styles.grid}>
        {PRIORITY_OPTIONS.map((p) => {
          const on = profile.priorities.includes(p.id);
          const locked = full && !on;
          return (
            <Pressable
              key={p.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on, disabled: locked }}
              accessibilityHint={locked ? 'Remove one to pick another' : undefined}
              onPress={() => {
                setSuggested(false);
                togglePriority(p.id);
              }}
              style={({ pressed }) => [styles.tile, on && styles.tileOn, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.tileTop}>
                <View style={[styles.icon, on && { backgroundColor: palette.white }]}>
                  <Feather name={p.icon as never} size={18} color={color.textBrand} />
                </View>
                <View style={[styles.mark, on && styles.markOn]}>
                  {on ? <Feather name="check" size={13} color={color.actionPrimary} /> : null}
                </View>
              </View>
              <Txt variant="cardTitle" style={on ? { color: palette.white } : undefined}>
                {p.label}
              </Txt>
            </Pressable>
          );
        })}
        <Pressable accessibilityRole="button" onPress={suggest} style={({ pressed }) => [styles.tile, styles.help, pressed && { opacity: 0.85 }]}>
          <Feather name="star" size={18} color={color.textBrand} />
          <Txt variant="cardTitle" style={{ color: color.textBrand }}>
            Not sure? Help me choose
          </Txt>
        </Pressable>
      </View>
      {suggested ? (
        <Txt variant="caption" style={{ color: color.textSecondary }} accessibilityLiveRegion="polite">
          We picked these from your answers. Tap any tile to change them.
        </Txt>
      ) : full ? (
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Remove one to pick another.
        </Txt>
      ) : null}
    </QuestionScreen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space[1] },
  count: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: color.actionPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  tile: {
    flexBasis: '45%',
    flexGrow: 1,
    minHeight: 100,
    padding: 14,
    justifyContent: 'space-between',
    gap: space[3],
    borderRadius: radius.card,
    backgroundColor: color.surface,
    ...shadow.card,
  },
  tileOn: { backgroundColor: color.actionPrimary },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  icon: { width: 38, height: 38, borderRadius: radius.md, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' },
  mark: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: color.borderDefault, alignItems: 'center', justifyContent: 'center' },
  markOn: { backgroundColor: palette.white, borderColor: palette.white },
  help: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: color.borderDefault,
    shadowOpacity: 0,
    elevation: 0,
    justifyContent: 'center',
    gap: space[2],
  },
});
