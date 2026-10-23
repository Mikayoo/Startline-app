import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { STEP_ICON } from '@/components/layout';
import { StepCard } from '@/components/StepCard';
import { Card, Chip, DemoNotice, IconButton, IconName, PillButton, SectionHeader, Txt } from '@/components/ui';
import { municipalityLabel } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, palette, radius, space } from '@/theme/tokens';

const QUICK: { icon: IconName; label: string; href: '/(tabs)/path' | '/(tabs)/ask' | '/(tabs)/help' }[] = [
  { icon: 'map', label: 'My path', href: '/(tabs)/path' },
  { icon: 'message-square', label: 'Ask a question', href: '/(tabs)/ask' },
  { icon: 'life-buoy', label: 'Talk to a person', href: '/(tabs)/help' },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const { plan, profile, done } = useApp();
  const place = municipalityLabel(profile.municipality);
  const hasAnswers = profile.priorities.length > 0;
  const remaining = plan.steps.filter((s) => !done.has(s.step.id));
  const next = remaining[0];
  const nowSteps = plan.steps.filter((s) => s.stage === 'now');
  const nowDone = nowSteps.filter((s) => done.has(s.step.id)).length;

  return (
    <ScrollView style={{ backgroundColor: color.surfaceWarm }} contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 120, gap: space[5] }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            {place}
          </Txt>
          <Txt variant="screenHeading" accessibilityRole="header">
            Your next chapter
          </Txt>
        </View>
        <IconButton icon="settings" label="Privacy and settings" onPress={() => router.push('/privacy')} />
      </View>

      <Pressable accessibilityRole="search" onPress={() => router.push('/(tabs)/ask')} style={styles.search}>
        <Feather name="search" size={18} color={color.textSecondary} />
        <Txt style={{ color: color.textSecondary, flex: 1 }}>Search or ask a question</Txt>
        <View style={styles.searchAction}>
          <Feather name="message-square" size={18} color={palette.white} />
        </View>
      </Pressable>

      {next ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`Next step: ${next.step.title}`} onPress={() => router.push(`/step/${next.step.id}`)}>
          <LinearGradient colors={[palette.teal700, palette.teal900, palette.deep]} style={styles.nextCard}>
            <View style={styles.nextIcon}>
              <Feather name={STEP_ICON[next.step.category]} size={22} color={palette.white} />
            </View>
            <Chip tone="media" icon="star" label={`Next step · ${next.step.categoryLabel}`} />
            <Txt variant="screenHeading" style={{ color: palette.white }}>
              {next.step.title}
            </Txt>
            <View style={styles.nextFoot}>
              <View style={{ gap: 6 }}>
                <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {nowDone} of {nowSteps.length} first steps done
                </Txt>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {nowSteps.map((s) => (
                    <View key={s.step.id} style={[styles.dash, done.has(s.step.id) && { backgroundColor: palette.white }]} />
                  ))}
                </View>
              </View>
              <PillButton tone="inverse" label="Continue" arrow style={{ minHeight: 44, paddingHorizontal: space[4] }} onPress={() => router.push(`/step/${next.step.id}`)} />
            </View>
          </LinearGradient>
        </Pressable>
      ) : (
        <Card>
          <Txt variant="cardTitle">You've finished every step in your plan</Txt>
          <Txt style={{ color: color.textSecondary, marginTop: 4 }}>Ask a question or talk to a person if something else comes up.</Txt>
        </Card>
      )}

      {!hasAnswers ? (
        <Card style={{ gap: space[3] }}>
          <Txt variant="cardTitle">Get a plan made for you</Txt>
          <Txt style={{ color: color.textSecondary }}>You're seeing general steps. Answer 5 short questions to put your priorities first.</Txt>
          <PillButton label="Build my plan" arrow onPress={() => router.push('/onboarding/language')} />
        </Card>
      ) : null}

      <View style={styles.quickRow}>
        {QUICK.map((q) => (
          <Pressable key={q.label} accessibilityRole="button" onPress={() => router.push(q.href)} style={styles.quick}>
            <View style={styles.quickIcon}>
              <Feather name={q.icon} size={20} color={color.textBrand} />
            </View>
            <Txt variant="label" style={{ textAlign: 'center' }}>
              {q.label}
            </Txt>
          </Pressable>
        ))}
      </View>

      <View>
        <SectionHeader title="Coming up" action="See all" onAction={() => router.push('/(tabs)/path')} />
        <View style={{ gap: space[3] }}>
          {remaining.slice(1, 3).map((item) => (
            <StepCard key={item.step.id} item={item} index={plan.steps.indexOf(item)} done={false} place={place} />
          ))}
        </View>
      </View>
      <DemoNotice />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    paddingLeft: space[4],
    padding: 6,
    minHeight: 56,
  },
  searchAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.actionPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCard: { borderRadius: radius.xl, padding: space[5], gap: space[3], minHeight: 224 },
  nextIcon: {
    position: 'absolute',
    right: space[5],
    top: space[5],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextFoot: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' },
  dash: { width: 24, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  quickRow: { flexDirection: 'row', gap: space[3] },
  quick: {
    flex: 1,
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingVertical: space[4],
    paddingHorizontal: space[2],
    alignItems: 'center',
    gap: space[2],
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
