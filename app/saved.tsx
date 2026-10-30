import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, DemoNotice, IconButton, PillButton, Txt } from '@/components/ui';
import { SERVICES } from '@/content/services';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

// v3.1 "50 Saved contacts".
export default function Saved() {
  const insets = useSafeAreaInsets();
  const { savedServices, saved } = useApp();
  const list = SERVICES.filter((s) => savedServices.has(s.id));
  return (
    <ScrollView style={{ backgroundColor: color.surfaceWarm }} contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 60, gap: space[4] }}>
      <IconButton icon="arrow-left" label="Back" onPress={() => router.back()} />
      <Txt variant="label" style={{ color: color.textBrand }}>
        SAVED TO MY PATH
      </Txt>
      <Txt variant="screenHeading" accessibilityRole="header">
        Your saved support
      </Txt>
      <Txt style={{ color: color.textSecondary }}>Saving a contact doesn't book an appointment or contact the service.</Txt>
      {list.map((s) => (
        <Card key={s.id} onPress={() => router.push(`/service/${s.id}`)} style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
          <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' }}>
            <Txt variant="label" style={{ color: color.textBrand }}>
              {s.short}
            </Txt>
          </View>
          <View style={{ flex: 1 }}>
            <Txt variant="cardTitle">{s.name}</Txt>
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              {s.subtitle} · Not contacted yet
            </Txt>
          </View>
          <Feather name="chevron-right" size={20} color={color.textSecondary} />
        </Card>
      ))}
      {list.length === 0 ? (
        <Card style={{ gap: space[3] }}>
          <Txt variant="cardTitle">Nothing saved yet</Txt>
          <Txt style={{ color: color.textSecondary }}>Save services from Resources to keep their details in one place.</Txt>
          <PillButton label="Browse resources" arrow onPress={() => router.replace('/(tabs)/resources')} />
        </Card>
      ) : null}
      {list.length && !saved ? <DemoNotice text="Saved contacts are kept while the app is open. Save your plan to keep them on this phone." /> : null}
    </ScrollView>
  );
}
