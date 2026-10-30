import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Chip, DemoNotice, IconButton, IconName, PillButton, SectionHeader, Txt } from '@/components/ui';
import { PHOTO, stepPhoto } from '@/content/photos';
import { getSource } from '@/content/sources';
import { municipalityLabel } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, palette, radius, shadow, space } from '@/theme/tokens';

const QUICK: { icon: IconName; label: string; href: '/dates' | '/saved' | '/help' }[] = [
  { icon: 'calendar', label: 'My dates', href: '/dates' },
  { icon: 'bookmark', label: 'Saved', href: '/saved' },
  { icon: 'phone', label: 'Help today', href: '/help' },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

// v3.1 "09 Home".
export default function Home() {
  const insets = useSafeAreaInsets();
  const { plan, profile, done, account } = useApp();
  const place = municipalityLabel(profile.municipality);
  const hasAnswers = profile.priorities.length > 0;
  const remaining = plan.steps.filter((s) => !done.has(s.step.id));
  const next = remaining[0];
  const nowSteps = plan.steps.filter((s) => s.stage === 'now');
  const nowDone = nowSteps.filter((s) => done.has(s.step.id)).length;
  const name = account?.name;

  return (
    <ScrollView style={{ backgroundColor: color.surfaceWarm }} contentContainerStyle={{ paddingTop: insets.top + space[3], paddingBottom: 130, gap: space[5] }}>
      <View style={[styles.pad, styles.header]}>
        <View style={styles.avatar} accessible={false}>
          {name ? (
            <Txt variant="cardTitle" style={{ color: palette.white }}>
              {name.slice(0, 1).toUpperCase()}
            </Txt>
          ) : (
            <Feather name="user" size={20} color={palette.white} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            {name ? `${greeting()}, ${name}` : `${greeting()} · ${place}`}
          </Txt>
          <Txt variant="screenHeading" accessibilityRole="header">
            Your next chapter
          </Txt>
        </View>
        <IconButton icon="bell" label="Reminders" onPress={() => router.push('/dates')} />
      </View>

      <View style={[styles.pad, { flexDirection: 'row', gap: space[2] }]}>
        <Pressable accessibilityRole="search" onPress={() => router.push('/(tabs)/resources')} style={styles.search}>
          <Feather name="search" size={18} color={color.textSecondary} />
          <Txt style={{ color: color.textSecondary, flex: 1 }}>Search or ask a question</Txt>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Ask Startline" onPress={() => router.push('/(tabs)/ask')} style={styles.askButton}>
          <Feather name="zap" size={20} color={palette.white} />
        </Pressable>
      </View>

      <View style={styles.pad}>
        {next ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`Next step: ${next.step.title}`} onPress={() => router.push(`/step/${next.step.id}`)} style={styles.nextCard}>
            <Image source={stepPhoto(next.step)} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
            <LinearGradient colors={['rgba(5,41,37,0.25)', 'rgba(5,41,37,0.15)', 'rgba(5,41,37,0.85)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
            <Chip tone="media" icon="star" label={`Next step · ${next.step.categoryLabel}`} />
            <View style={{ marginTop: 'auto', gap: space[3] }}>
              <Txt variant="screenHeading" style={{ color: palette.white }}>
                {next.step.title}
              </Txt>
              <View style={styles.nextFoot}>
                <View style={{ gap: 6 }}>
                  <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.85)' }}>
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
            </View>
          </Pressable>
        ) : (
          <Card>
            <Txt variant="cardTitle">You've finished every step in your plan</Txt>
            <Txt style={{ color: color.textSecondary, marginTop: 4 }}>Ask a question or talk to a person if something else comes up.</Txt>
          </Card>
        )}
      </View>

      {!hasAnswers ? (
        <View style={styles.pad}>
          <Card style={{ gap: space[3] }}>
            <Txt variant="cardTitle">Get a plan made for you</Txt>
            <Txt style={{ color: color.textSecondary }}>You're seeing general steps. Answer 4 short questions to put your priorities first.</Txt>
            <PillButton label="Build my plan" arrow onPress={() => router.push('/onboarding/status')} />
          </Card>
        </View>
      ) : null}

      <View style={[styles.pad, styles.quickRow]}>
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

      {remaining.length > 1 ? (
        <View>
          <View style={styles.pad}>
            <SectionHeader title="Recommended for you" action="See all" onAction={() => router.push('/(tabs)/path')} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space[6], gap: space[3] }}>
            {remaining.slice(1, 6).map((item) => {
              const source = getSource(item.step.sourceIds[0]);
              return (
                <Pressable key={item.step.id} accessibilityRole="button" onPress={() => router.push(`/step/${item.step.id}`)} style={styles.rec}>
                  <Image source={stepPhoto(item.step)} style={styles.recPhoto} contentFit="cover" accessible={false} />
                  <View style={styles.recBody}>
                    <Chip label={item.step.categoryLabel} />
                    <Txt variant="cardTitle" numberOfLines={2} style={styles.recTitle}>
                      {item.step.title}
                    </Txt>
                    {source ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
                        <Feather name="check" size={12} color={color.textBrand} />
                        <Txt variant="caption" numberOfLines={1} style={{ color: color.textSecondary, flex: 1 }}>
                          {source.publisher} · Sample
                        </Txt>
                      </View>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.pad}>
        <SectionHeader title="Coming up" action="See all" onAction={() => router.push('/dates')} />
        <Pressable accessibilityRole="button" onPress={() => router.push('/dates')}>
          <LinearGradient colors={[palette.teal800, palette.deep]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.coming}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
              <View style={styles.comingIcon}>
                <Feather name="calendar" size={18} color={palette.white} />
              </View>
              <Txt variant="title" style={{ color: palette.white, flex: 1 }}>
                No dates added yet
              </Txt>
            </View>
            <Txt style={{ color: 'rgba(255,255,255,0.8)' }}>Add dates from letters or appointments so you don't have to remember them.</Txt>
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.pad}>
        <SectionHeader title="Near you" action="See all" onAction={() => router.push('/(tabs)/resources')} />
        <Card onPress={() => router.push('/service/kpl')} accessibilityLabel="Settlement workers at Kitchener Public Library" style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
          <Image source={PHOTO.dropin} style={{ width: 72, height: 72, borderRadius: radius.lg }} contentFit="cover" accessible={false} />
          <View style={{ flex: 1, gap: 4 }}>
            <Chip icon="users" label="Drop-in · Sample" />
            <Txt variant="cardTitle">Settlement workers</Txt>
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              Kitchener Public Library
            </Txt>
          </View>
          <Feather name="chevron-right" size={20} color={color.textSecondary} />
        </Card>
      </View>

      <View style={styles.pad}>
        <DemoNotice />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space[6] },
  header: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: palette.teal700, alignItems: 'center', justifyContent: 'center' },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space[4],
    minHeight: 52,
    ...shadow.card,
  },
  askButton: { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: color.actionPrimary, alignItems: 'center', justifyContent: 'center' },
  nextCard: { borderRadius: radius.xl, padding: space[4], minHeight: 224, overflow: 'hidden' },
  nextFoot: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  dash: { width: 24, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' },
  quickRow: { flexDirection: 'row', gap: space[3] },
  quick: { flex: 1, backgroundColor: color.surface, borderRadius: radius.card, paddingVertical: space[4], paddingHorizontal: space[2], alignItems: 'center', gap: space[2], ...shadow.card },
  quickIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' },
  // Every recommended card is the same size: fixed width and height, a
  // two-line title slot and the source pinned to the bottom.
  rec: { width: 224, height: 252, backgroundColor: color.surface, borderRadius: radius.card, overflow: 'hidden', ...shadow.card },
  recPhoto: { width: '100%', height: 120 },
  recBody: { flex: 1, padding: space[3], gap: space[2] },
  recTitle: { minHeight: 44 },
  coming: { borderRadius: radius.xl, padding: space[5], gap: space[3] },
  comingIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
});
