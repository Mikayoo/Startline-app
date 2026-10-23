import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, IconButton, IconName, PillButton, Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { palette, space } from '@/theme/tokens';

const PROMISES: { icon: IconName; text: string }[] = [
  { icon: 'list', text: 'Your next steps, in the right order' },
  { icon: 'link', text: 'A source on every answer' },
  { icon: 'users', text: 'A real person when you need one' },
];

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { markIntroSeen } = useApp();

  return (
    <View style={styles.root}>
      <Image source={require('../assets/images/welcome.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
      <LinearGradient
        colors={['rgba(5,41,37,0.10)', 'rgba(5,41,37,0.55)', 'rgba(5,41,37,0.92)', palette.deep]}
        locations={[0, 0.3, 0.55, 0.8]}
        style={StyleSheet.absoluteFill}
      />
      {router.canGoBack() ? (
        <View style={{ position: 'absolute', top: insets.top + space[2], left: space[6], zIndex: 2 }}>
          <IconButton icon="arrow-left" label="Back" onMedia onPress={() => router.back()} />
        </View>
      ) : null}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 220, paddingBottom: insets.bottom + space[6] }]}
      >
        <View style={styles.chips}>
          <Chip tone="media" icon="clock" label="About 2 minutes" />
          <Chip tone="media" icon="lock" label="No account needed" />
        </View>
        <Txt variant="display" style={styles.title} accessibilityRole="header">
          Start with what matters to you
        </Txt>
        <Txt variant="bodyLarge" style={styles.lead}>
          Answer 4 short questions. We'll build a plan around what matters to you.
        </Txt>
        <View style={{ gap: space[3], marginTop: space[2] }}>
          {PROMISES.map((p) => (
            <View key={p.text} style={styles.promise}>
              <View style={styles.promiseIcon}>
                <Feather name={p.icon} size={16} color={palette.white} />
              </View>
              <Txt variant="bodyLarge" style={{ color: palette.white }}>
                {p.text}
              </Txt>
            </View>
          ))}
        </View>
        <Txt variant="caption" style={styles.small}>
          Startline isn't part of the government and never shares your answers with IRCC.
        </Txt>
        <PillButton tone="inverse" label="Build my plan" arrow onPress={() => {
            markIntroSeen();
            router.push('/onboarding/status');
          }}
        />
        <PillButton
          tone="ghostInverse"
          label="Browse support first"
          onPress={() => {
            markIntroSeen();
            router.replace('/');
          }}
        />
        <Txt variant="caption" style={styles.demo}>
          Prototype · sample content for Kitchener-Waterloo
        </Txt>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.deep },
  content: { paddingHorizontal: space[6], gap: space[3], flexGrow: 1, justifyContent: 'flex-end', maxWidth: 520, width: '100%', alignSelf: 'center' },
  chips: { flexDirection: 'row', gap: space[2], flexWrap: 'wrap' },
  title: { color: palette.white, marginTop: space[1] },
  lead: { color: 'rgba(255,255,255,0.85)' },
  promise: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  promiseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: { color: 'rgba(255,255,255,0.7)', marginTop: space[2], marginBottom: space[2] },
  demo: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: space[1] },
});
