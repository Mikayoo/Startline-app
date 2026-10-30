import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { MONTHS } from '@/logic/dates';
import { color, palette, radius, space } from '@/theme/tokens';

import { Txt } from './ui';

// One tap per month instead of typing it, so spelling can't go wrong.
export function MonthPicker({ value, onChange }: { value: number | null; onChange: (m: number) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[2] }} accessibilityRole="radiogroup" accessibilityLabel="Month">
      {MONTHS.map((m, i) => (
        <Pressable key={m} accessibilityRole="radio" accessibilityLabel={m} accessibilityState={{ selected: value === i }} onPress={() => onChange(i)} style={[styles.chip, value === i && styles.on]}>
          <Txt variant="label" style={{ fontSize: 14, color: value === i ? palette.white : color.textPrimary }}>
            {m.slice(0, 3)}
          </Txt>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: space[4], paddingVertical: space[2], borderRadius: radius.pill, backgroundColor: color.surface, borderWidth: 1, borderColor: color.borderSubtle },
  on: { backgroundColor: color.actionPrimary, borderColor: color.actionPrimary },
});
