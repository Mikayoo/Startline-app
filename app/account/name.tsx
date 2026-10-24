import { router } from 'expo-router';
import { useState } from 'react';

import { AccountScreen, Field } from '@/components/account';
import { Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color } from '@/theme/tokens';

// v3.1 "A7 Preferred name".
export default function PreferredName() {
  const { draft, setDraft } = useApp();
  const [name, setName] = useState(draft.name ?? '');
  return (
    <AccountScreen
      icon="user"
      title="What should we call you?"
      helper="Optional. Use the name you'd like to see in the app."
      primary={{ label: 'Continue', onPress: () => { setDraft({ name }); router.push('/account/birthday'); } }}
      secondary={{ label: 'Skip', onPress: () => { setDraft({ name: undefined }); router.push('/account/birthday'); } }}
    >
      <Field label="Preferred name" value={name} onChangeText={setName} placeholder="Your name" autoComplete="name" autoFocus />
      <Txt variant="caption" style={{ color: color.textSecondary }}>
        This doesn't need to match your documents.
      </Txt>
    </AccountScreen>
  );
}
