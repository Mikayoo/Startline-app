import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountScreen, Field, NoteCard } from '@/components/account';
import { MonthPicker } from '@/components/MonthPicker';
import { Txt } from '@/components/ui';
import { MONTHS, toIsoDate } from '@/logic/dates';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

// v3.1 "A8 Date of birth". Optional.
export default function Birthday() {
  const { setDraft } = useApp();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState('');
  const thisYear = new Date().getFullYear();
  const valid = toIsoDate(day, month, year) !== null && Number(year) > thisYear - 120 && Number(year) <= thisYear;

  return (
    <AccountScreen
      icon="calendar"
      title="Date of birth"
      helper="Some programs are only for certain ages. We only use this to show what may apply to you."
      primary={{
        label: 'Continue',
        disabled: !valid,
        hint: 'Add your date of birth, or choose Prefer not to say.',
        onPress: () => {
          setDraft({ birth: { day, month: MONTHS[month ?? 0], year } });
          router.push('/account/ready?flow=create');
        },
      }}
      secondary={{ label: 'Prefer not to say', onPress: () => { setDraft({ birth: undefined }); router.push('/account/ready?flow=create'); } }}
    >
      <View style={{ flexDirection: 'row', gap: space[2] }}>
        <View style={{ flex: 1 }}>
          <Field label="Day" value={day} onChangeText={(v) => setDay(v.replace(/\D/g, '').slice(0, 2))} placeholder="DD" keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1.4 }}>
          <Field label="Year" value={year} onChangeText={(v) => setYear(v.replace(/\D/g, '').slice(0, 4))} placeholder="YYYY" keyboardType="number-pad" />
        </View>
      </View>
      <Txt variant="label" style={{ color: color.textSecondary }}>
        Month
      </Txt>
      <MonthPicker value={month} onChange={setMonth} />
      <NoteCard icon="info">Optional. Skip it if you'd rather not say.</NoteCard>
    </AccountScreen>
  );
}
