import { router } from 'expo-router';
import { View } from 'react-native';

import { FooterButton, QuestionScreen } from '@/components/layout';
import { DemoNotice, OptionCard } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { space } from '@/theme/tokens';

// Arabic and the third pilot language need human-reviewed translations
// before they can be switched on, so they are listed but marked as coming.
const LANGUAGES = [
  { id: 'en', name: 'English', native: 'English', ready: true },
  { id: 'ar', name: 'Arabic', native: 'العربية', ready: false },
  { id: 'third', name: 'Third pilot language', native: 'Chosen with the partner agency', ready: false },
];

export default function Language() {
  const { profile, update } = useApp();
  return (
    <QuestionScreen
      step={1}
      total={5}
      title="Which language do you want to use?"
      helper="You can change this later in settings."
      footer={<FooterButton label="Continue" arrow onPress={() => router.push('/onboarding/place')} />}
    >
      <View style={{ gap: space[3] }}>
        {LANGUAGES.map((l) => (
          <OptionCard
            key={l.id}
            title={l.native}
            helper={l.ready ? l.name : `${l.name} · translation in review`}
            selected={profile.language === l.id}
            onPress={() => l.ready && update({ language: l.id })}
          />
        ))}
      </View>
      <DemoNotice text="Only English is switched on in the prototype. Other languages open once a translator has checked them." />
    </QuestionScreen>
  );
}
