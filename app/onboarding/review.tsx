import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { FooterButton, QuestionScreen } from '@/components/layout';
import { IconName, Txt } from '@/components/ui';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/content/steps';
import { placeLong } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, font, radius, shadow, space } from '@/theme/tokens';

const LANGUAGE_NAMES: Record<string, string> = { en: 'English' };

const MEMBER_SHORT: Record<string, string> = { partner: 'partner', children: 'children', other: 'other family' };

function householdText(members: string[] | null): string {
  if (members === null) return 'Not answered';
  if (members.length === 0) return 'Just me';
  const names = members.map((m) => MEMBER_SHORT[m] ?? m);
  const text = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return text[0].toUpperCase() + text.slice(1);
}

// "v3.1 / OB07 Review". Change opens the question and Continue there comes
// straight back here.
export default function Review() {
  const { profile } = useApp();
  const place = placeLong(profile);
  const rows: { icon: IconName; label: string; value: string; edit: string | null }[] = [
    { icon: 'message-square', label: 'Language', value: LANGUAGE_NAMES[profile.language] ?? profile.language, edit: '/welcome' },
    { icon: 'file-text', label: 'Situation', value: STATUS_OPTIONS.find((s) => s.id === profile.status)?.label ?? 'Not answered', edit: '/onboarding/status' },
    { icon: 'map-pin', label: 'Location', value: place, edit: '/onboarding/place' },
    { icon: 'users', label: 'Household', value: householdText(profile.household), edit: '/onboarding/household' },
    {
      icon: 'star',
      label: 'Priorities',
      value: profile.priorities.map((p) => PRIORITY_OPTIONS.find((o) => o.id === p)?.label ?? p).join(' · ') || 'None yet',
      edit: '/onboarding/priorities',
    },
  ];

  return (
    <QuestionScreen
      step={4}
      total={4}
      chip="Review"
      title="Does this look right?"
      helper="Tap Change on anything that's not quite right."
      footer={<FooterButton label="Build my plan" arrow style={{ minHeight: 56 }} onPress={() => router.push('/onboarding/ready')} />}
    >
      <View style={styles.card}>
        {rows.map((r, i) => (
          <View key={r.label} style={[styles.row, i > 0 && styles.divider]}>
            <View style={styles.icon}>
              <Feather name={r.icon} size={18} color={color.textBrand} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Txt variant="caption" style={{ color: color.textSecondary }}>
                {r.label}
              </Txt>
              <Txt variant="cardTitle">{r.value}</Txt>
            </View>
            {r.edit ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Change ${r.label.toLowerCase()}`}
                hitSlop={8}
                onPress={() => router.push(`${r.edit}?from=review` as never)}
                style={({ pressed }) => [styles.change, pressed && { opacity: 0.8 }]}
              >
                <Txt variant="label" style={{ color: color.textBrand }}>
                  Change
                </Txt>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
      <View style={styles.saved}>
        <Feather name="lock" size={16} color={color.textBrand} style={{ marginTop: 2 }} />
        <Txt style={{ flex: 1 }}>
          <Txt style={{ fontFamily: font.semibold }}>Saved only on this phone. </Txt>
          Nothing leaves your device unless you choose to save your plan.
        </Txt>
      </View>
    </QuestionScreen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, backgroundColor: color.surface, paddingHorizontal: space[4], paddingVertical: space[1], marginTop: space[1], ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  divider: { borderTopWidth: 1, borderTopColor: color.borderSubtle },
  icon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' },
  change: { paddingHorizontal: space[3], paddingVertical: 6, borderRadius: radius.pill, backgroundColor: color.brandSubtle },
  saved: { flexDirection: 'row', gap: space[3], padding: space[4], borderRadius: radius.card, backgroundColor: color.brandSubtle, marginTop: space[2] },
});
