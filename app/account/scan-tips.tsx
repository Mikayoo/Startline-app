import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { AccountScreen, NoteCard } from '@/components/account';
import { Card, Txt } from '@/components/ui';
import { color, space } from '@/theme/tokens';

const CHECKS = ["It hasn't expired", 'All four corners are in the frame', 'Text and photo are clear and well lit'];

// v3.1 "A11 Before scanning".
export default function ScanTips() {
  const { doc = 'claimant' } = useLocalSearchParams<{ doc?: string }>();
  return (
    <AccountScreen
      icon="file-text"
      title="Get your document ready"
      helper="Check these before you take a photo."
      primary={{ label: 'Open camera', onPress: () => router.push(`/account/scan?doc=${doc}`) }}
      secondary={{ label: 'Upload a photo instead', onPress: () => router.push(`/account/document-saved?doc=${doc}`) }}
    >
      <Card style={{ gap: space[3] }}>
        {CHECKS.map((c) => (
          <View key={c} style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
            <Feather name="check-circle" size={18} color={color.textBrand} />
            <Txt>{c}</Txt>
          </View>
        ))}
      </Card>
      <NoteCard icon="lock">Your photo stays on this phone unless you choose to share it.</NoteCard>
    </AccountScreen>
  );
}
