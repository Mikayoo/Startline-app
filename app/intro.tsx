import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PillButton, Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color, palette, radius, shadow, space } from '@/theme/tokens';

// v3.1 "01 Welcome & language". Only English is switched on in the
// prototype. The others need human-reviewed translations first, so they are
// shown but can't be picked yet.
const LANGUAGES = [
  { id: 'en', native: 'English', helper: 'Full app', ready: true },
  { id: 'fr', native: 'Français', helper: 'Coming soon', ready: false },
  { id: 'ar', native: 'العربية', helper: 'Coming soon', ready: false },
  { id: 'es', native: 'Español', helper: 'Coming soon', ready: false },
];

const TEXT_SIZE_HELP =
  Platform.OS === 'ios'
    ? 'Startline follows your iPhone text size.\n\nOpen Settings, then Display & Brightness, then Text Size, and drag the slider. For even larger text, go to Settings, Accessibility, Display & Text Size, Larger Text.'
    : 'Startline follows your phone text size.\n\nOpen Settings, then Display (or Accessibility), then Font size, and drag the slider.';

export default function Intro() {
  const insets = useSafeAreaInsets();
  const { profile, update } = useApp();

  return (
    <View style={styles.root}>
      <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.hero}>
          <Image source={require('../assets/images/language.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
          <LinearGradient
            colors={['rgba(5,41,37,0.35)', 'rgba(5,41,37,0)', 'rgba(5,41,37,0.55)', 'rgba(5,41,37,0.9)']}
            locations={[0, 0.25, 0.6, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.lockup, { top: insets.top + space[3] }]}>
            <Image source={require('../assets/images/mark.svg')} style={{ width: 24, height: 24 }} contentFit="contain" />
            <Txt variant="cardTitle" style={{ color: palette.white }}>
              Startline
            </Txt>
          </View>
          <View style={styles.heroText}>
            <Txt variant="label" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Welcome · Bienvenue · أهلاً بك · Bienvenido · Вітаємо
            </Txt>
            <Txt variant="display" style={{ color: palette.white }} accessibilityRole="header">
              Choose your language
            </Txt>
            <Txt style={{ color: 'rgba(255,255,255,0.85)' }}>You can change it anytime in settings.</Txt>
          </View>
        </View>

        <View style={[styles.sheet, { paddingBottom: insets.bottom + space[4] }]}>
          <View style={styles.grid}>
            {LANGUAGES.map((l) => {
              const selected = profile.language === l.id;
              return (
                <Pressable
                  key={l.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected, disabled: !l.ready }}
                  accessibilityLabel={`${l.native}. ${l.helper}`}
                  disabled={!l.ready}
                  onPress={() => update({ language: l.id })}
                  style={[styles.lang, selected && styles.langSelected, !l.ready && { opacity: 0.6 }]}
                >
                  <View style={{ flex: 1 }}>
                    <Txt variant="cardTitle">{l.native}</Txt>
                    <Txt variant="caption" style={{ color: color.textSecondary, marginTop: 2 }}>
                      {l.helper}
                    </Txt>
                  </View>
                  <View style={[styles.radio, selected && styles.radioOn]}>
                    {selected ? <Feather name="check" size={13} color={palette.white} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.more, { opacity: 0.6 }]} accessible accessibilityLabel="More languages coming later: Ukrainian, Somali, Tigrinya, Dari">
            <View style={styles.globe}>
              <Feather name="globe" size={18} color={color.textBrand} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt variant="cardTitle">More languages soon</Txt>
              <Txt variant="caption" style={{ color: color.textSecondary }}>
                Українська · Soomaali · Tigrinya · دری
              </Txt>
            </View>
          </View>

          <PillButton label="Continue in English" arrow onPress={() => router.push('/welcome')} />
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => Alert.alert('Text size', TEXT_SIZE_HELP)}
            style={{ alignSelf: 'center', paddingVertical: space[2] }}
          >
            <Txt variant="button" style={{ color: color.textBrand }}>
              Text size & accessibility
            </Txt>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.surfaceWarm },
  hero: { height: 440, backgroundColor: palette.deep },
  lockup: { position: 'absolute', left: space[6], flexDirection: 'row', alignItems: 'center', gap: space[2] },
  heroText: { position: 'absolute', left: space[6], right: space[6], bottom: 44, gap: space[2] },
  sheet: {
    flexGrow: 1,
    marginTop: -28,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    backgroundColor: color.surfaceWarm,
    padding: space[6],
    gap: space[3],
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  lang: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    padding: space[4],
    borderRadius: radius.card,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.card,
  },
  langSelected: { borderColor: color.actionPrimary, backgroundColor: color.brandSubtle },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: color.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: color.actionPrimary, borderColor: color.actionPrimary },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[4],
    borderRadius: radius.card,
    backgroundColor: color.surface,
    ...shadow.card,
  },
  globe: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: color.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
