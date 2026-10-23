import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Txt } from '@/components/ui';
import { palette, space } from '@/theme/tokens';

// v3.1 "A0 Splash": shown briefly on every launch while the app gets ready.
export function Splash() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={[palette.teal700, palette.teal900, palette.deep]} locations={[0, 0.55, 1]} style={styles.root}>
      <View style={styles.centre} accessible accessibilityLabel="Startline. Your next step in Canada">
        <Image source={require('../../assets/images/mark.svg')} style={{ width: 58, height: 58 }} contentFit="contain" />
        <Txt variant="screenHeading" style={{ color: palette.white }}>
          Startline
        </Txt>
        <Txt style={{ color: 'rgba(255,255,255,0.8)' }}>Your next step in Canada</Txt>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + space[6] }]}>
        <Feather name="lock" size={12} color="rgba(255,255,255,0.7)" />
        <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Private by default
        </Txt>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[2] },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
