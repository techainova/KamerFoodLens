import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const DISHES = [
  { name: 'Ndolé', region: 'Littoral', match: 96, time: '45 min' },
  { name: 'Poulet DG', region: 'Centre', match: 92, time: '60 min' },
  { name: 'Mbongo Tchobi', region: 'Sud', match: 88, time: '90 min' },
  { name: 'Eru', region: 'Sud-Ouest', match: 84, time: '40 min' },
  { name: 'Koki', region: 'Ouest', match: 80, time: '50 min' },
  { name: 'Sanga', region: 'Adamaoua', match: 76, time: '35 min' },
];

export default function Search() {
    const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation();
  const [query, setQuery] = useState('ndolé');
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const TABS = [
    t('scanner.title'),
    t('recipe.title'),
    t('map.title'),
    t('events.title'),
  ];

  const FILTERS = [
    { label: t('search.region'), hasChev: true },
    { label: t('search.category'), hasChev: true },
    { label: t('search.vegetarian') },
    { label: t('search.spicy') },
    { label: t('search.under30') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>

      {/* Search bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity
          style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => nav.goBack()}
        >
          <Icon name="ArrowLeft" size={17} color="#6D4C41" />
        </TouchableOpacity>

        <View style={{ flex: 1, height: 44, backgroundColor: C.surface, borderWidth: 1, borderColor: '#E8591A', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
          <Icon name="Search" size={16} color="#8C8278" />
          <TextInput
            style={{ flex: 1, fontSize: 13, color: C.ink, fontFamily: 'Inter-Regular' }}
            value={query}
            onChangeText={setQuery}
            placeholder={t('home.search')}
            placeholderTextColor="#8C8278"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 2 }}>
              <Icon name="X" size={14} color="#8C8278" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Mic" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveTab(i)}
            style={{ flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}
          >
            <Text style={{ fontSize: 12, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? '#E8591A' : '#8C8278', fontFamily: i === activeTab ? 'Inter-Bold' : 'Inter-Regular' }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filter chips */}
      <View style={{ borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 }}>
          {FILTERS.map((f, i) => {
            const active = activeFilter === i;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveFilter(active ? null : i)}
                style={{
                  height: 32, paddingHorizontal: 14, borderRadius: 16,
                  borderWidth: 1, borderColor: active ? '#E8591A' : '#E5E0D8',
                  backgroundColor: active ? '#FBF3DC' : '#fff',
                  alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: active ? '700' : '500', color: active ? '#E8591A' : '#6D4C41', fontFamily: active ? 'Inter-Bold' : 'Inter-Regular' }}>
                  {f.label}
                </Text>
                {f.hasChev && <Icon name="ChevronDown" size={12} color={active ? '#E8591A' : '#8C8278'} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Result count */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Text style={{ fontSize: 13, color: C.ink, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>24</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>{t('search.results')}</Text>
          {query.length > 0 && (
            <Text style={{ fontSize: 12, color: C.inkMute }}>pour « {query} »</Text>
          )}
        </View>

        {/* 2-column grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {DISHES.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={{ width: '47.5%' }}
              activeOpacity={0.8}
            >
              {/* Image slot */}
              <View style={{ height: 126, backgroundColor: C.surface2, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Icon name="ChefHat" size={34} color="#E5E0D8" />
                {/* Match % badge */}
                <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#2E7D32', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{d.match}%</Text>
                </View>
                {/* Favorite */}
                <TouchableOpacity style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Heart" size={14} color="#E5E0D8" />
                </TouchableOpacity>
              </View>

              {/* Info */}
              <View style={{ paddingTop: 8 }}>
                <Text style={{ color: C.ink, fontSize: 13, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>{d.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Icon name="MapPin" size={10} color="#8C8278" />
                  <Text style={{ color: C.inkMute, fontSize: 11 }}>{d.region}</Text>
                  <Text style={{ color: '#E5E0D8' }}>·</Text>
                  <Icon name="Clock" size={10} color="#8C8278" />
                  <Text style={{ color: C.inkMute, fontSize: 11 }}>{d.time}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: C.successSoft }}>
                    <Text style={{ color: '#2E7D32', fontSize: 10, fontWeight: '700' }}>{t('search.match')}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
