import { Image } from 'expo-image';
import { View } from 'react-native';

import { Service } from '@/content/services';
import { color, radius } from '@/theme/tokens';

import { Txt } from './ui';

// The organization's own logo mark, or its initials when we don't have one.
export function ServiceLogo({ service, size = 48 }: { service: Service; size?: number }) {
  if (service.logo) {
    return (
      <Image
        source={service.logo}
        style={{ width: size, height: size, borderRadius: radius.md, borderWidth: 1, borderColor: color.borderSubtle }}
        contentFit="cover"
        accessibilityLabel={`${service.name} logo`}
      />
    );
  }
  return (
    <View style={{ minWidth: size, paddingHorizontal: 6, height: size, borderRadius: radius.md, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' }}>
      <Txt variant="label" style={{ color: color.textBrand }}>
        {service.short}
      </Txt>
    </View>
  );
}
