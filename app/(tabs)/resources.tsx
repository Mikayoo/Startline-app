import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { PhotoHeader, sheetStyle } from '@/components/PhotoHeader';
import { Card, Chip, DemoNotice, SectionHeader, Txt } from '@/components/ui';
import { PHOTO } from '@/content/photos';
import { Service, SERVICE_TOPICS, SERVICES } from '@/content/services';
import { municipalityLabel } from '@/logic/plan';
import { useApp } from '@/state/AppState';
import { color, font, palette, radius, shadow, space } from '@/theme/tokens';

// v3.1 "12 Resources".
export default function Resources() {
  const { profile } = useApp();
  const [topic, setTopic] = useState<(typeof SERVICE_TOPICS)[number]['id']>('all');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter((s) => (topic === 'all' || s.topics.includes(topic as Service['topics'][number])) && (!q || `${s.name} ${s.subtitle} ${s.summary}`.toLowerCase().includes(q)));
  }, [topic, query]);
  const featured = list[0];

  return (
    <ScrollView style={{ backgroundColor: color.surfaceWarm }} contentContainerStyle={{ paddingBottom: 130 }} keyboardShouldPersistTaps="handled">
      <PhotoHeader photo={PHOTO.street} height={300} back={false}>
        <Chip tone="media" icon="map-pin" label={`Resources · ${municipalityLabel(profile.municipality)}`} />
        <Txt variant="display" style={{ color: palette.white, fontSize: 30, lineHeight: 36 }} accessibilityRole="header">
          Find support for your next step
        </Txt>
      </PhotoHeader>
      <View style={[sheetStyle, { backgroundColor: color.surfaceWarm }]}>
        <View style={styles.search}>
          <Feather name="search" size={18} color={color.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search services and topics"
            placeholderTextColor={color.textSecondary}
            accessibilityLabel="Search services and topics"
            style={styles.input}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[2] }}>
          {SERVICE_TOPICS.map((t) => (
            <Pressable
              key={t.id}
              accessibilityRole="button"
              accessibilityState={{ selected: topic === t.id }}
              onPress={() => setTopic(t.id)}
              style={[styles.topic, topic === t.id && styles.topicOn]}
            >
              <Txt variant="label" style={{ color: topic === t.id ? palette.white : color.textPrimary, fontSize: 14 }}>
                {t.label}
              </Txt>
            </Pressable>
          ))}
        </ScrollView>

        {featured ? (
          <>
            <SectionHeader title="A place to start" />
            <Pressable accessibilityRole="button" onPress={() => router.push(`/service/${featured.id}`)} style={styles.featured}>
              <Image source={featured.photo} style={styles.featuredPhoto} contentFit="cover" accessible={false} />
              <View style={{ padding: space[4], gap: space[2] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Txt variant="title">{featured.name}</Txt>
                  <Chip icon="check" label="Sample" />
                </View>
                <Txt style={{ color: color.textSecondary }}>{featured.summary}</Txt>
                <Txt variant="caption" style={{ color: color.textSecondary }}>
                  {featured.tags.join(' · ')}
                </Txt>
              </View>
            </Pressable>
          </>
        ) : null}

        {list.length > 1 ? <SectionHeader title="More services" /> : null}
        {list.slice(1).map((s) => (
          <Card key={s.id} onPress={() => router.push(`/service/${s.id}`)} accessibilityLabel={`${s.name}. ${s.subtitle}`} style={{ gap: space[2] }}>
            <View style={{ flexDirection: 'row', gap: space[3], alignItems: 'center' }}>
              <View style={styles.badge}>
                <Txt variant="label" style={{ color: color.textBrand }}>
                  {s.short}
                </Txt>
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="cardTitle">{s.name}</Txt>
                <Txt variant="caption" style={{ color: color.textSecondary }}>
                  {s.subtitle}
                </Txt>
              </View>
              <Feather name="chevron-right" size={20} color={color.textSecondary} />
            </View>
            <Txt style={{ color: color.textSecondary }}>{s.summary}</Txt>
            <View style={{ flexDirection: 'row', gap: space[2], flexWrap: 'wrap' }}>
              {s.tags.map((t) => (
                <Chip key={t} tone={t === 'Check eligibility' ? 'warning' : 'brand'} label={t} />
              ))}
            </View>
          </Card>
        ))}
        {list.length === 0 ? (
          <Card style={{ gap: space[2] }}>
            <Txt variant="cardTitle">No exact matches yet</Txt>
            <Txt style={{ color: color.textSecondary }}>Try a broader word, or ask Startline in your own words.</Txt>
            <Txt variant="button" style={{ color: color.textBrand }} onPress={() => router.push('/(tabs)/ask')}>
              Ask Startline
            </Txt>
          </Card>
        ) : null}
        <DemoNotice text="Sample services. Details have not been checked with each organization yet." />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: space[3], backgroundColor: color.surface, borderRadius: radius.pill, paddingHorizontal: space[4], minHeight: 52, ...shadow.card },
  input: { flex: 1, fontFamily: font.regular, fontSize: 15, color: color.textPrimary, paddingVertical: space[3] },
  topic: { paddingHorizontal: space[4], paddingVertical: space[2], borderRadius: radius.pill, backgroundColor: color.surface },
  topicOn: { backgroundColor: color.actionPrimary },
  featured: { backgroundColor: color.surface, borderRadius: radius.card, overflow: 'hidden', ...shadow.card },
  featuredPhoto: { width: '100%', height: 170 },
  badge: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: color.brandSubtle, alignItems: 'center', justifyContent: 'center' },
});
