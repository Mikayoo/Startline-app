import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/InfoCard';
import { Card, IconButton, Txt } from '@/components/ui';
import { color, space } from '@/theme/tokens';

// v3.1 "34 My dates". Adding dates comes with the backend; for now this
// explains how dates work so nobody treats a reminder as a deadline.
export default function Dates() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ backgroundColor: color.surfaceWarm }} contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 60, gap: space[4] }}>
      <IconButton icon="arrow-left" label="Back" onPress={() => router.back()} />
      <Txt variant="label" style={{ color: color.textBrand }}>
        YOUR NEXT DATES
      </Txt>
      <Txt variant="screenHeading" accessibilityRole="header">
        My dates
      </Txt>
      <Card style={{ gap: space[2] }}>
        <Txt variant="cardTitle">No dates added yet</Txt>
        <Txt style={{ color: color.textSecondary }}>Adding dates from letters and appointments is coming in a later version of the prototype.</Txt>
      </Card>
      <InfoCard icon="file-text" title="Official dates" sub="From a letter or notice" steps={['Find the date in the letter or notice.', 'Copy the date exactly.', 'Note where it came from.']} />
      <InfoCard icon="calendar" title="Appointments" sub="Only after the provider confirms" text="Add an appointment once the provider has confirmed the date, time and place." />
      <InfoCard icon="bell" title="How reminders work" text="Reminders are private and only for dates you choose. A reminder is not an official deadline." />
      <InfoCard icon="info" title="Missed a date?" text="Contact the organization as soon as you can. Ask what you need to do next, and write down who you spoke to." />
    </ScrollView>
  );
}
