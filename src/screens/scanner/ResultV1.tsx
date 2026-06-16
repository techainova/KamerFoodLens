import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  SafeAreaView, Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ScannerStackParams } from '@/navigation/types';
import Icon from '@/components/ui/Icon';

type ResultNav = NativeStackNavigationProp<ScannerStackParams, 'Result'>;

const DISH = {
  name: 'Ndolé',
  region: 'Littoral · Cameroun',
  confidence: 92,
  story: "Plat emblématique des Sawa et Bantous du Littoral, le ndolé est préparé avec des feuilles amères de plante éponyme, de la pâte d'arachide, du poisson fumé ou de la viande. Il est souvent servi lors des grandes cérémonies.",
};

const SIMILAR = ['Eru', 'Mbongo', 'Kwacoco', 'Koki', 'Sanga'];

function ConfidenceBadge({ value }: { value: number }) {
  const color  = value >= 80 ? '#2E7D32' : value >= 60 ? '#F9A825' : '#C62828';
  const bgColor = value >= 80 ? '#E3F0E4' : value >= 60 ? '#FBF3DC' : '#FBDCDC';
  return (
    <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: bgColor }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 13, fontWeight: '700', color, fontFamily: 'Inter-Bold' }}>
        {value}% — {value >= 80 ? 'Haute confiance' : value >= 60 ? 'Confiance moyenne' : 'Faible confiance'}
      </Text>
    </View>
  );
}

export default function ResultV1() {
  const navigation = useNavigation<ResultNav>();
  const { t } = useTranslation();
  const [savedToJournal, setSavedToJournal] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#2C1810' }}>
      <StatusBar barStyle="light-content" />

      {/* Hero image slot */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 440 }}>
        <View style={{ flex: 1, backgroundColor: '#3D2418' }} />
        {/* Overlay gradient simulation */}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(44,24,16,0.15)' }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, backgroundColor: 'rgba(44,24,16,0.7)' }} />
        {/* Placeholder icon */}
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ChefHat" size={80} color="rgba(255,255,255,0.12)" />
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 8, fontStyle: 'italic' }}>photo du plat · dish photo</Text>
        </View>
      </View>

      {/* Top controls */}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="ArrowLeft" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Share2" size={17} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: bookmarked ? 'rgba(232,89,26,0.5)' : 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: bookmarked ? '#E8591A' : 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => setBookmarked(!bookmarked)}
            >
              <Icon name="Bookmark" size={17} color="#fff" fill={bookmarked ? '#fff' : 'none'} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Dish name on hero */}
      <View style={{ position: 'absolute', zIndex: 5, top: 300, left: 20, right: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Text style={{ fontSize: 16 }}>🇨🇲</Text>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'JetBrainsMono-Regular' }}>
            {DISH.region}
          </Text>
        </View>
        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', color: '#fff', fontSize: 42, lineHeight: 46 }}>
          {DISH.name}
        </Text>
      </View>

      {/* Bottom sheet */}
      <ScrollView
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
        <View style={{ marginTop: 390 }}>
          <View style={{ backgroundColor: '#FFFAF5', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, paddingHorizontal: 20 }}>
            {/* Handle */}
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E0D8', alignSelf: 'center', marginBottom: 20 }} />

            {/* Confidence */}
            <ConfidenceBadge value={DISH.confidence} />

            {/* Story section */}
            <View style={{ marginTop: 18 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#2C1810', fontFamily: 'Inter-Bold' }}>
                  {t('scanner.storyTitle')}
                </Text>
                <TouchableOpacity style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Volume2" size={16} color="#6D4C41" />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 13, color: '#6D4C41', lineHeight: 21 }}>
                {DISH.story}
              </Text>
            </View>

            {/* Primary actions */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={{ flex: 1, height: 50, backgroundColor: '#E8591A', borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onPress={() => navigation.navigate('Recipe', { dishId: 'ndole-001' })}
                activeOpacity={0.85}
              >
                <Icon name="ChefHat" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
                  {t('scanner.viewRecipe')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, height: 50, borderWidth: 2, borderColor: '#2E7D32', borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('MapScreen' as never)}
              >
                <Icon name="MapPin" size={18} color="#2E7D32" />
                <Text style={{ color: '#2E7D32', fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
                  {t('scanner.findRestaurants')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Secondary action */}
            <TouchableOpacity
              style={{ marginTop: 10, height: 46, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff' }}
              onPress={() => setSavedToJournal(true)}
              activeOpacity={0.8}
            >
              <Icon name="Bookmark" size={16} color={savedToJournal ? '#2E7D32' : '#6D4C41'} fill={savedToJournal ? '#2E7D32' : 'none'} />
              <Text style={{ color: savedToJournal ? '#2E7D32' : '#6D4C41', fontSize: 13, fontWeight: '600' }}>
                {savedToJournal ? '✓ Ajouté au journal' : t('scanner.addToJournal')}
              </Text>
            </TouchableOpacity>

            {/* Similar dishes */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810', marginBottom: 10 }}>
                {t('scanner.similar')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {SIMILAR.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 6 }}
                  >
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#F5F0EB' }} />
                    <Text style={{ fontSize: 13, color: '#6D4C41', fontWeight: '500' }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Scan again */}
            <TouchableOpacity
              style={{ marginTop: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="RefreshCw" size={14} color="#E8591A" />
              <Text style={{ color: '#E8591A', fontSize: 13, fontWeight: '600' }}>
                {t('scanner.scanAgain')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
