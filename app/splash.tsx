import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { font, palette, space } from '@/theme/tokens';

// A short story before the brand, told from a refugee family's first days:
// landing with one bag, a hotel room full of forms, finding help, settling
// in. First launch plays every scene; returning people see only the last one. Tap anywhere or "Skip" to go straight in.
const SCENES = [
  { image: require('../assets/images/splash-arrival.jpg'), kicker: 'Day one', line: 'You land with one bag\nand a long list.' },
  { image: require('../assets/images/splash-forms.jpg'), kicker: 'Week one', line: 'A hotel room. A stack of forms.\nWhere do you start?' },
  { image: require('../assets/images/splash-help.jpg'), kicker: 'With Startline', line: 'One next step,\nwith a source you can check.' },
  { image: require('../assets/images/splash-settled.jpg'), kicker: 'Month one', line: 'A real person\nwhen you need one.' },
];
const SCENE_MS = 1700;
const BRAND_MS = 1600;

export default function Splash() {
  const insets = useSafeAreaInsets();
  const { introSeen, markSplashSeen } = useApp();
  const scenes = introSeen ? [] : SCENES;
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  // wait for the first photo so the story never opens on an empty frame
  const [started, setStarted] = useState(introSeen);
  const fade = useRef(new Animated.Value(0)).current;
  const zoom = useRef(new Animated.Value(0)).current;
  const brand = useRef(new Animated.Value(0)).current;
  const left = useRef(false);

  const go = () => {
    if (left.current) return;
    left.current = true;
    markSplashSeen();
    router.replace(introSeen ? '/' : '/intro');
  };

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (index < scenes.length) {
      fade.setValue(0);
      zoom.setValue(0);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(zoom, { toValue: 1, duration: SCENE_MS + 450, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
      const t = setTimeout(() => setIndex((i) => i + 1), SCENE_MS);
      return () => clearTimeout(t);
    }
    Animated.timing(brand, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    const t = setTimeout(go, BRAND_MS);
    return () => clearTimeout(t);
    // go and the animated values are stable for the life of the splash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, started]);

  const scene = scenes[index];
  const showBrand = index >= scenes.length;
  const scale = reduceMotion ? 1 : zoom.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1.02] });
  const rise = fade.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <Pressable
      style={styles.root}
      onPress={go}
      accessibilityRole="button"
      accessibilityLabel="Startline. Your next step in Canada. Tap to continue."
    >
      {/* every photo is mounted from the start, so each scene crossfades over
          the last instead of flashing the background */}
      {SCENES.map((sc, i) => {
        const last = i === SCENES.length - 1;
        const current = i === index;
        const below = i < index || (showBrand && last);
        if (!scenes.length && !last) return null;
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: below ? 1 : current ? fade : 0,
                transform: [{ scale: current && !showBrand ? scale : 1.02 }],
              },
            ]}
          >
            <Image source={sc.image} style={StyleSheet.absoluteFill} contentFit="cover" onLoad={i === 0 ? () => setStarted(true) : undefined} accessible={false} />
          </Animated.View>
        );
      })}
      <LinearGradient
        colors={['rgba(5,41,37,0.55)', 'rgba(5,41,37,0.1)', 'rgba(5,41,37,0.65)', 'rgba(5,41,37,0.96)']}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      {showBrand ? <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,41,37,0.55)', opacity: brand }]} /> : null}

      {scenes.length ? (
        <View style={[styles.top, { top: insets.top + space[3] }]}>
          <View style={styles.bars} accessible={false}>
            {scenes.map((_, i) => (
              <View key={i} style={[styles.bar, i <= index && styles.barOn]} />
            ))}
          </View>
          {!showBrand ? (
            <Pressable onPress={go} hitSlop={12} accessibilityRole="button" accessibilityLabel="Skip intro">
              <Txt variant="label" style={styles.skip}>
                Skip
              </Txt>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {scene ? (
        <Animated.View style={[styles.caption, { bottom: insets.bottom + 72, opacity: fade, transform: [{ translateY: rise }] }]}>
          <Txt variant="label" style={styles.kicker}>
            {scene.kicker.toUpperCase()}
          </Txt>
          <Txt style={styles.line}>{scene.line}</Txt>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.brand, { opacity: brand, transform: [{ scale: brand.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }] }]}>
          <Image source={require('../assets/images/pathmark-white.png')} style={styles.mark} contentFit="contain" accessible={false} />
          <Txt style={styles.name}>Startline</Txt>
          <Txt variant="bodyLarge" style={styles.tagline}>
            Your next step in Canada
          </Txt>
        </Animated.View>
      )}

      <View style={[styles.footer, { bottom: insets.bottom + 32 }]}>
        <Feather name="lock" size={13} color="rgba(255,255,255,0.75)" />
        <Txt variant="caption" style={styles.private}>
          Private by default · Not a government app
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.deep, overflow: 'hidden' },
  top: { position: 'absolute', left: space[5], right: space[5], flexDirection: 'row', alignItems: 'center', gap: space[4] },
  bars: { flex: 1, flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  barOn: { backgroundColor: palette.white },
  skip: { color: palette.white, fontSize: 13 },
  caption: { position: 'absolute', left: space[6], right: space[6], gap: space[2], maxWidth: 520 },
  kicker: { color: palette.teal200, letterSpacing: 1.2 },
  line: { fontFamily: font.bold, fontSize: 32, lineHeight: 38, letterSpacing: -0.5, color: palette.white },
  brand: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: space[3] },
  mark: { width: 64, height: 64 },
  name: { fontFamily: font.bold, fontSize: 34, lineHeight: 40, letterSpacing: -0.6, color: palette.white },
  tagline: { color: 'rgba(255,255,255,0.85)', marginTop: -space[2] },
  footer: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6 },
  private: { color: 'rgba(255,255,255,0.75)' },
});
