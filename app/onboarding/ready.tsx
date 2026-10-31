import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhotoHero } from '@/components/layout';
import { StepCard } from '@/components/StepCard';
import { Chip, DemoNotice, IconButton, PillButton, SectionHeader, Txt } from '@/components/ui';
import { placeLabel } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, palette, radius, shadow, space } from '@/theme/tokens';

export default function PlanReady() {
  const insets = useSafeAreaInsets();
  const { plan, profile, done, saved } = useApp();
  const now = plan.steps.filter((s) => s.stage === 'now');
  const place = placeLabel(profile);
  const first = now[0];

  return (
    <View style={{ flex: 1, backgroundColor: color.surfaceWarm }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
        <PhotoHero height={300 + insets.top} colors={[palette.teal900, palette.deep]}>
          <Image source={require('../../assets/images/ob08-hero.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
          <LinearGradient
            colors={['rgba(5,41,37,0.55)', 'rgba(5,41,37,0.15)', 'rgba(5,41,37,0.92)']}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={{ paddingTop: insets.top + space[2], paddingHorizontal: space[6], flex: 1 }}>
            <IconButton icon="arrow-left" label="Back" onMedia onPress={() => router.back()} />
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 48, gap: space[2] }}>
              <Chip tone="media" icon="star" label="Your starting plan" />
              <Txt variant="display" style={{ color: palette.white, fontSize: 32, lineHeight: 38, letterSpacing: -0.48 }} accessibilityRole="header">
                Your plan is ready
              </Txt>
              <Txt style={{ color: 'rgba(255,255,255,0.82)' }}>
                {now.length} steps to start with, {plan.steps.length} in total. Start with one. The others will wait.
              </Txt>
            </View>
          </View>
        </PhotoHero>
        <View style={styles.sheet}>
          <SectionHeader
            title="Your next steps"
            action={saved ? 'Saved on this phone' : 'Save my plan'}
            onAction={saved ? undefined : () => router.push('/account/save')}
          />
          <View style={{ gap: space[3] }}>
            {now.map((item, i) => (
              <StepCard key={item.step.id} item={item} index={i} done={done.has(item.step.id)} place={place} highlight={i === 0} />
            ))}
          </View>
          {!plan.localSamples ? (
            <DemoNotice text="Local agencies in the prototype are samples from Waterloo Region. Your steps link to national and provincial sources instead." />
          ) : null}
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            {plan.steps.length - now.length} more steps are waiting in My Path. Saving keeps your plan on this phone only.
          </Txt>
        </View>
      </ScrollView>
      <View style={[styles.bar, { bottom: insets.bottom + space[3] }]}>
        <View style={{ flex: 1 }}>
          <Txt variant="cardTitle" style={{ color: palette.white }}>
            {plan.steps.length} steps · {place}
          </Txt>
          <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {saved ? 'Saved on this phone' : 'Not saved yet'}
          </Txt>
        </View>
        <PillButton
          tone="inverse"
          label="Start step 1"
          arrow
          style={{ paddingHorizontal: space[5], minHeight: 56 }}
          onPress={() => {
            router.replace('/');
            if (first) router.push(`/step/${first.step.id}`);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    marginTop: -28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: color.surfaceWarm,
    padding: space[6],
    gap: space[3],
  },
  bar: {
    position: 'absolute',
    left: space[4],
    right: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingLeft: space[5],
    paddingRight: 8,
    paddingVertical: 8,
    minHeight: 72,
    borderRadius: radius.pill,
    backgroundColor: '#0A332E',
    ...shadow.floating,
  },
});
