import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountScreen, Field, NoteCard } from '@/components/account';
import { useApp } from '@/state/AppState';
import { space } from '@/theme/tokens';

// v3.1 "A8 Date of birth". Optional.
export default function Birthday() {
  const { setDraft } = useApp();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const complete = day && month && year.length === 4;
  return (
    <AccountScreen
      icon="calendar"
      title="Date of birth"
      helper="Some programs are only for certain ages. We only use this to show what may apply to you."
      primary={{ label: 'Continue', disabled: !complete, onPress: () => { setDraft({ birth: { day, month, year } }); router.push('/account/ready?flow=create'); } }}
      secondary={{ label: 'Prefer not to say', onPress: () => { setDraft({ birth: undefined }); router.push('/account/ready?flow=create'); } }}
    >
      <View style={{ gap: space[2] }}>
        <Field label="Day" value={day} onChangeText={(v) => setDay(v.replace(/\D/g, '').slice(0, 2))} placeholder="14" keyboardType="number-pad" />
        <Field label="Month" value={month} onChangeText={setMonth} placeholder="March" />
        <Field label="Year" value={year} onChangeText={(v) => setYear(v.replace(/\D/g, '').slice(0, 4))} placeholder="1998" keyboardType="number-pad" />
      </View>
      <NoteCard icon="info">Optional. Skip it if you'd rather not say.</NoteCard>
    </AccountScreen>
  );
}
