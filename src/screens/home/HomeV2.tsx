import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/types';
import Icon from '@/components/ui/Icon';

const TRENDING = [
  { name: 'Ndolé', scans: 420, region: 'Littoral' },
  { name: 'Poulet DG', scans: 340, region: 'Centre' },
  { name: 'Mbongo Tchobi', scans: 260, region: 'Sud' },
];

export default function HomeV2() {
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <View>
            <Text style={{ fontSize: 12, color: '#8C8278', fontFamily: 'Inter-Regular' }}>{t('home.hello')}</Text>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: '#2C1810' }}>Amah</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            {/* Layout switcher 6b → 6c */}
            <TouchableOpacity
              style={{ width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#E8591A', backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => nav.dispatch(StackActions.replace('HomeV3'))}
            >
              <Icon name="Grid" size={16} color="#E8591A" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => nav.navigate('Notifications')}
              style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="Bell" size={18} color="#6D4C41" />
              <View style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#C62828', borderWidth: 1.5, borderColor: '#fff' }} />
            </TouchableOpacity>
            <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: 'Inter-Bold' }}>AN</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <TouchableOpacity
          style={{ height: 46, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}
          onPress={() => nav.navigate('Search')}
          activeOpacity={0.7}
        >
          <Icon name="Search" size={16} color="#8C8278" />
          <Text style={{ flex: 1, color: '#8C8278', fontSize: 13, fontFamily: 'Inter-Regular' }}>{t('home.searchPlaceholder', 'Plat, restaurant, région...')}</Text>
          <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Mic" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Action mosaic */}
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>

            {/* Big scanner tile */}
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: '#2C1810', borderRadius: 18, padding: 18, minHeight: 208, justifyContent: 'space-between' }}
              onPress={() => nav.navigate('Camera')}
              activeOpacity={0.85}
            >
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Camera" size={22} color="#fff" />
              </View>
              <View>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', color: '#fff', fontSize: 18, lineHeight: 22 }}>
                  {t('home.scanCTA')}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 6 }}>
                  {t('scanner.photo')} · {t('scanner.audio')} · {t('scanner.text')}
                </Text>
              </View>
            </TouchableOpacity>

            {/* 2 right tiles: Recettes + Restaurants */}
            <View style={{ flex: 1, gap: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 18, padding: 14, justifyContent: 'space-between' }}
                activeOpacity={0.8}
                onPress={() => nav.navigate('RecipeV1')}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FBDCDC', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ChefHat" size={18} color="#E8591A" />
                </View>
                <Text style={{ color: '#2C1810', fontSize: 13, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('recipe.title')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 18, padding: 14, justifyContent: 'space-between' }}
                activeOpacity={0.8}
                onPress={() => nav.navigate('MapScreen')}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#E3F0E4', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="MapPin" size={18} color="#2E7D32" />
                </View>
                <Text style={{ color: '#2C1810', fontSize: 13, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('map.title')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3 bottom tiles */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 14, padding: 12, minHeight: 78, justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => nav.navigate('Events')}
            >
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#E8EAF6', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Calendar" size={16} color="#1A237E" />
              </View>
              <Text style={{ color: '#2C1810', fontSize: 11, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('events.title')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 14, padding: 12, minHeight: 78, justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => nav.navigate('Forum')}
            >
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#E3F0E4', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Globe" size={16} color="#2E7D32" />
              </View>
              <Text style={{ color: '#2C1810', fontSize: 11, fontWeight: '700', fontFamily: 'Inter-Bold' }}>Forum</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 14, padding: 12, minHeight: 78, justifyContent: 'space-between' }}
              activeOpacity={0.8}
              onPress={() => nav.navigate('Games')}
            >
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#FBF3DC', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Trophy" size={16} color="#F9A825" />
              </View>
              <Text style={{ color: '#2C1810', fontSize: 11, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('games.title')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <Text style={{ color: '#2C1810', fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('home.trending')}</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 11, color: '#E8591A', fontWeight: '600' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 10 }}>
            {TRENDING.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#F5F0EB' }}
                activeOpacity={0.7}
              >
                <Text style={{
                  width: 28, textAlign: 'center',
                  fontFamily: 'PlayfairDisplay-Bold', fontSize: 18,
                  color: i === 0 ? '#E8591A' : i === 1 ? '#F9A825' : '#E5E0D8',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <View style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ChefHat" size={22} color="#E5E0D8" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#2C1810', fontSize: 13, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Icon name="Flame" size={11} color="#E8591A" />
                    <Text style={{ color: '#8C8278', fontSize: 11 }}>+{item.scans} scans</Text>
                    <Text style={{ color: '#E5E0D8' }}> · </Text>
                    <Icon name="MapPin" size={11} color="#8C8278" />
                    <Text style={{ color: '#8C8278', fontSize: 11 }}>{item.region}</Text>
                  </View>
                </View>
                <Icon name="ChevronRight" size={16} color="#E5E0D8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
