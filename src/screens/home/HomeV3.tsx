import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/types';
import KFLLogo from '@/components/ui/KFLLogo';
import Icon from '@/components/ui/Icon';

const EXPLORE_ITEMS = [
  { titleKey: 'home.exploreItem1', descKey: 'home.exploreItem1Desc', kind: 'Recettes' },
  { titleKey: 'home.exploreItem2', descKey: 'home.exploreItem2Desc', kind: 'Lieux' },
  { titleKey: 'home.exploreItem3', descKey: 'home.exploreItem3Desc', kind: 'Histoire' },
];

const KIND_COLORS: Record<string, { bg: string; text: string }> = {
  Recettes: { bg: '#FBDCDC', text: '#C62828' },
  Lieux: { bg: '#E3F0E4', text: '#2E7D32' },
  Histoire: { bg: '#E8EAF6', text: '#1A237E' },
};

export default function HomeV3() {
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      {/* Top bar */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <KFLLogo size={30} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* Layout switcher 6c → 6a */}
          <TouchableOpacity
            style={{ width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#E8591A', backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => nav.dispatch(StackActions.replace('HomeScreen'))}
          >
            <Icon name="Grid" size={16} color="#E8591A" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => nav.navigate('Search')}
          >
            <Icon name="Search" size={17} color="#6D4C41" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => nav.navigate('Notifications')}
          >
            <Icon name="Bell" size={17} color="#6D4C41" />
            <View style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#C62828', borderWidth: 1.5, borderColor: '#fff' }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Editorial hero */}
        <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
          <Text style={{ fontFamily: 'JetBrainsMono-Regular', fontSize: 10, color: '#8C8278', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {t('home.dishOfTheDay')}
          </Text>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 32, color: '#2C1810', marginTop: 6, marginBottom: 14, lineHeight: 38 }}>
            Le Mbongo,{'\n'}trésor du Sud
          </Text>

          {/* Hero image slot */}
          <View style={{ height: 268, backgroundColor: '#F5F0EB', borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <Icon name="ChefHat" size={54} color="#E5E0D8" />
            <Text style={{ fontFamily: 'JetBrainsMono-Regular', color: '#8C8278', fontSize: 11, marginTop: 10 }}>Mbongo Tchobi · plat héros</Text>
          </View>

          {/* Body */}
          <Text style={{ fontSize: 13, color: '#6D4C41', lineHeight: 22, marginTop: 16 }}>
            {t('home.mbongoDesc')}
          </Text>

          {/* Author + CTA */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>JK</Text>
              </View>
              <View>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#2C1810', fontFamily: 'Inter-SemiBold' }}>par Chef Joëlle K.</Text>
                <Text style={{ fontSize: 11, color: '#8C8278' }}>· lecture 4 min</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                <Icon name="Share2" size={16} color="#6D4C41" />
              </TouchableOpacity>
              <TouchableOpacity style={{ height: 36, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#2C1810', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('home.readMore')}</Text>
                <Icon name="ChevronRight" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick scan CTA */}
        <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
          <TouchableOpacity
            style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#E8591A', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#FBF3DC' }}
            onPress={() => nav.navigate('Camera')}
            activeOpacity={0.85}
          >
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ScanLine" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: '#E8591A', fontSize: 13, fontFamily: 'Inter-Bold' }}>{t('home.scanCTA')}</Text>
              <Text style={{ color: '#6D4C41', fontSize: 11, marginTop: 2 }}>
                {t('scanner.photo')} · {t('scanner.audio')} · {t('scanner.text')}
              </Text>
            </View>
            <Icon name="ChevronRight" size={20} color="#E8591A" />
          </TouchableOpacity>
        </View>

        {/* À explorer */}
        <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <Text style={{ color: '#2C1810', fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
              {t('home.toExplore')}
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 11, color: '#E8591A', fontWeight: '600' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {EXPLORE_ITEMS.map((item, i) => {
            const colors = KIND_COLORS[item.kind] ?? { bg: '#F5F0EB', text: '#6D4C41' };
            return (
              <TouchableOpacity
                key={i}
                style={{ flexDirection: 'row', gap: 14, paddingVertical: 12, borderBottomWidth: i < 2 ? 1 : 0, borderColor: '#F5F0EB' }}
                activeOpacity={0.75}
              >
                <View style={{ width: 70, height: 70, backgroundColor: '#F5F0EB', borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ChefHat" size={28} color="#E5E0D8" />
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: colors.bg, marginBottom: 6 }}>
                    <Text style={{ fontSize: 10, color: colors.text, fontWeight: '700', letterSpacing: 0.5 }}>{item.kind.toUpperCase()}</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810', fontFamily: 'Inter-SemiBold' }}>
                    {t(item.titleKey)}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 2 }}>
                    {t(item.descKey)}
                  </Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Icon name="ChevronRight" size={16} color="#E5E0D8" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
