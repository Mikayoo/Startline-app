import { Feather } from '@expo/vector-icons';
import { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextProps, TextStyle, View, ViewStyle } from 'react-native';

import { color, control, palette, radius, shadow, space, type } from '@/theme/tokens';

export type IconName = ComponentProps<typeof Feather>['name'];

type Variant = keyof typeof type;

export function Txt({ variant = 'body', style, ...rest }: TextProps & { variant?: Variant }) {
  return <Text {...rest} style={[{ color: color.textPrimary }, type[variant], style]} />;
}

// Pill button: the v3.1 "Pill button" component. `inverse` is the white
// button used on photo heroes.
export function PillButton({
  label,
  onPress,
  tone = 'primary',
  arrow = false,
  disabled = false,
  style,
  accessibilityHint,
}: {
  label: string;
  onPress?: () => void;
  tone?: 'primary' | 'secondary' | 'inverse' | 'ghost' | 'ghostInverse';
  arrow?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}) {
  const bg = {
    primary: color.actionPrimary,
    secondary: color.actionSecondary,
    inverse: palette.white,
    ghost: 'transparent',
    ghostInverse: 'transparent',
  }[tone];
  const fg = tone === 'primary' || tone === 'ghostInverse' ? palette.white : tone === 'ghost' ? color.textBrand : palette.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        tone === 'ghost' && { borderWidth: 1, borderColor: color.borderBrand },
        tone === 'ghostInverse' && { borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)' },
        style,
      ]}
    >
      <Txt variant="button" style={{ color: fg }}>
        {label}
      </Txt>
      {arrow ? <Feather name="arrow-right" size={18} color={fg} /> : null}
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  onMedia = false,
}: {
  icon: IconName;
  onPress?: () => void;
  label: string;
  onMedia?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconButton,
        onMedia
          ? { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)', borderWidth: 1 }
          : { backgroundColor: palette.white, ...shadow.card },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Feather name={icon} size={20} color={onMedia ? palette.white : palette.ink} />
    </Pressable>
  );
}

export function Chip({
  label,
  icon,
  tone = 'brand',
  style,
}: {
  label: string;
  icon?: IconName;
  tone?: 'brand' | 'media' | 'warning' | 'neutral' | 'solid';
  style?: StyleProp<ViewStyle>;
}) {
  const t = {
    brand: { bg: color.brandSubtle, fg: color.textBrand, border: 'transparent' },
    media: { bg: 'rgba(255,255,255,0.16)', fg: palette.white, border: 'rgba(255,255,255,0.35)' },
    warning: { bg: color.warningSubtle, fg: color.warning, border: 'transparent' },
    neutral: { bg: color.surfaceSubtle, fg: color.textSecondary, border: 'transparent' },
    solid: { bg: color.actionPrimary, fg: palette.white, border: 'transparent' },
  }[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg, borderColor: t.border }, style]}>
      {icon ? <Feather name={icon} size={12} color={t.fg} /> : null}
      <Txt variant="label" style={{ color: t.fg }}>
        {label}
      </Txt>
    </View>
  );
}

export function Card({ children, style, onPress, accessibilityLabel, selected }: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  selected?: boolean;
}) {
  const body = [styles.card, selected && styles.cardSelected, style];
  if (!onPress) return <View style={body}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [body, pressed && { opacity: 0.9 }]}
    >
      {children}
    </Pressable>
  );
}

// Option card: one answer in an onboarding question.
export function OptionCard({
  title,
  helper,
  icon,
  selected,
  onPress,
  multi = false,
}: {
  title: string;
  helper?: string;
  icon?: IconName;
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={multi ? { checked: selected } : { selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && { opacity: 0.9 }]}
    >
      {icon ? (
        <View style={[styles.optionIcon, selected && { backgroundColor: palette.white }]}>
          <Feather name={icon} size={20} color={color.textBrand} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Txt variant="cardTitle">{title}</Txt>
        {helper ? (
          <Txt variant="caption" style={{ color: color.textSecondary, marginTop: 2 }}>
            {helper}
          </Txt>
        ) : null}
      </View>
      <View style={[multi ? styles.check : styles.radio, selected && styles.markOn]}>
        {selected ? multi ? <Feather name="check" size={14} color={palette.white} /> : <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

export function IconTile({ icon, size = 56, tint = color.brandSubtle }: { icon: IconName; size?: number; tint?: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: radius.lg, backgroundColor: tint, alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={icon} size={size * 0.42} color={color.textBrand} />
    </View>
  );
}

export function Meta({ icon, label, style }: { icon: IconName; label: string; style?: StyleProp<TextStyle> }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Feather name={icon} size={13} color={color.textSecondary} />
      <Txt variant="caption" style={[{ color: color.textSecondary }, style]}>
        {label}
      </Txt>
    </View>
  );
}

// Visible on every screen that shows sample content, so nobody mistakes the
// prototype for checked information.
export function DemoNotice({ text = 'Prototype with sample content. Sources are not yet reviewed by a caseworker.' }: { text?: string }) {
  // Neutral on purpose: amber is kept for real cautions like "call 911".
  return (
    <View style={styles.demo} accessibilityRole="text">
      <Feather name="info" size={14} color={color.textSecondary} />
      <Txt variant="caption" style={{ color: color.textSecondary, flex: 1 }}>
        {text}
      </Txt>
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Txt variant="title">{title}</Txt>
      {action ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <Txt variant="label" style={{ color: color.textBrand, fontSize: 13 }}>
            {action}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: control.lg,
    borderRadius: radius.pill,
    paddingHorizontal: space[6],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
  },
  iconButton: {
    width: control.md,
    height: control.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: space[4],
    ...shadow.card,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: color.actionPrimary,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: space[4],
    borderRadius: radius.card,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow.card,
  },
  optionSelected: {
    borderColor: color.actionPrimary,
    backgroundColor: color.brandSubtle,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: color.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: color.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.white },
  markOn: {
    backgroundColor: color.actionPrimary,
    borderColor: color.actionPrimary,
  },
  demo: {
    flexDirection: 'row',
    gap: space[2],
    alignItems: 'flex-start',
    backgroundColor: color.surfaceSubtle,
    borderRadius: radius.md,
    padding: space[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: space[3],
  },
});
