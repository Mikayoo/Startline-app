import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/InfoCard';
import { StickyFooter } from '@/components/layout';
import { PhotoHeader, sheetStyle } from '@/components/PhotoHeader';
import { Card, Chip, DemoNotice, IconName, PillButton, Txt } from '@/components/ui';
import { PHOTO } from '@/content/photos';
import { color, palette, radius, space } from '@/theme/tokens';

const START: { icon: IconName; title: string; sub: string; onPress: () => void }[] = [
  { icon: 'search', title: 'Find a service', sub: 'Housing, food, health and legal support', onPress: () => router.push('/(tabs)/resources') },
  { icon: 'users', title: 'Talk to someone', sub: 'Ask a settlement worker to contact you', onPress: () => router.push('/referral') },
  { icon: 'map-pin', title: 'Choose a city', sub: 'No need to share your exact location', onPress: () => router.push('/onboarding/place?from=review') },
];

// v3.1 "26 Help today".
export default function Help() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: color.surfaceWarm }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <PhotoHeader photo={PHOTO.library} height={290}>
          <Chip tone="media" icon="star" label="Support today" />
          <Txt variant="display" style={{ color: palette.white, fontSize: 30, lineHeight: 36 }} accessibilityRole="header">
            Start with what needs attention
          </Txt>
          <Txt style={{ color: 'rgba(255,255,255,0.85)' }}>Browse support without creating an account.</Txt>
        </PhotoHeader>
        <View style={[sheetStyle, { backgroundColor: color.surfaceWarm }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Call 911" onPress={() => Linking.openURL('tel:911')} style={styles.danger}>
            <Feather name="phone-call" size={18} color={color.error} />
            <Txt style={{ flex: 1 }}>
              <Txt style={{ fontWeight: '700' }}>Immediate danger? </Txt>
              Call 911 if there's a threat to life or safety. Startline doesn't monitor requests.
            </Txt>
          </Pressable>
          <Txt variant="label" style={{ color: color.textSecondary }}>
            START HERE
          </Txt>
          <Card style={{ paddingVertical: space[1] }}>
            {START.map((r) => (
              <Pressable key={r.title} accessibilityRole="button" onPress={r.onPress} style={styles.row}>
                <View style={styles.rowIcon}>
                  <Feather name={r.icon} size={18} color={color.textBrand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Txt variant="cardTitle">{r.title}</Txt>
                  <Txt variant="caption" style={{ color: color.textSecondary }}>
                    {r.sub}
                  </Txt>
                </View>
                <Feather name="chevron-right" size={20} color={color.textSecondary} />
              </Pressable>
            ))}
          </Card>
          <Txt variant="label" style={{ color: color.textSecondary, marginTop: space[2] }}>
            IF IT CAN'T WAIT
          </Txt>
          <InfoCard
            icon="phone-call"
            title="Urgent lines"
            sub="Free, any time. Tap to call"
            pointIcon="phone"
            points={['Emergency: call 911', 'Mental health crisis: call or text 988', 'Community and social services: call 211']}
            onPointPress={(i) => Linking.openURL(['tel:911', 'tel:988', 'tel:211'][i])}
          />
          <InfoCard icon="home" title="Need a place to stay tonight?" text="Call or text 2-1-1 and ask about emergency shelter where you are." />
          <InfoCard icon="heart" title="You're not alone" text="Settlement workers and community navigators help people in your situation every day." />
          <Txt variant="label" style={{ color: color.textSecondary, marginTop: space[2] }}>
            WHAT TO SAY WHEN YOU CALL
          </Txt>
          <InfoCard
            icon="message-square"
            title="A simple way to start"
            text={'"Hello, I\'m new to Canada. I have a question about my situation. Can you help, or tell me who can?"'}
          />
          <InfoCard icon="briefcase" title="Free legal help" sub="If you qualify" pointIcon="arrow-right" points={['Legal Aid Ontario', 'A community legal clinic', 'Your lawyer or representative, if you have one']} />
          <DemoNotice text="Requests are in demo mode. No message is sent until a partner agency agrees to the pilot." />
        </View>
      </ScrollView>
      <StickyFooter>
        <PillButton label="Find support" arrow onPress={() => router.push('/(tabs)/resources')} />
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  danger: { flexDirection: 'row', gap: space[3], padding: space[4], borderRadius: radius.lg, backgroundColor: color.errorSubtle },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  rowIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' },
});
