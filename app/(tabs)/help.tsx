import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/InfoCard';
import { Card, DemoNotice, IconTile, PillButton, Txt } from '@/components/ui';
import { color, palette, space } from '@/theme/tokens';

export default function Help() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: 120, gap: space[4] }}>
      <Txt variant="screenHeading" accessibilityRole="header">
        Talk to a person
      </Txt>
      <Txt style={{ color: color.textSecondary }}>A settlement worker can help with your own situation. It's free.</Txt>

      <Card style={{ backgroundColor: color.warningSubtle, flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
        <Feather name="alert-triangle" size={22} color={color.warning} />
        <View style={{ flex: 1 }}>
          <Txt variant="cardTitle">In danger right now?</Txt>
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            Call 911. Startline is not an emergency service.
          </Txt>
        </View>
        <PillButton tone="primary" label="Call 911" style={{ minHeight: 40, paddingHorizontal: space[4] }} onPress={() => Linking.openURL('tel:911')} />
      </Card>

      <Card style={{ gap: space[3] }}>
        <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
          <IconTile icon="user-check" />
          <View style={{ flex: 1 }}>
            <Txt variant="cardTitle">Ask a settlement worker to contact you</Txt>
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              Partner agency to be confirmed
            </Txt>
          </View>
        </View>
        <Txt style={{ color: color.textSecondary }}>
          You'll see exactly what we would send before anything happens. Nothing is shared unless you say yes.
        </Txt>
        <PillButton label="Start a request" arrow onPress={() => router.push('/referral')} />
      </Card>

      <Card style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
        <IconTile icon="phone" />
        <View style={{ flex: 1 }}>
          <Txt variant="cardTitle">Call 2-1-1</Txt>
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            Free helpline for community, social and health services in Ontario
          </Txt>
        </View>
        <Feather name="chevron-right" size={20} color={color.textSecondary} onPress={() => Linking.openURL('tel:211')} />
      </Card>
      <Txt variant="label" style={{ color: color.textSecondary, marginTop: space[2] }}>
        IF IT CAN'T WAIT
      </Txt>
      <InfoCard
        icon="phone-call"
        title="Urgent lines"
        sub="Free, any time. Tap to call"
        pointIcon="phone"
        points={['Emergency: call 911', 'Mental health crisis: call or text 988', 'Community and social services: call 211']}
        onPointPress={(i) => Linking.openURL(['tel:911', 'tel:988', 'tel:211'][i])}
      />
      <InfoCard icon="home" title="Need a place to stay tonight?" text="Call 211 and ask about emergency shelter in Waterloo Region." />
      <Txt variant="label" style={{ color: color.textSecondary, marginTop: space[2] }}>
        WHAT TO SAY WHEN YOU CALL
      </Txt>
      <InfoCard
        icon="message-square"
        title="A simple way to start"
        text={'"Hello, I\'m a refugee claimant in Kitchener. I have a question about my situation. Can you help, or tell me who can?"'}
      />
      <InfoCard
        icon="briefcase"
        title="Free legal help"
        sub="If you qualify"
        pointIcon="arrow-right"
        points={['Legal Aid Ontario', 'A community legal clinic', 'Your lawyer or representative, if you have one']}
      />
      <InfoCard
        icon="info"
        title="Why Startline can't answer legal questions"
        text="Decisions depend on your whole case. Only someone who knows your case, like a lawyer or representative, should advise you."
      />
      <DemoNotice text="Requests are in demo mode. No message is sent until a partner agency agrees to the pilot." />
      <Txt variant="caption" style={{ color: palette.slate, textAlign: 'center' }}>
        Prototype · no data leaves this phone
      </Txt>
    </ScrollView>
  );
}
