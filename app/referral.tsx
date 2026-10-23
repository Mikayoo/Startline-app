import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StickyFooter } from '@/components/layout';
import { Card, Chip, DemoNotice, IconButton, PillButton, Txt } from '@/components/ui';
import { PRIORITY_OPTIONS } from '@/content/steps';
import { municipalityLabel } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, font, palette, radius, space } from '@/theme/tokens';

type Contact = 'phone' | 'email';
type Phase = 'form' | 'review' | 'sent';

// Referral in demo mode. The flow is the one the pilot will use: the person
// fills in the minimum, sees exactly what would be shared, and gives
// consent. Nothing is transmitted until a partner agency approves a channel.
export default function Referral() {
  const insets = useSafeAreaInsets();
  const { profile } = useApp();
  const [phase, setPhase] = useState<Phase>('form');
  const [contactBy, setContactBy] = useState<Contact>('phone');
  const [contact, setContact] = useState('');
  const [firstName, setFirstName] = useState('');
  const [consent, setConsent] = useState(false);

  const topics = profile.priorities.map((p) => PRIORITY_OPTIONS.find((o) => o.id === p)?.label ?? p);
  const shared: [string, string][] = [
    ['First name', firstName || 'Not given'],
    [contactBy === 'phone' ? 'Phone' : 'Email', contact],
    ['City', municipalityLabel(profile.municipality)],
    ['Language', profile.language === 'en' ? 'English' : profile.language],
    ['Wants help with', topics.length ? topics.join(', ') : 'Not specified'],
  ];

  if (phase === 'sent') {
    return (
      <View style={[styles.root, { paddingTop: insets.top + space[8], paddingHorizontal: space[6], gap: space[4] }]}>
        <View style={styles.done}>
          <Feather name="check" size={32} color={palette.white} />
        </View>
        <Txt variant="screenHeading" accessibilityRole="header">
          Request ready (demo)
        </Txt>
        <Txt style={{ color: color.textSecondary }}>
          In the pilot, this request would go to the partner agency and a settlement worker would contact you. In this prototype, nothing was sent.
        </Txt>
        <DemoNotice text="Demo mode. No message left this phone." />
        <PillButton label="Back to home" onPress={() => router.replace('/')} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 180, gap: space[4] }}>
        <IconButton icon="x" label="Close" onPress={() => router.back()} />
        <Chip tone="warning" icon="alert-circle" label="Demo mode · nothing is sent" />
        {phase === 'form' ? (
          <>
            <Txt variant="screenHeading" accessibilityRole="header">
              How should a settlement worker reach you?
            </Txt>
            <Txt style={{ color: color.textSecondary }}>We only ask for what they need to call or write to you. No documents or case details.</Txt>
            <View style={{ flexDirection: 'row', gap: space[2] }}>
              {(['phone', 'email'] as Contact[]).map((c) => (
                <Pressable
                  key={c}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: contactBy === c }}
                  onPress={() => setContactBy(c)}
                  style={[styles.segment, contactBy === c && styles.segmentOn]}
                >
                  <Txt variant="label" style={{ color: contactBy === c ? palette.white : color.textPrimary, fontSize: 14 }}>
                    {c === 'phone' ? 'Phone' : 'Email'}
                  </Txt>
                </Pressable>
              ))}
            </View>
            <Field label={contactBy === 'phone' ? 'Phone number' : 'Email address'} value={contact} onChange={setContact} keyboard={contactBy === 'phone' ? 'phone-pad' : 'email-address'} />
            <Field label="First name (optional)" value={firstName} onChange={setFirstName} />
          </>
        ) : (
          <>
            <Txt variant="screenHeading" accessibilityRole="header">
              Check what we'll share
            </Txt>
            <Txt style={{ color: color.textSecondary }}>This is everything the agency would receive. Nothing else from your plan is shared.</Txt>
            <Card style={{ gap: space[3] }}>
              {shared.map(([k, v]) => (
                <View key={k} style={styles.row}>
                  <Txt variant="caption" style={{ color: color.textSecondary, width: 110 }}>
                    {k}
                  </Txt>
                  <Txt style={{ flex: 1, fontFamily: font.semibold }}>{v}</Txt>
                </View>
              ))}
            </Card>
            <Card style={{ gap: space[2], shadowOpacity: 0, backgroundColor: color.brandSubtle }}>
              <Txt variant="label" style={{ color: color.textBrand }}>
                Who receives it and why
              </Txt>
              <Txt variant="caption" style={{ color: color.textSecondary }}>
                The partner agency (to be confirmed), only so a settlement worker can contact you. You can withdraw your request at any time by contacting them.
              </Txt>
            </Card>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consent }}
              onPress={() => setConsent((c) => !c)}
              style={styles.consent}
            >
              <View style={[styles.box, consent && styles.boxOn]}>{consent ? <Feather name="check" size={14} color={palette.white} /> : null}</View>
              <Txt style={{ flex: 1 }}>I agree to share these details with the partner agency so they can contact me.</Txt>
            </Pressable>
          </>
        )}
        <DemoNotice text="The pilot will only send requests through a channel the partner agency and a privacy reviewer have approved." />
      </ScrollView>
      <StickyFooter>
        {phase === 'form' ? (
          <PillButton label="Review before sending" arrow disabled={contact.trim().length < 5} onPress={() => setPhase('review')} />
        ) : (
          <>
            <PillButton label="Send request" arrow disabled={!consent} onPress={() => setPhase('sent')} />
            <PillButton tone="ghost" label="Edit details" onPress={() => setPhase('form')} />
          </>
        )}
      </StickyFooter>
    </View>
  );
}

function Field({ label, value, onChange, keyboard = 'default' }: { label: string; value: string; onChange: (v: string) => void; keyboard?: 'default' | 'phone-pad' | 'email-address' }) {
  return (
    <View style={{ gap: 6 }}>
      <Txt variant="label">{label}</Txt>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
        accessibilityLabel={label}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.surfaceWarm },
  segment: { flex: 1, minHeight: 44, borderRadius: radius.pill, borderWidth: 1.5, borderColor: color.borderDefault, alignItems: 'center', justifyContent: 'center' },
  segmentOn: { backgroundColor: color.actionPrimary, borderColor: color.actionPrimary },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: color.borderDefault,
    backgroundColor: color.surface,
    paddingHorizontal: space[4],
    fontFamily: font.regular,
    fontSize: 16,
    color: color.textPrimary,
  },
  row: { flexDirection: 'row', gap: space[3], alignItems: 'baseline' },
  consent: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start', padding: space[4], borderRadius: radius.card, backgroundColor: color.surface },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: color.borderDefault, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: color.actionPrimary, borderColor: color.actionPrimary },
  done: { width: 64, height: 64, borderRadius: 32, backgroundColor: color.success, alignItems: 'center', justifyContent: 'center' },
});
