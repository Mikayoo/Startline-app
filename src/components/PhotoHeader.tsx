import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, radius, space } from '@/theme/tokens';

import { IconButton, IconName } from './ui';

// v3.1 photo hero: full-bleed photo, dark gradient for legible text, back
// button, optional action on the right, and a sheet that overlaps the photo.
export function PhotoHeader({
  photo,
  height = 340,
  children,
  back = true,
  action,
}: {
  photo: number;
  height?: number;
  children: ReactNode;
  back?: boolean;
  action?: { icon: IconName; label: string; onPress: () => void };
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ height: height + insets.top }}>
      <Image source={photo} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
      <LinearGradient
        colors={['rgba(5,41,37,0.45)', 'rgba(5,41,37,0.05)', 'rgba(5,41,37,0.6)', 'rgba(5,41,37,0.92)']}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.top, { paddingTop: insets.top + space[2] }]}>
        {back ? <IconButton icon="arrow-left" label="Back" onMedia onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} /> : <View />}
        {action ? <IconButton icon={action.icon} label={action.label} onMedia onPress={action.onPress} /> : null}
      </View>
      <View style={styles.text}>{children}</View>
    </View>
  );
}

export const sheetStyle = {
  marginTop: -28,
  borderTopLeftRadius: radius.sheet,
  borderTopRightRadius: radius.sheet,
  paddingHorizontal: space[6],
  paddingTop: space[6],
  gap: space[4],
} as const;

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space[5] },
  text: { position: 'absolute', left: space[6], right: space[6], bottom: 48, gap: space[2] },
});

export const heroText = { color: palette.white } as const;
