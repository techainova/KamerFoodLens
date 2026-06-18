import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const FEATURED_ORGS = [
  { name: 'Chez Mama Pauline', type: 'Restaurant', rating: '4.8', open: true  },
  { name: 'Chef Joël Academy', type: 'Formation',   rating: '4.9', open: true  },
  { name: 'Kmer Saveurs',      type: 'Street food', rating: '4.3', open: false },
];

const POPULAR = ['Ndolé traditionnel', 'Poulet DG', 'Eru & Fufu'];

export default function HomeProAware() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>KmerFoodLens</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bell" size={18} color={C.inkSoft} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>S</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Hero scan CTA */}
        <TouchableOpacity onPress={() => navigation.navigate('ScannerTab')} activeOpacity={0.9} style={{ marginHorizontal: 16, marginTop: 16, padding: 20, borderRadius: 24, backgroundColor: C.ink }}>
          <Text style={{ color: C.primary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>{t('homeProAware.scanCta')}</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 28, marginBottom: 16 }}>{t('homeProAware.heroTitle')}</Text>
          <View style={{ height: 44, backgroundColor: C.primary, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 20 }}>
            <Icon name="Camera" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t('homeProAware.scanNow')}</Text>
          </View>
        </TouchableOpacity>

        {/* Pro featured orgs */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>{t('homeProAware.featuredOrgs')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ backgroundColor: C.gold, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>PRO</Text>
                </View>
                <Text style={{ fontSize: 12, color: C.inkMute }}>{t('homeProAware.certifiedPartners')}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Restaurant')}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: C.primary }}>{t('homeProAware.seeAll')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
            {FEATURED_ORGS.map((org, i) => (
              <TouchableOpacity key={i} onPress={() => navigation.navigate('Restaurant')} style={{ width: 176, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_MD }}>
                <View style={{ height: 96, backgroundColor: C.surface2, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ChefHat" size={36} color={C.inkMute} />
                  <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: C.gold, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>PRO</Text>
                  </View>
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{org.name}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{org.type}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Icon name="Star" size={12} color={C.gold} fill={C.gold} />
                      <Text style={{ fontSize: 12, color: C.gold, fontWeight: '600' }}>{org.rating}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, backgroundColor: org.open ? C.successSoft : C.errorSoft }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: org.open ? C.success : C.error }}>
                        {org.open ? t('homeProAware.open') : t('homeProAware.closed')}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Popular recipes */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>{t('homeProAware.popularRecipes')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.primary }}>{t('homeProAware.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {POPULAR.map((name, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate('RecipeV1')} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
              <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChefHat" size={22} color={C.inkMute} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{name}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>{t('homeProAware.region')}</Text>
                <View style={{ flexDirection: 'row', gap: 2, marginTop: 3 }}>
                  {[1, 2, 3, 4, 5].map(s => <Icon key={s} name="Star" size={11} color={C.gold} fill={C.gold} />)}
                </View>
              </View>
              <Icon name="ChevronRight" size={18} color={C.inkMute} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
