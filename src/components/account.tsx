import { Feather } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { ReactNode, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, TextInputInstance, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, control, font, palette, radius, shadow, space } from '@/theme/tokens';

import { FooterButton, StickyFooter } from './layout';
import { IconButton, IconName, PillButton, Txt } from './ui';

export const PASSCODE_LENGTH = 6;

export function hashPasscode(code: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `startline:${code}`);
}

export { maskContact } from '@/logic/account';

// v3.1 account screen: back button, icon tile, title, helper and a fixed
// footer with one primary and one ghost action.
export function AccountScreen({
  icon,
  title,
  helper,
  children,
  primary,
  secondary,
  back = true,
  topRight,
  hero,
}: {
  hero?: ReactNode;
  icon?: IconName;
  title: string;
  helper?: string;
  children?: ReactNode;
  primary?: { label: string; onPress: () => void; disabled?: boolean; hint?: string };
  secondary?: { label: string; onPress: () => void };
  back?: boolean;
  topRight?: { label: string; onPress: () => void };
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: color.surfaceWarm }}>
      <View style={[styles.top, { paddingTop: insets.top + space[2] }]}>
        {back ? <IconButton icon="arrow-left" label="Back" onPress={() => router.back()} /> : <View style={{ height: control.md }} />}
        {topRight ? (
          <Pressable accessibilityRole="button" onPress={topRight.onPress} hitSlop={8} style={styles.topRight}>
            <Txt variant="button" style={{ color: color.textBrand }}>
              {topRight.label}
            </Txt>
          </Pressable>
        ) : null}
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: space[6], paddingTop: space[4], gap: space[4], paddingBottom: 200 }}>
        {hero}
        {icon ? (
          <View style={styles.icon}>
            <Feather name={icon} size={26} color={color.textBrand} />
          </View>
        ) : null}
        <View style={{ gap: space[2] }}>
          <Txt variant="screenHeading" accessibilityRole="header">
            {title}
          </Txt>
          {helper ? <Txt style={{ color: color.textSecondary }}>{helper}</Txt> : null}
        </View>
        {children}
      </ScrollView>
      {primary || secondary ? (
        <StickyFooter>
          {primary ? <FooterButton label={primary.label} arrow disabled={primary.disabled} hint={primary.hint} onPress={primary.onPress} /> : null}
          {secondary ? (
            <Pressable accessibilityRole="button" onPress={secondary.onPress} hitSlop={8} style={{ alignSelf: 'center', paddingVertical: space[3] }}>
              <Txt variant="button" style={{ color: color.textBrand }}>
                {secondary.label}
              </Txt>
            </Pressable>
          ) : null}
        </StickyFooter>
      ) : null}
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoFocus,
  prefix,
  autoComplete,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'number-pad';
  autoFocus?: boolean;
  prefix?: string;
  autoComplete?: 'tel' | 'email' | 'name' | 'off';
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ flexDirection: 'row', gap: space[2] }}>
      {prefix ? (
        <View style={[styles.field, { width: 96, justifyContent: 'center' }]}>
          <Txt variant="cardTitle">{prefix}</Txt>
        </View>
      ) : null}
      <View style={[styles.field, focused && styles.fieldActive, { flex: 1 }]}>
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          {label}
        </Txt>
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.textDisabled}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
      </View>
    </View>
  );
}

// Six boxes over one hidden input, so paste and autofill still work.
export function CodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<TextInputInstance>(null);
  return (
    <Pressable onPress={() => ref.current?.focus()} accessibilityLabel={`Code, ${value.length} of 6 digits entered`}>
      <View style={{ flexDirection: 'row', gap: space[2] }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.digit, i === value.length && styles.fieldActive]}>
            <Txt variant="screenHeading">{value[i] ?? ''}</Txt>
          </View>
        ))}
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus
        maxLength={6}
        style={styles.hidden}
      />
    </Pressable>
  );
}

export function PasscodeDots({ count }: { count: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: space[4] }} accessibilityLabel={`${count} of ${PASSCODE_LENGTH} digits entered`}>
      {Array.from({ length: PASSCODE_LENGTH }).map((_, i) => (
        <View key={i} style={[styles.dot, i < count && styles.dotOn]} />
      ))}
    </View>
  );
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export function Keypad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.keypad}>
      {KEYS.map((k, i) =>
        k === '' ? (
          <View key={i} style={styles.keySpace} />
        ) : (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={k === 'del' ? 'Delete' : k}
            onPress={() => onChange(k === 'del' ? value.slice(0, -1) : (value + k).slice(0, PASSCODE_LENGTH))}
            style={({ pressed }) => [k === 'del' ? styles.keySpace : styles.key, pressed && { opacity: 0.6 }]}
          >
            {k === 'del' ? (
              <Txt variant="label" style={{ color: color.textSecondary }}>
                Delete
              </Txt>
            ) : (
              <Txt variant="screenHeading">{k}</Txt>
            )}
          </Pressable>
        ),
      )}
    </View>
  );
}

export function NoteCard({ icon = 'info', children, tone = 'brand' }: { icon?: IconName; children: ReactNode; tone?: 'brand' | 'success' | 'warning' }) {
  const bg = { brand: color.brandSubtle, success: color.successSubtle, warning: color.warningSubtle }[tone];
  const fg = { brand: color.textBrand, success: color.success, warning: color.warning }[tone];
  return (
    <View style={[styles.note, { backgroundColor: bg }]}>
      <Feather name={icon} size={16} color={fg} style={{ marginTop: 2 }} />
      <Txt style={{ flex: 1, color: color.textPrimary }}>{children}</Txt>
    </View>
  );
}

export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8}>
      <Txt variant="button" style={{ color: color.textBrand }}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function SuccessBadge() {
  return (
    <View style={styles.success}>
      <Feather name="check" size={40} color={palette.white} />
    </View>
  );
}

export { PillButton };

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space[5] },
  topRight: { paddingHorizontal: space[3], paddingVertical: space[2], borderRadius: radius.pill, backgroundColor: palette.white },
  icon: { width: 64, height: 64, borderRadius: radius.lg, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' },
  field: { minHeight: 64, borderRadius: radius.lg, backgroundColor: color.surface, paddingHorizontal: space[4], paddingVertical: space[2], borderWidth: 1.5, borderColor: 'transparent', ...shadow.card },
  fieldActive: { borderColor: color.actionPrimary },
  input: { fontFamily: font.semibold, fontSize: 16, color: color.textPrimary, paddingVertical: 2 },
  digit: { flex: 1, height: 60, borderRadius: radius.md, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'transparent', ...shadow.card },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: color.borderDefault },
  dotOn: { backgroundColor: color.actionPrimary, borderColor: color.actionPrimary },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', rowGap: space[3], columnGap: space[6], marginTop: space[6], alignSelf: 'center', width: 300 },
  key: { width: 76, height: 64, borderRadius: 32, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  keySpace: { width: 76, height: 64, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: space[3], padding: space[4], borderRadius: radius.lg },
  success: { width: 96, height: 96, borderRadius: 48, backgroundColor: color.actionPrimary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', ...shadow.floating },
});
