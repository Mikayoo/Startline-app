import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/InfoCard';
import { PhotoHeader, sheetStyle } from '@/components/PhotoHeader';
import { Card, Chip, DemoNotice, IconName, PillButton, Txt } from '@/components/ui';
import { getService } from '@/content/services';
import { useApp } from '@/state/AppState';
import { color, palette, radius, shadow, space } from '@/theme/tokens';

// v3.1 "13 Service detail".
export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { savedServices, toggleService } = useApp();
  const s = getService(id ?? '');

  if (!s) {
    return (
      <View style={{ flex: 1, padding: space[6], paddingTop: insets.top + space[6], gap: space[4] }}>
        <Txt variant="screenHeading">We couldn't find that service</Txt>
        <PillButton label="Back to resources" onPress={() => router.replace('/(tabs)/resources')} />
      </View>
    );
  }
  const saved = savedServices.has(s.id);
  const facts: { icon: IconName; label: string }[] = [
    ...(s.free ? [{ icon: 'check' as IconName, label: 'Free' }] : []),
    { icon: 'message-square', label: 'Ask about languages' },
    { icon: s.modes.includes('in-person') ? 'map-pin' : 'phone', label: s.modes.includes('in-person') ? 'In person' : 'Phone & online' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: color.surfaceWarm }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <PhotoHeader photo={s.photo} height={320} action={{ icon: saved ? 'check' : 'bookmark', label: saved ? 'Saved' : 'Save', onPress: () => toggleService(s.id) }}>
          <Chip tone="media" icon="users" label="Community support" />
          <Txt variant="display" style={{ color: palette.white, fontSize: 30, lineHeight: 36 }} accessibilityRole="header">
            {s.name}
          </Txt>
          <Txt style={{ color: 'rgba(255,255,255,0.85)' }}>{s.subtitle}</Txt>
        </PhotoHeader>
        <View style={[sheetStyle, { backgroundColor: color.surfaceWarm }]}>
          <View style={{ flexDirection: 'row', gap: space[2] }}>
            {facts.map((f) => (
              <View key={f.label} style={styles.fact}>
                <Feather name={f.icon} size={18} color={color.textBrand} />
                <Txt variant="caption" style={{ textAlign: 'center' }}>
                  {f.label}
                </Txt>
              </View>
            ))}
          </View>
          <View style={{ gap: space[2] }}>
            <Txt variant="title">How it can help</Txt>
            <Txt style={{ color: color.textSecondary }}>{s.howItHelps}</Txt>
          </View>
          {s.url ? (
            <Card onPress={() => Linking.openURL(s.url!)} accessibilityLabel={`Open ${s.url}`} style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
              <Feather name="globe" size={20} color={color.textBrand} />
              <View style={{ flex: 1 }}>
                <Txt variant="cardTitle">Check the original information</Txt>
                <Txt variant="caption" style={{ color: color.textSecondary }}>
                  {s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} · Not yet reviewed
                </Txt>
              </View>
              <Feather name="external-link" size={18} color={color.textSecondary} />
            </Card>
          ) : null}
          <Card onPress={() => router.push('/(tabs)/ask')} style={{ flexDirection: 'row', gap: space[3], alignItems: 'center', backgroundColor: color.brandSubtle, shadowOpacity: 0 }}>
            <Feather name="zap" size={18} color={color.textBrand} />
            <Txt variant="button" style={{ color: color.textBrand, flex: 1 }}>
              Ask Startline about this service
            </Txt>
            <Feather name="arrow-right" size={18} color={color.textBrand} />
          </Card>
          <Txt variant="label" style={{ color: color.textSecondary, marginTop: space[2] }}>
            GOOD TO KNOW
          </Txt>
          {s.goodToKnow.map((g) => (
            <InfoCard key={g.title} icon="info" title={g.title} text={g.text} />
          ))}
          <DemoNotice text="Sample details. Confirm hours, languages and eligibility with the service before you go." />
        </View>
      </ScrollView>
      <View style={[styles.bar, { bottom: insets.bottom + space[3] }]}>
        <View style={{ flex: 1 }}>
          <Txt variant="cardTitle" style={{ color: palette.white }}>
            {s.name}
          </Txt>
          <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {s.free ? 'Free · Sample' : 'Sample'}
          </Txt>
        </View>
        <PillButton tone="inverse" label={saved ? 'Saved' : 'Save to My Path'} arrow={!saved} style={{ paddingHorizontal: space[5] }} onPress={() => toggleService(s.id)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fact: { flex: 1, alignItems: 'center', gap: space[1], paddingVertical: space[3], backgroundColor: color.surface, borderRadius: radius.lg, ...shadow.card },
  bar: { position: 'absolute', left: space[4], right: space[4], flexDirection: 'row', alignItems: 'center', gap: space[3], paddingLeft: space[5], paddingRight: 8, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: palette.deep, ...shadow.floating },
});
