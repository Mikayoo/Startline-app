import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Citation } from '@/logic/answer';
import { color, palette, radius, shadow, space } from '@/theme/tokens';

import { IconButton, IconName, PillButton, Txt } from './ui';

export const STEP_ICON: Record<string, IconName> = {
  housing: 'home',
  legal: 'file-text',
  health: 'heart',
  money: 'dollar-sign',
  language: 'message-circle',
  school: 'book-open',
  community: 'users',
  documents: 'credit-card',
};

// One onboarding question: progress, title, options, and a fixed footer.
export function QuestionScreen({
  step,
  total,
  title,
  helper,
  children,
  footer,
  onBack,
}: {
  step: number;
  total: number;
  title: string;
  helper?: string;
  children: ReactNode;
  footer: ReactNode;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + space[2] }]}>
      <View style={styles.qTop}>
        <IconButton icon="arrow-left" label="Back" onPress={onBack ?? (() => router.back())} />
        <View style={styles.progressTrack} accessibilityLabel={`Question ${step} of ${total}`} accessibilityRole="progressbar">
          <View style={[styles.progressFill, { width: `${(step / total) * 100}%` }]} />
        </View>
        <Txt variant="label" style={{ color: color.textSecondary, width: 40, textAlign: 'right' }}>
          {step} of {total}
        </Txt>
      </View>
      <ScrollView contentContainerStyle={{ padding: space[6], paddingTop: space[4], gap: space[3], paddingBottom: 140 }}>
        <Txt variant="screenHeading" accessibilityRole="header">
          {title}
        </Txt>
        {helper ? <Txt style={{ color: color.textSecondary, marginBottom: space[2] }}>{helper}</Txt> : null}
        {children}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + space[4] }]}>{footer}</View>
    </View>
  );
}

export function PhotoHero({ children, height, colors = ['rgba(5,41,37,0.05)', 'rgba(5,41,37,0.55)', 'rgba(5,41,37,0.96)'] }: {
  children: ReactNode;
  height: number;
  colors?: [string, string, ...string[]];
}) {
  return (
    <View style={{ height, overflow: 'hidden' }}>
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

export function SourceCard({ citation }: { citation: Citation }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Open source: ${citation.title}, ${citation.publisher}`}
      onPress={() => Linking.openURL(citation.url)}
      style={({ pressed }) => [styles.source, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.sourceIcon}>
        <Feather name="link" size={16} color={color.textBrand} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Txt variant="label" style={{ color: color.textSecondary }}>
          {citation.publisher}
        </Txt>
        <Txt variant="cardTitle" style={{ fontSize: 15 }}>
          {citation.title}
        </Txt>
        <Txt variant="caption" style={{ color: citation.reviewed ? color.success : color.warning }}>
          {citation.reviewed && citation.lastChecked ? `Checked ${citation.lastChecked}` : 'Not yet reviewed'}
        </Txt>
      </View>
      <Feather name="external-link" size={16} color={color.textSecondary} />
    </Pressable>
  );
}

export function StickyFooter({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.footer, { paddingBottom: insets.bottom + space[4] }]}>{children}</View>;
}

export function FooterButton(props: Parameters<typeof PillButton>[0]) {
  return <PillButton {...props} style={[{ alignSelf: 'stretch' }, props.style]} />;
}

const TAB_ICON: Record<string, IconName> = {
  index: 'home',
  path: 'map',
  ask: 'message-square',
  help: 'life-buoy',
};

const TAB_LABEL: Record<string, string> = {
  index: 'Home',
  path: 'My Path',
  ask: 'Ask',
  help: 'Get help',
};

// The v3.1 floating pill tab bar.
export function PillTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.tabWrap, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
      <View style={styles.tabBar} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const name = route.name;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={TAB_LABEL[name]}
              onPress={() => {
                const e = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigateToTab(route.key);
              }}
              style={[styles.tab, focused && styles.tabActive]}
            >
              <Feather name={TAB_ICON[name] ?? 'circle'} size={20} color={focused ? palette.white : palette.navInactive} />
              <Txt variant="label" style={{ color: focused ? palette.white : color.textSecondary, fontSize: 11 }}>
                {TAB_LABEL[name] ?? name}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.surfaceWarm },
  qTop: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingHorizontal: space[6] },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: color.borderSubtle, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: color.actionPrimary },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space[6],
    paddingTop: space[4],
    backgroundColor: color.surfaceWarm,
    gap: space[2],
  },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[3],
    borderRadius: radius.lg,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.borderSubtle,
  },
  sourceIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: color.brandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    padding: 6,
    gap: 2,
    ...shadow.floating,
  },
  tab: {
    width: 74,
    height: 58,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabActive: { backgroundColor: palette.navActive },
});
