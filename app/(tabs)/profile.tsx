import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card, Chip, IconName, Txt } from '@/components/ui';
import { HOUSEHOLD_OPTIONS } from '@/content/steps';
import { placeLabel, placeLong } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, palette, radius, space } from '@/theme/tokens';

const STATUS_SHORT: Record<string, string> = {
  claimant: 'Refugee claimant',
  protected: 'Protected person',
  resettled: 'Resettled refugee',
  other: 'Another status',
  unsure: 'Not shared',
};

const TEXT_SIZE_HELP =
  Platform.OS === 'ios'
    ? 'Startline follows your iPhone text size. Open Settings, then Display & Brightness, then Text Size.'
    : 'Startline follows your phone text size. Open Settings, then Display, then Font size.';

function Row({ icon, label, value, onPress, action = 'chevron' }: { icon: IconName; label: string; value: string; onPress: () => void; action?: 'chevron' | 'change' }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}: ${value}`} onPress={onPress} style={styles.row}>
      <View style={styles.rowIcon}>
        <Feather name={icon} size={18} color={color.textBrand} />
      </View>
      <View style={{ flex: 1 }}>
        {action === 'change' ? (
          <>
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              {label}
            </Txt>
            <Txt variant="cardTitle">{value}</Txt>
          </>
        ) : (
          <>
            <Txt variant="cardTitle">{label}</Txt>
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              {value}
            </Txt>
          </>
        )}
      </View>
      {action === 'change' ? (
        <View style={styles.change}>
          <Txt variant="label" style={{ color: color.textBrand }}>
            Change
          </Txt>
        </View>
      ) : (
        <Feather name="chevron-right" size={20} color={color.textSecondary} />
      )}
    </Pressable>
  );
}

// v3.1 "17 Profile".
export default function Profile() {
  const insets = useSafeAreaInsets();
  const { profile, account, savedServices, photo, setPhoto } = useApp();

  // Optional. The photo stays on this phone and is only shown to the person.
  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  };
  const status = profile.status ? STATUS_SHORT[profile.status] : undefined;
  const household =
    profile.household === null ? null : profile.household.length === 0 ? 'Just me' : profile.household.map((m) => HOUSEHOLD_OPTIONS.find((h) => h.id === m)?.label).join(', ');
  const place = placeLabel(profile);
  const placeFull = placeLong(profile);

  return (
    <ScrollView style={{ backgroundColor: color.surfaceWarm }} contentContainerStyle={{ paddingBottom: 130 }}>
      <LinearGradient colors={[palette.teal700, palette.teal900, palette.deep]} style={{ paddingTop: insets.top + space[8], paddingHorizontal: space[6], paddingBottom: 56, gap: space[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space[3] }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={photo ? 'Change your profile photo' : 'Add a profile photo'}
            onPress={choosePhoto}
            style={{ width: 72, height: 72 }}
          >
            <Avatar photo={photo} name={account?.name} size={72} onDark />
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={14} color={color.textBrand} />
            </View>
          </Pressable>
          {photo ? (
            <Pressable accessibilityRole="button" onPress={() => setPhoto(null)} hitSlop={8} style={{ paddingBottom: space[1] }}>
              <Txt variant="label" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Remove photo
              </Txt>
            </Pressable>
          ) : null}
        </View>
        <Txt variant="display" style={{ color: palette.white }} accessibilityRole="header">
          {account?.name ?? 'Your profile'}
        </Txt>
        <View style={{ flexDirection: 'row', gap: space[2], flexWrap: 'wrap' }}>
          {status && profile.status !== 'unsure' ? <Chip tone="media" icon="file-text" label={status} /> : null}
          <Chip tone="media" icon="map-pin" label={place} />
        </View>
      </LinearGradient>
      <View style={styles.sheet}>
        <View style={{ gap: 2 }}>
          <Txt variant="title">Your details</Txt>
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            Keep these up to date for better next steps.
          </Txt>
        </View>
        <Card style={{ paddingVertical: space[1] }}>
          <Row icon="file-text" label="Immigration status" value={status ?? 'Not shared'} action="change" onPress={() => router.push('/onboarding/status?from=review')} />
          <Row icon="map-pin" label="Location" value={placeFull} action="change" onPress={() => router.push('/onboarding/place?from=review')} />
          <Row icon="users" label="Household" value={household ?? 'Not shared'} action="change" onPress={() => router.push('/onboarding/household?from=review')} />
          <Row icon="star" label="Priorities" value={profile.priorities.length ? `${profile.priorities.length} chosen` : 'None chosen'} action="change" onPress={() => router.push('/onboarding/priorities?from=review')} />
        </Card>
        <View style={{ gap: 2 }}>
          <Txt variant="title">App settings</Txt>
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            Language, privacy and your saved support.
          </Txt>
        </View>
        <Card style={{ paddingVertical: space[1] }}>
          <Row icon="globe" label="Language & accessibility" value="English · Follows your text size" onPress={() => Alert.alert('Text size', TEXT_SIZE_HELP)} />
          <Row icon="lock" label="Privacy and account" value={account ? 'Account on this phone' : 'No account'} onPress={() => router.push('/privacy')} />
          <Row icon="bookmark" label="Saved support" value={`${savedServices.size} saved`} onPress={() => router.push('/saved')} />
          <Row icon="calendar" label="My dates" value="Reminders you choose" onPress={() => router.push('/dates')} />
          <Row icon="life-buoy" label="Help today" value="Talk to a person" onPress={() => router.push('/help')} />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cameraBadge: { position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: 14, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' },
  sheet: { marginTop: -28, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, backgroundColor: color.surfaceWarm, padding: space[6], gap: space[4] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3], paddingVertical: space[3] },
  rowIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' },
  change: { paddingHorizontal: space[3], paddingVertical: 6, borderRadius: radius.pill, backgroundColor: color.brandSubtle },
});
