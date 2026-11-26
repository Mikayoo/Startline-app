import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AccountScreen, NoteCard } from '@/components/account';
import { Card, Chip, IconTile, Txt } from '@/components/ui';
import { DOCUMENT_GUIDES } from '@/content/documents';
import { STEPS } from '@/content/steps';
import { color, radius, space } from '@/theme/tokens';

// v3.1 "54 Documents you may need". Reached from a step, never from
// onboarding: nothing here is needed to use Startline.
export default function Documents() {
  const { step: stepId = '' } = useLocalSearchParams<{ step?: string }>();
  const step = STEPS[stepId];
  return (
    <AccountScreen
      title="Documents you may need"
      helper="What you need depends on your situation and the service. You can keep going without them."
      primary={{ label: 'Continue', onPress: () => router.back() }}
      secondary={{ label: 'I don’t have these documents', onPress: () => router.push('/(tabs)/resources') }}
    >
      {step ? <Chip tone="brand" icon="star" label={`For: ${step.title}`} /> : null}
      {DOCUMENT_GUIDES.map((d) => (
        <Card key={d.id} style={{ gap: space[2] }}>
          <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
            <IconTile icon={d.icon} size={44} />
            <View style={{ flex: 1 }}>
              <Txt variant="cardTitle">{d.title}</Txt>
              <Txt variant="caption" style={{ color: color.textSecondary }}>
                {d.helper}
              </Txt>
            </View>
          </View>
          <Txt style={{ color: color.textSecondary }}>
            {d.why} {d.ifMissing}
          </Txt>
          <Chip tone={d.level === 'Required' ? 'warning' : 'brand'} label={d.level} />
        </Card>
      ))}
      <Card style={{ padding: 0, gap: 0 }}>
        <Row icon="globe" title="Show documents for my situation" sub="Optional: tell us where you’re from" onPress={() => router.push('/docs/origin')} />
        <View style={styles.divider} />
        <Row icon="camera" title="Check a document with a photo" sub="Optional. Stays on your phone" onPress={() => router.push('/docs/photo')} />
      </Card>
      <NoteCard>Sample list. Requirements change, so always confirm with the service before you go.</NoteCard>
    </AccountScreen>
  );
}

function Row({ icon, title, sub, onPress }: { icon: 'globe' | 'camera'; title: string; sub: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
      <IconTile icon={icon} size={40} />
      <View style={{ flex: 1 }}>
        <Txt variant="cardTitle">{title}</Txt>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          {sub}
        </Txt>
      </View>
      <Feather name="chevron-right" size={20} color={color.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[4], borderRadius: radius.lg },
  divider: { height: 1, backgroundColor: color.borderSubtle, marginHorizontal: space[4] },
});
