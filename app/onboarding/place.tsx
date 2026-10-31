import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { FooterButton, QuestionScreen, useNext } from '@/components/layout';
import { DemoNotice, Txt } from '@/components/ui';
import { PROVINCES } from '@/content/steps';
import { placeLong } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, font, palette, radius, shadow, space } from '@/theme/tokens';

// "v3.1 / OB04 Location". Startline covers all of Canada: the province
// decides which health, money and 211 sources show, and the city adds local
// agencies where the prototype has samples (Waterloo Region).
export default function Place() {
  const { profile, update } = useApp();
  const next = useNext('/onboarding/household');
  const [open, setOpen] = useState<'province' | 'city' | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const province = PROVINCES.find((p) => p.id === profile.province);

  return (
    <QuestionScreen
      step={2}
      total={4}
      title="Where are you settling?"
      helper="Your city is enough. You don't need to share an address."
      footer={<FooterButton label="Continue" arrow hint="Choose your province or territory to continue." disabled={!province} onPress={next} style={{ minHeight: 56 }} />}
    >
      <View style={styles.photo}>
        <Image source={require('../../assets/images/photo-housing.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" accessible={false} />
        <LinearGradient colors={['rgba(5,41,37,0)', 'rgba(5,41,37,0.8)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.pin}>
          <Feather name="map-pin" size={13} color={palette.white} />
          <Txt variant="label" style={{ color: palette.white }}>
            {placeLong(profile)}
          </Txt>
        </View>
        <View style={styles.photoText}>
          <Txt variant="cardTitle" style={{ color: palette.white }}>
            Programs near you
          </Txt>
          <Txt variant="caption" style={{ color: 'rgba(255,255,255,0.85)' }}>
            We'll show services in and around your city.
          </Txt>
        </View>
      </View>

      <Select
        label="Province or territory"
        value={province?.name}
        placeholder="Choose your province"
        open={open === 'province'}
        onToggle={() => setOpen(open === 'province' ? null : 'province')}
      >
        {PROVINCES.map((p) => (
          <Option
            key={p.id}
            label={p.name}
            selected={profile.province === p.id}
            onPress={() => {
              if (p.id !== profile.province) update({ province: p.id, city: null });
              setOpen('city');
            }}
          />
        ))}
      </Select>

      {province ? (
        <Select
          label="City or town"
          value={profile.city ?? (profile.province ? 'Another city or town' : undefined)}
          open={open === 'city'}
          onToggle={() => setOpen(open === 'city' ? null : 'city')}
        >
          {province.cities.map((c) => (
            <Option
              key={c}
              label={c}
              selected={profile.city === c}
              onPress={() => {
                update({ city: c });
                setOpen(null);
              }}
            />
          ))}
          <Option
            label="Another city or town"
            selected={profile.city === null}
            onPress={() => {
              update({ city: null });
              setOpen(null);
            }}
          />
        </Select>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => setNote('Location isn’t used in the prototype. Choose your province and city above.')}
        style={styles.locate}
        hitSlop={8}
      >
        <Feather name="map-pin" size={16} color={color.textBrand} />
        <Txt variant="button" style={{ color: color.textBrand, fontSize: 15 }}>
          Use my current location instead
        </Txt>
      </Pressable>
      {note ? <DemoNotice text={note} /> : null}
    </QuestionScreen>
  );
}

function Select({
  label,
  value,
  placeholder,
  open,
  onToggle,
  children,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.select}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ?? placeholder}`}
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={styles.selectHead}
      >
        <View style={{ flex: 1 }}>
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            {label}
          </Txt>
          <Txt style={[styles.selectValue, !value && { color: color.textDisabled }]}>{value ?? placeholder}</Txt>
        </View>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color={color.textSecondary} />
      </Pressable>
      {open ? (
        <ScrollView style={styles.menu} nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : null}
    </View>
  );
}

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.option, selected && { backgroundColor: color.brandSubtle }, pressed && { opacity: 0.85 }]}
    >
      <Txt variant="cardTitle" style={{ flex: 1, fontSize: 15 }}>
        {label}
      </Txt>
      {selected ? <Feather name="check" size={18} color={color.actionPrimary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  photo: { height: 148, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: palette.teal900 },
  pin: {
    position: 'absolute',
    top: space[3],
    left: space[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(5,41,37,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  photoText: { position: 'absolute', left: space[4], right: space[4], bottom: space[3], gap: 2 },
  select: { borderRadius: radius.lg, backgroundColor: color.surface, ...shadow.card },
  selectHead: { flexDirection: 'row', alignItems: 'center', paddingVertical: space[3], paddingHorizontal: space[4], minHeight: 64 },
  selectValue: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22 },
  menu: { maxHeight: 320, borderTopWidth: 1, borderTopColor: color.borderSubtle, padding: space[2] },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: space[3], paddingHorizontal: space[3], borderRadius: radius.md },
  locate: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2], paddingVertical: space[3] },
});
