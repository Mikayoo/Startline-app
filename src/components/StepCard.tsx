import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { PlannedStep } from '@/logic/plan';
import { color, space } from '@/theme/tokens';

import { STEP_ICON } from './layout';
import { Card, Chip, IconTile, Meta, Txt } from './ui';

export function StepCard({
  item,
  index,
  done,
  place,
  highlight = false,
}: {
  item: PlannedStep;
  index: number;
  done: boolean;
  place: string;
  highlight?: boolean;
}) {
  const { step } = item;
  return (
    <Card
      selected={highlight}
      onPress={() => router.push(`/step/${step.id}`)}
      accessibilityLabel={`Step ${index + 1}: ${step.title}. ${step.categoryLabel}. About ${step.minutes} minutes.${done ? ' Done.' : ''}`}
      style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}
    >
      <IconTile icon={done ? 'check' : STEP_ICON[step.category]} tint={done ? color.successSubtle : color.brandSubtle} />
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', gap: space[2], alignItems: 'center' }}>
          {highlight && !done ? <Chip tone="solid" label="Start here" style={{ alignSelf: 'center' }} /> : <Chip tone={done ? 'neutral' : 'brand'} label={done ? 'Done' : `Step ${index + 1}`} style={{ alignSelf: 'center' }} />}
          <Txt variant="caption" style={{ color: color.textSecondary }}>
            {step.categoryLabel}
          </Txt>
        </View>
        <Txt variant="cardTitle" style={done ? { color: color.textSecondary, textDecorationLine: 'line-through' } : undefined}>
          {step.title}
        </Txt>
        <View style={{ flexDirection: 'row', gap: space[3] }}>
          <Meta icon="clock" label={`About ${step.minutes} min`} />
          <Meta icon="map-pin" label={place} />
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={color.textSecondary} />
    </Card>
  );
}
