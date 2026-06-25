import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type Dish = { name: string; region: string; price: number; category: string; available: boolean };

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

const WEEK_MENU: Record<typeof DAY_KEYS[number], Dish[]> = {
  mon: [
    { name: 'Ndolé aux crevettes', region: 'Littoral', price: 3500, category: 'Plat principal', available: true },
    { name: 'Poulet DG',           region: 'Littoral', price: 4500, category: 'Plat principal', available: true },
    { name: 'Plantains frits',     region: 'Littoral', price: 1500, category: 'Accompagnement', available: true },
    { name: 'Bissap glacé',        region: 'Centre',   price: 1000, category: 'Boisson',         available: true },
  ],
  tue: [
    { name: 'Eru & Fufu', region: 'Sud-Ouest', price: 4000, category: 'Plat principal', available: true },
    { name: 'Koki haricots', region: 'Ouest', price: 2500, category: 'Plat principal', available: false },
  ],
  wed: [
    { name: 'Mbongo Tchobi', region: 'Centre', price: 4500, category: 'Plat principal', available: true },
    { name: 'Sanga', region: 'Adamaoua', price: 3000, category: 'Plat principal', available: true },
    { name: 'Jus de gingembre', region: 'Centre', price: 1000, category: 'Boisson', available: true },
  ],
  thu: [],
  fri: [],
  sat: [],
  sun: [],
};

const totalDishes = Object.values(WEEK_MENU).reduce((s, items) => s + items.length, 0);
const configuredDays = Object.values(WEEK_MENU).filter((items) => items.length > 0).length;

export default function RestaurantMenu() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeDay, setActiveDay] = useState(0);
  const [weekMenu, setWeekMenu] = useState(WEEK_MENU);
  const [publishing, setPublishing] = useState(false);

  const dayKey = DAY_KEYS[activeDay]!;
  const items = weekMenu[dayKey];

  const removeItem = (i: number) => setWeekMenu((prev) => ({ ...prev, [dayKey]: prev[dayKey].filter((_, idx) => idx !== i) }));

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      Alert.alert(t('restaurantMenu.publishedTitle'), t('restaurantMenu.publishedMsg'));
    }, 800);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('restaurantMenu.title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('RestaurantMenuEdit', {})}
          style={{ height: 32, paddingHorizontal: 12, backgroundColor: C.gold, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}
        >
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('restaurantMenu.add')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Mode card */}
        <View style={{ padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.primary, backgroundColor: C.goldSoft, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: '700', fontSize: 13, color: C.primary }}>📆 {t('restaurantMenu.modeWeekly')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProRegistration')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: C.primary }}>{t('restaurantMenu.changeMode')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.success, marginTop: 4 }}>
            ✓ {t('restaurantMenu.daysConfigured', { count: configuredDays })} · {t('restaurantMenu.dishesTotal', { count: totalDishes })}
          </Text>
        </View>

        {/* Day tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {DAY_KEYS.map((key, i) => (
              <TouchableOpacity
                key={key}
                onPress={() => setActiveDay(i)}
                style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: i === activeDay ? C.primary : C.surface, borderColor: i === activeDay ? C.primary : C.border }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: i === activeDay ? '#fff' : C.inkSoft }}>{t(`restaurantMenu.day_${key}`)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 10 }}>
          {t(`restaurantMenu.day_${dayKey}`)} · {t('restaurantMenu.dishesCount', { count: items.length })}
        </Text>

        {items.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 30, gap: 8 }}>
            <Icon name="ChefHat" size={32} color={C.inkMute} />
            <Text style={{ fontSize: 13, color: C.inkMute }}>{t('restaurantMenu.emptyDay')}</Text>
          </View>
        ) : (
          items.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 8, ...SHADOW_SM }}>
              <View style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChefHat" size={20} color={C.inkMute} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 2, alignItems: 'center' }}>
                  <View style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, backgroundColor: C.surface2 }}>
                    <Text style={{ fontSize: 9, fontWeight: '600', color: C.inkMute }}>{item.region}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: C.inkSoft, marginTop: 4 }}>{t('restaurantMenu.price')}: <Text style={{ fontWeight: '700' }}>{item.price.toLocaleString()} XAF</Text></Text>
                <Text style={{ fontSize: 9, color: C.inkMute, marginTop: 1 }}>{item.category}</Text>
              </View>
              <View style={{ gap: 6 }}>
                <TouchableOpacity onPress={() => navigation.navigate('RestaurantMenuEdit', { itemId: String(i) })} style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Edit" size={12} color={C.inkSoft} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeItem(i)} style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: C.error, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="X" size={12} color={C.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('RestaurantMenuEdit', {})}
          style={{ padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: C.primary, borderStyle: 'dashed', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.primary }}>{t('restaurantMenu.addForDay')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Publish */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border }}>
        <TouchableOpacity
          onPress={handlePublish}
          disabled={publishing}
          style={{ height: 52, borderRadius: 26, backgroundColor: publishing ? C.inkMute : C.primary, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>{publishing ? t('restaurantMenu.publishing') : t('restaurantMenu.publish')}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 10, color: C.inkMute, textAlign: 'center', marginTop: 6, fontStyle: 'italic' }}>{t('restaurantMenu.publishNote')}</Text>
      </View>
    </SafeAreaView>
  );
}
