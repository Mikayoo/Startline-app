import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, IconButton, Txt } from '@/components/ui';
import { palette, radius, space } from '@/theme/tokens';

// v3.1 "A14 Scan document". Prototype: the camera isn't connected yet, so
// the shutter goes straight to the saved state.
export default function Scan() {
  const { doc = 'claimant' } = useLocalSearchParams<{ doc?: string }>();
  const insets = useSafeAreaInsets();
  const capture = () => router.replace(`/account/document-saved?doc=${doc}`);
  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top + space[2], paddingHorizontal: space[5] }}>
        <IconButton icon="arrow-left" label="Back" onMedia onPress={() => router.back()} />
      </View>
      <View style={styles.centre}>
        <Chip tone="media" label="Good light, no glare" style={{ alignSelf: 'center' }} />
        <Txt variant="title" style={{ color: palette.white, textAlign: 'center' }}>
          Line up the front of your document
        </Txt>
        <View style={styles.guide} accessibilityLabel="Document frame" />
        <Txt style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
          Keep all four corners inside the frame. We'll take the photo when it's clear.
        </Txt>
        <Txt variant="caption" style={{ color: palette.amber500, textAlign: 'center' }}>
          Prototype: the camera isn't connected yet.
        </Txt>
      </View>
      <View style={[styles.bar, { paddingBottom: insets.bottom + space[4] }]}>
        <View style={styles.row}>
          <Pressable accessibilityRole="button" onPress={capture} style={{ width: 80 }}>
            <Txt variant="label" style={{ color: palette.white }}>
              Upload
            </Txt>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Take photo" onPress={capture} style={styles.shutter}>
            <View style={styles.shutterInner} />
          </Pressable>
          <Txt variant="label" style={{ color: palette.white, width: 80, textAlign: 'right' }}>
            Flash off
          </Txt>
        </View>
        <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
          Your photo stays on this phone
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B1614' },
  centre: { flex: 1, justifyContent: 'center', paddingHorizontal: space[6], gap: space[4] },
  guide: { height: 214, borderRadius: radius.card, borderWidth: 3, borderStyle: 'dashed', borderColor: palette.white, backgroundColor: 'rgba(255,255,255,0.06)' },
  bar: { backgroundColor: 'rgba(0,0,0,0.35)', paddingTop: space[6], paddingHorizontal: space[6], gap: space[4] },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: palette.white, alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: palette.white },
});
