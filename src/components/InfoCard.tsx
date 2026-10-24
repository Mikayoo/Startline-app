import { Feather } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { color, space } from '@/theme/tokens';

import { Card, IconName, IconTile, Txt } from './ui';

// The long "Card" from the v3.1 screens: icon tile, title, optional
// subtitle, then points, numbered steps or a paragraph.
export function InfoCard({
  icon,
  title,
  sub,
  points,
  steps,
  text,
  pointIcon = 'check',
  onPointPress,
}: {
  icon: IconName;
  title: string;
  sub?: string;
  points?: string[];
  steps?: string[];
  text?: string;
  pointIcon?: IconName;
  onPointPress?: (index: number) => void;
}) {
  return (
    <Card style={{ gap: space[3] }}>
      <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
        <IconTile icon={icon} size={44} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="cardTitle">{title}</Txt>
          {sub ? (
            <Txt variant="caption" style={{ color: color.textSecondary }}>
              {sub}
            </Txt>
          ) : null}
        </View>
      </View>
      {points?.map((p, i) => {
        const row = (
          <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'flex-start' }}>
            <Feather name={pointIcon} size={16} color={color.textBrand} style={{ marginTop: 2 }} />
            <Txt style={{ flex: 1, color: onPointPress ? color.textBrand : color.textPrimary }}>{p}</Txt>
          </View>
        );
        return onPointPress ? (
          <Pressable key={p} accessibilityRole="button" onPress={() => onPointPress(i)} hitSlop={4}>
            {row}
          </Pressable>
        ) : (
          <View key={p}>{row}</View>
        );
      })}
      {steps?.map((s, i) => (
        <View key={s} style={{ flexDirection: 'row', gap: space[3], alignItems: 'flex-start' }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' }}>
            <Txt variant="label" style={{ color: color.textBrand }}>
              {i + 1}
            </Txt>
          </View>
          <Txt style={{ flex: 1 }}>{s}</Txt>
        </View>
      ))}
      {text ? <Txt style={{ color: color.textSecondary }}>{text}</Txt> : null}
    </Card>
  );
}

