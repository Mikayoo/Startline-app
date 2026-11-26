import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AccountScreen, NoteCard } from '@/components/account';
import { Txt } from '@/components/ui';
import { color, radius, space } from '@/theme/tokens';

// v3.1 "57 Check your photo". Nothing has been read or saved yet; discard
// drops the photo and returns to the document list.
export default function Preview() {
  return (
    <AccountScreen
      title="Check your photo"
      helper="Make sure it’s clear before Startline reads it. Nothing has been saved."
      primary={{ label: 'Use this photo', onPress: () => router.replace('/docs/details') }}
      secondary={{ label: 'Retake', onPress: () => router.replace('/docs/scan') }}
    >
      <View style={styles.frame} accessibilityLabel="Photo preview">
        <View style={styles.doc}>
          <View style={styles.face} />
          <View style={{ flex: 1, gap: 8 }}>
            {[1, 0.75, 0.9, 0.6].map((w, i) => (
              <View key={i} style={[styles.bar, { width: `${w * 100}%` }]} />
            ))}
          </View>
        </View>
        <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
          Preview. Details are hidden in this prototype
        </Txt>
      </View>
      <NoteCard icon="lock">Still only on this phone. Discard it anytime. It’s deleted when you finish, and never uploaded or saved to your account.</NoteCard>
      <Txt
        variant="button"
        accessibilityRole="button"
        onPress={() => router.dismissTo('/docs')}
        style={{ alignSelf: 'center', paddingVertical: space[2], color: color.textBrand }}
      >
        Discard photo
      </Txt>
    </AccountScreen>
  );
}

const styles = StyleSheet.create({
  frame: { height: 220, borderRadius: radius.lg, backgroundColor: '#333D3B', alignItems: 'center', justifyContent: 'center', gap: space[3], padding: space[4] },
  doc: { width: 250, height: 150, borderRadius: 10, backgroundColor: '#D4C29E', padding: 18, flexDirection: 'row', gap: 14, transform: [{ rotate: '-3deg' }], opacity: 0.9 },
  face: { width: 56, height: 72, borderRadius: 6, backgroundColor: 'rgba(90,76,61,0.35)' },
  bar: { height: 8, borderRadius: 3, backgroundColor: 'rgba(90,76,61,0.4)' },
});
