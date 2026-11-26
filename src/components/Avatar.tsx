import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { palette } from '@/theme/tokens';

import { Txt } from './ui';

// The person's avatar: their own photo if they added one, else the first
// letter of their name, else a person icon.
export function Avatar({ photo, name, size = 44, onDark = false }: { photo?: string | null; name?: string; size?: number; onDark?: boolean }) {
  const ring = onDark ? { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' } : {};
  if (photo) {
    return <Image source={{ uri: photo }} style={[{ width: size, height: size, borderRadius: size / 2 }, ring]} contentFit="cover" accessible={false} />;
  }
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: onDark ? 'rgba(255,255,255,0.16)' : palette.teal700 },
        ring,
      ]}
    >
      {name ? (
        <Txt variant={size >= 56 ? 'screenHeading' : 'cardTitle'} style={{ color: palette.white }}>
          {name.slice(0, 1).toUpperCase()}
        </Txt>
      ) : (
        <Feather name="user" size={Math.round(size * 0.45)} color={palette.white} />
      )}
    </View>
  );
}
