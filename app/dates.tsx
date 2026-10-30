import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Field } from '@/components/account';
import { InfoCard } from '@/components/InfoCard';
import { MonthPicker } from '@/components/MonthPicker';
import { Card, IconButton, PillButton, Txt } from '@/components/ui';
import { formatDate, toIsoDate, whenLabel } from '@/logic/dates';
import { DateItem, useApp } from '@/state/AppState';
import { color, palette, radius, space } from '@/theme/tokens';

const KINDS: { id: DateItem['kind']; label: string }[] = [
  { id: 'official', label: 'From a letter' },
  { id: 'appointment', label: 'Appointment' },
  { id: 'personal', label: 'Personal reminder' },
];

// v3.1 "34 My dates".
export default function Dates() {
  const insets = useSafeAreaInsets();
  const { dates, addDate, removeDate, saved } = useApp();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [kind, setKind] = useState<DateItem['kind']>('personal');
  const iso = toIsoDate(day, month, year);
  const valid = title.trim().length > 1 && iso !== null;

  const reset = () => { setAdding(false); setTitle(''); setDay(''); setMonth(null); setKind('personal'); };

  return (
    <ScrollView style={{ backgroundColor: color.surfaceWarm }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 60, gap: space[4] }}>
      <IconButton icon="arrow-left" label="Back" onPress={() => router.back()} />
      <Txt variant="label" style={{ color: color.textBrand }}>
        YOUR NEXT DATES
      </Txt>
      <Txt variant="screenHeading" accessibilityRole="header">
        My dates
      </Txt>

      {dates.map((d) => (
        <Card key={d.id} style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
          <View style={styles.dateBadge}>
            <Feather name={d.kind === 'official' ? 'file-text' : d.kind === 'appointment' ? 'calendar' : 'bell'} size={18} color={color.textBrand} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt variant="cardTitle">{d.title}</Txt>
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              {formatDate(d.date)} · {whenLabel(d.date)} · {KINDS.find((k) => k.id === d.kind)?.label}
            </Txt>
          </View>
          <IconButton icon="trash-2" label={`Remove ${d.title}`} onPress={() => removeDate(d.id)} />
        </Card>
      ))}

      {adding ? (
        <Card style={{ gap: space[3] }}>
          <Txt variant="cardTitle">Add a date</Txt>
          <Field label="What is it?" value={title} onChangeText={setTitle} placeholder="For example, IRB hearing" autoFocus />
          <View style={{ flexDirection: 'row', gap: space[2] }}>
            <View style={{ flex: 1 }}>
              <Field label="Day" value={day} onChangeText={(v) => setDay(v.replace(/\D/g, '').slice(0, 2))} placeholder="DD" keyboardType="number-pad" />
            </View>
            <View style={{ flex: 1.4 }}>
              <Field label="Year" value={year} onChangeText={(v) => setYear(v.replace(/\D/g, '').slice(0, 4))} placeholder="YYYY" keyboardType="number-pad" />
            </View>
          </View>
          <MonthPicker value={month} onChange={setMonth} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
            {KINDS.map((k) => (
              <Pressable key={k.id} accessibilityRole="radio" accessibilityState={{ selected: kind === k.id }} onPress={() => setKind(k.id)} style={[styles.kind, kind === k.id && styles.kindOn]}>
                <Txt variant="label" style={{ fontSize: 14, color: kind === k.id ? palette.white : color.textPrimary }}>
                  {k.label}
                </Txt>
              </Pressable>
            ))}
          </View>
          {kind === 'official' ? (
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              Copy the date exactly as it appears in the letter. Keep the original.
            </Txt>
          ) : null}
          <PillButton label="Save date" disabled={!valid} onPress={() => { if (iso) { addDate({ title: title.trim(), date: iso, kind }); reset(); } }} />
          {!valid && title ? (
            <Txt variant="caption" style={{ color: color.textSecondary, textAlign: 'center' }}>
              Add a day, a month and a year that exist.
            </Txt>
          ) : null}
          <PillButton tone="ghost" label="Cancel" onPress={reset} />
        </Card>
      ) : (
        <PillButton label={dates.length ? 'Add another date' : 'Add a date'} arrow onPress={() => setAdding(true)} />
      )}

      {dates.length && !saved ? (
        <Txt variant="caption" style={{ color: color.textSecondary }}>
          Dates are kept while the app is open. Save your plan to keep them on this phone.
        </Txt>
      ) : null}
      <InfoCard icon="file-text" title="Official dates" sub="From a letter or notice" steps={['Find the date in the letter or notice.', 'Copy the date exactly.', 'Keep the original letter.']} />
      <InfoCard icon="bell" title="How reminders work" text="Your dates are private. A reminder you set is not an official deadline." />
      <InfoCard icon="info" title="Missed a date?" text="Contact the organization as soon as you can. Ask what you need to do next, and write down who you spoke to." />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateBadge: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' },
  kind: { paddingHorizontal: space[3], paddingVertical: space[2], borderRadius: radius.pill, backgroundColor: color.surface, borderWidth: 1, borderColor: color.borderSubtle },
  kindOn: { backgroundColor: color.actionPrimary, borderColor: color.actionPrimary },
});
