import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SourceCard, STEP_ICON, StickyFooter } from '@/components/layout';
import { InfoCard } from '@/components/InfoCard';
import { PhotoHeader } from '@/components/PhotoHeader';
import { Card, Chip, DemoNotice, Meta, PillButton, Txt } from '@/components/ui';
import { stepPhoto } from '@/content/photos';
import { getSource } from '@/content/sources';
import { STEPS } from '@/content/steps';
import { municipalityLabel } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, palette, radius, space } from '@/theme/tokens';

export default function StepDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { plan, profile, done, toggleDone } = useApp();
  const [reported, setReported] = useState(false);
  const step = STEPS[id ?? ''];

  if (!step) {
    return (
      <View style={{ flex: 1, padding: space[6], paddingTop: insets.top + space[6], gap: space[4] }}>
        <Txt variant="screenHeading">We couldn't find that step</Txt>
        <PillButton label="Back to my path" onPress={() => router.replace('/(tabs)/path')} />
      </View>
    );
  }

  const planned = plan.steps.find((s) => s.step.id === step.id);
  const isDone = done.has(step.id);
  const sources = step.sourceIds.map(getSource).filter((s) => s !== undefined);

  return (
    <View style={{ flex: 1, backgroundColor: color.surfaceWarm }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <PhotoHeader
          photo={stepPhoto(step)}
        >
          <Chip tone="media" icon={STEP_ICON[step.category]} label={planned ? `Step ${plan.steps.indexOf(planned) + 1} · ${step.categoryLabel}` : step.categoryLabel} />
          <Txt variant="display" style={{ color: palette.white, fontSize: 30, lineHeight: 36 }} accessibilityRole="header">
            {step.title}
          </Txt>
          <View style={{ flexDirection: 'row', gap: space[4] }}>
            <Meta icon="clock" label={`About ${step.minutes} min`} style={{ color: 'rgba(255,255,255,0.85)' }} />
            <Meta icon="map-pin" label={municipalityLabel(profile.municipality)} style={{ color: 'rgba(255,255,255,0.85)' }} />
          </View>
        </PhotoHeader>

        <View style={styles.sheet}>
          {planned ? (
            <View style={styles.why}>
              <Feather name="info" size={16} color={color.textBrand} />
              <Txt variant="caption" style={{ color: color.textBrand, flex: 1 }}>
                In your plan because: {planned.reason.toLowerCase()}
              </Txt>
            </View>
          ) : null}

          <Txt variant="bodyLarge">{step.summary}</Txt>

          {step.caution ? (
            <Card style={{ backgroundColor: color.warningSubtle, shadowOpacity: 0, flexDirection: 'row', gap: space[2] }}>
              <Feather name="alert-circle" size={18} color={color.warning} />
              <Txt style={{ flex: 1 }}>{step.caution}</Txt>
            </Card>
          ) : null}

          <Section title="Who this is for">
            <Txt style={{ color: color.textSecondary }}>{step.appliesTo}</Txt>
          </Section>

          {step.prepare.length ? (
            <Section title="Before you start">
              {step.prepare.map((p) => (
                <View key={p} style={styles.bulletRow}>
                  <Feather name="check-square" size={16} color={color.textBrand} />
                  <Txt style={{ flex: 1 }}>{p}</Txt>
                </View>
              ))}
            </Section>
          ) : null}

          <Section title="What to do">
            {step.actions.map((a, i) => (
              <View key={a} style={styles.bulletRow}>
                <View style={styles.num}>
                  <Txt variant="label" style={{ color: palette.white }}>
                    {i + 1}
                  </Txt>
                </View>
                <Txt style={{ flex: 1 }}>{a}</Txt>
              </View>
            ))}
          </Section>

          <Section title="Before you contact a service">
            <InfoCard
              icon="message-square"
              title="Questions to ask"
              sub="Who can use it, cost, what to bring"
              points={['Can someone in my situation use this service?', 'Is there any cost?', 'What should I bring to a first visit?', 'Can I get help in my language?', 'How long is the wait right now?']}
            />
            <InfoCard
              icon="check-circle"
              title="Before you hang up"
              sub="Ask for the next step"
              points={['Write down the name of the person you spoke to.', 'Ask for a reference number, if there is one.', 'Ask what happens next, and when.', 'Ask how they will contact you.']}
            />
            <InfoCard
              icon="lock"
              title="Keep private details private"
              text="You don't need to share your UCI, case number or full address on a first call. Share them only if the service asks and you trust it."
            />
          </Section>

          <Section title="Sources">
            {sources.map((s) => (
              <SourceCard
                key={s.id}
                citation={{ sourceId: s.id, title: s.title, publisher: s.publisher, url: s.url, lastChecked: s.lastChecked, reviewed: s.reviewStatus === 'approved' }}
              />
            ))}
          </Section>

          <PillButton
            tone="ghost"
            label={reported ? 'Thanks, we noted it' : 'Report a problem with this step'}
            disabled={reported}
            onPress={() => setReported(true)}
          />
          <DemoNotice />
        </View>
      </ScrollView>
      <StickyFooter>
        <PillButton label="Explore local support" arrow onPress={() => router.push('/(tabs)/resources')} />
        <PillButton tone={isDone ? 'ghost' : 'secondary'} label={isDone ? 'Mark as not done' : 'Mark step as done'} onPress={() => toggleDone(step.id)} />
      </StickyFooter>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: space[2] }}>
      <Txt variant="title">{title}</Txt>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    marginTop: -28,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    backgroundColor: color.surfaceWarm,
    padding: space[6],
    gap: space[5],
  },
  why: { flexDirection: 'row', gap: space[2], padding: space[3], borderRadius: radius.md, backgroundColor: color.brandSubtle },
  bulletRow: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start' },
  num: { width: 24, height: 24, borderRadius: 12, backgroundColor: color.actionPrimary, alignItems: 'center', justifyContent: 'center' },
});
