import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, ScrollViewInstance, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SourceCard } from '@/components/layout';
import { Card, Chip, DemoNotice, PillButton, Txt } from '@/components/ui';
import { appliesHere, SOURCES } from '@/content/sources';
import { STEPS } from '@/content/steps';
import { useApp } from '@/state/AppState';
import { ask, AnswerResult } from '@/logic/answer';
import { color, font, palette, radius, space } from '@/theme/tokens';

interface Turn {
  id: number;
  question: string;
  result: AnswerResult;
}

const SUGGESTED = ['How do I get a health card?', 'Where can I find a shelter tonight?', 'How do I apply for a SIN?', 'Where are free English classes?'];

export default function Ask() {
  const { profile } = useApp();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const scroll = useRef<ScrollViewInstance>(null);

  const send = (q: string) => {
    const question = q.trim();
    if (!question) return;
    setTurns((t) => [...t, { id: Date.now(), question, result: ask(question, SOURCES.filter((s) => appliesHere(s, profile.province, profile.city))) }]);
    setText('');
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scroll} contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 220, gap: space[4] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
          <View style={styles.avatar}>
            <Feather name="zap" size={20} color={palette.white} />
          </View>
          <View>
            <Txt variant="screenHeading" accessibilityRole="header">
              Ask Startline
            </Txt>
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              Navigation assistant
            </Txt>
          </View>
        </View>
        {turns.length === 0 ? (
          <LinearGradient colors={[palette.teal800, palette.deep]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.intro}>
            <Chip tone="media" icon="check" label="Sources shown on every answer" />
            <Txt variant="screenHeading" style={{ color: palette.white }}>
              What can I help you understand?
            </Txt>
            <Txt style={{ color: 'rgba(255,255,255,0.8)' }}>Ask in your own words. Every answer shows where it came from. If Startline isn't sure, it will say so.</Txt>
          </LinearGradient>
        ) : null}
        {turns.length === 0 ? (
          <View style={{ gap: space[2] }}>
            <Txt variant="label" style={{ color: color.textSecondary }}>
              Try asking
            </Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
              {SUGGESTED.map((s) => (
                <Pressable key={s} accessibilityRole="button" onPress={() => send(s)} style={styles.suggestion}>
                  <Txt variant="caption" style={{ color: color.textBrand, fontFamily: font.semibold }}>
                    {s}
                  </Txt>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
        {turns.map((t) => (
          <View key={t.id} style={{ gap: space[3] }}>
            <View style={styles.question}>
              <Txt style={{ color: palette.white }}>{t.question}</Txt>
            </View>
            <AnswerView result={t.result} onAsk={send} asked={turns.map((x) => x.question)} />
          </View>
        ))}
        <DemoNotice text="Demo mode: answers are taken word for word from draft source summaries. No AI is used yet." />
      </ScrollView>
      <View style={[styles.composer, { bottom: Math.max(insets.bottom, space[3]) + 76 }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => send(text)}
          placeholder="Type your question"
          placeholderTextColor={color.textSecondary}
          accessibilityLabel="Your question"
          returnKeyType="send"
          style={styles.input}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Send question" onPress={() => send(text)} style={styles.send}>
          <Feather name="arrow-up" size={20} color={palette.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// The plan step that uses the same official source as the answer, if any.
function stepFor(result: AnswerResult) {
  if (result.kind !== 'answer') return undefined;
  const ids = new Set(result.citations.map((c) => c.sourceId));
  return Object.values(STEPS).find((s) => s.sourceIds.some((id) => ids.has(id)));
}

function AnswerView({ result, onAsk, asked }: { result: AnswerResult; onAsk: (q: string) => void; asked: string[] }) {
  if (result.kind === 'answer') {
    const step = stepFor(result);
    const followUps = SUGGESTED.filter((q) => !asked.includes(q)).slice(0, 3);
    return (
      <Card style={{ gap: space[3] }}>
        <Chip tone="brand" icon="link" label={`From ${result.citations.length} source${result.citations.length > 1 ? 's' : ''}`} />
        <Txt variant="bodyLarge">{result.text}</Txt>
        {result.citations.map((c) => (
          <SourceCard key={c.sourceId} citation={c} />
        ))}
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          This is general information. A settlement worker can help with your situation.
        </Txt>
        {step ? (
          <Pressable accessibilityRole="button" onPress={() => router.push(`/step/${step.id}`)} style={styles.nextStep}>
            <Feather name="map" size={18} color={color.textBrand} />
            <View style={{ flex: 1 }}>
              <Txt variant="cardTitle">Turn this into a next step</Txt>
              <Txt variant="caption" style={{ color: color.textSecondary }}>
                {step.title}
              </Txt>
            </View>
            <Feather name="arrow-right" size={18} color={color.textBrand} />
          </Pressable>
        ) : null}
        {followUps.length ? (
          <View style={{ gap: space[2] }}>
            <Txt variant="label" style={{ color: color.textSecondary }}>
              ASK A FOLLOW-UP
            </Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
              {followUps.map((q) => (
                <Pressable key={q} accessibilityRole="button" onPress={() => onAsk(q)} style={styles.suggestion}>
                  <Txt variant="caption" style={{ color: color.textBrand, fontFamily: font.semibold }}>
                    {q}
                  </Txt>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </Card>
    );
  }
  const tone = result.kind === 'urgent' ? 'warning' : 'brand';
  return (
    <Card style={{ gap: space[3], backgroundColor: result.kind === 'urgent' ? color.warningSubtle : color.surface }}>
      <Chip
        tone={tone}
        icon={result.kind === 'urgent' ? 'alert-triangle' : result.kind === 'personal' ? 'user' : 'help-circle'}
        label={result.kind === 'urgent' ? 'Get help now' : result.kind === 'personal' ? 'A person should look at this' : "Startline can't verify this"}
      />
      <Txt variant="bodyLarge">{result.text}</Txt>
      {result.kind === 'urgent' ? (
        <View style={{ gap: space[2] }}>
          <PillButton label="Call 911" onPress={() => Linking.openURL('tel:911')} />
          <PillButton tone="secondary" label="Call 211 for shelter and support" onPress={() => Linking.openURL('tel:211')} />
          <PillButton tone="ghost" label="See Help today" onPress={() => router.push('/help')} />
        </View>
      ) : (
        <PillButton tone="secondary" label="Talk to a person" arrow onPress={() => router.push('/help')} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  nextStep: { flexDirection: 'row', alignItems: 'center', gap: space[3], padding: space[3], borderRadius: radius.lg, backgroundColor: color.brandSubtle },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: palette.teal700, alignItems: 'center', justifyContent: 'center' },
  intro: { borderRadius: radius.xl, padding: space[5], gap: space[3] },
  suggestion: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: color.brandSubtle },
  question: { alignSelf: 'flex-end', maxWidth: '85%', backgroundColor: color.actionPrimary, borderRadius: radius.card, borderBottomRightRadius: 6, padding: space[3] },
  composer: {
    position: 'absolute',
    left: space[4],
    right: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    padding: 6,
    paddingLeft: space[4],
    borderWidth: 1,
    borderColor: color.borderSubtle,
  },
  input: { flex: 1, fontFamily: font.regular, fontSize: 16, color: color.textPrimary, minHeight: 44 },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: color.actionPrimary, alignItems: 'center', justifyContent: 'center' },
});
