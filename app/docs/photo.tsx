import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { AccountScreen, NoteCard } from '@/components/account';
import { Card, Txt } from '@/components/ui';
import { color, space } from '@/theme/tokens';

const CHECKS = ["It hasn't expired", 'All four corners are in the frame', 'Text and photo are clear and well lit'];

// v3.1 "55 Document photo (optional)". Explain first; camera or photo access
// is only asked for after the person taps one of the buttons.
export default function DocumentPhoto() {
  return (
    <AccountScreen
      icon="file-text"
      title="Get your document ready"
      helper="Optional. A photo can help Startline point out names and dates for you. Check these first."
      primary={{ label: 'Take a photo', onPress: () => router.push('/docs/scan') }}
      secondary={{ label: 'Choose from your photos', onPress: () => router.push('/docs/preview') }}
    >
      <Card style={{ gap: space[3] }}>
        {CHECKS.map((c) => (
          <View key={c} style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
            <Feather name="check-circle" size={18} color={color.textBrand} />
            <Txt>{c}</Txt>
          </View>
        ))}
      </Card>
      <NoteCard icon="lock">Used only on this phone. The photo is deleted when you finish or cancel. It’s never uploaded or saved to your account.</NoteCard>
    </AccountScreen>
  );
}
