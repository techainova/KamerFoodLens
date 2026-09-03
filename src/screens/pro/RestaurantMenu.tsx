import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert, Switch,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { proService, type ProRestaurant } from '@/services/pro.service';
import { restaurantsService, type MenuItem } from '@/services/restaurants.service';

export default function RestaurantMenu() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const { data: restaurants = [], isLoading: loadingRestaurants } = useQuery<ProRestaurant[]>({
    queryKey: ['pro-restaurants'],
    queryFn: () => proService.getMyRestaurants(),
    staleTime: 5 * 60 * 1000,
  });

  const restaurantId = selectedRestaurantId ?? restaurants[0]?.id ?? null;

  const { data: items = [], isLoading: loadingMenu } = useQuery<MenuItem[]>({
    queryKey: ['restaurant-menu', restaurantId],
    queryFn: () => restaurantsService.getMenu(restaurantId!),
    enabled: !!restaurantId,
    staleTime: 60_000,
  });

  const byCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item.category || t('restaurantMenu.uncategorized');
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

  const toggleAvailability = async (item: MenuItem) => {
    if (!restaurantId) return;
    try {
      await restaurantsService.updateMenuItem(restaurantId, item.id, { isAvailable: !item.isAvailable });
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', restaurantId] });
    } catch {
      Alert.alert(t('common.error'), t('restaurantMenu.updateError'));
    }
  };

  const confirmDelete = (item: MenuItem) => {
    Alert.alert(t('restaurantMenu.deleteDish'), t('restaurantMenu.deleteConfirmMsg', { name: item.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'), style: 'destructive', onPress: async () => {
          if (!restaurantId) return;
          try {
            await restaurantsService.deleteMenuItem(restaurantId, item.id);
            queryClient.invalidateQueries({ queryKey: ['restaurant-menu', restaurantId] });
          } catch {
            Alert.alert(t('common.error'), t('restaurantMenu.deleteError'));
          }
        },
      },
    ]);
  };

  const isLoading = loadingRestaurants || loadingMenu;

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
          onPress={() => restaurantId && navigation.navigate('RestaurantMenuEdit', { restaurantId })}
          disabled={!restaurantId}
          style={{ height: 32, paddingHorizontal: 12, backgroundColor: restaurantId ? C.gold : C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}
        >
          <Icon name="Plus" size={12} color={restaurantId ? '#fff' : C.inkMute} />
          <Text style={{ color: restaurantId ? '#fff' : C.inkMute, fontSize: 12, fontWeight: '600' }}>{t('restaurantMenu.add')}</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : restaurants.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 }}>
          <Icon name="ChefHat" size={32} color={C.inkMute} />
          <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center' }}>{t('restaurantMenu.noRestaurant')}</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {restaurants.length > 1 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {restaurants.map(r => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setSelectedRestaurantId(r.id)}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
                    backgroundColor: restaurantId === r.id ? C.primary : C.surface2,
                    borderWidth: 1, borderColor: restaurantId === r.id ? C.primary : C.border,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: restaurantId === r.id ? '#fff' : C.inkSoft }}>{r.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {items.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40, gap: 8 }}>
              <Icon name="ChefHat" size={32} color={C.inkMute} />
              <Text style={{ fontSize: 13, color: C.inkMute }}>{t('restaurantMenu.emptyMenu')}</Text>
            </View>
          ) : (
            Object.entries(byCategory).map(([category, dishes]) => (
              <View key={category} style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 10 }}>
                  {category} · {t('restaurantMenu.dishesCount', { count: dishes.length })}
                </Text>
                {dishes.map((item) => (
                  <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 8, ...SHADOW_SM }}>
                    <View style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="ChefHat" size={20} color={C.inkMute} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }} numberOfLines={1}>{item.name}</Text>
                      <Text style={{ fontSize: 12, color: C.inkSoft, marginTop: 4 }}>
                        {t('restaurantMenu.price')}: <Text style={{ fontWeight: '700' }}>{item.priceXAF.toLocaleString()} XAF</Text>
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <Switch
                          value={item.isAvailable}
                          onValueChange={() => void toggleAvailability(item)}
                          trackColor={{ false: C.border, true: C.success }}
                          thumbColor="#fff"
                          style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                        />
                        <Text style={{ fontSize: 10, color: item.isAvailable ? C.success : C.inkMute }}>
                          {item.isAvailable ? t('restaurantMenu.available') : t('restaurantMenu.unavailable')}
                        </Text>
                      </View>
                    </View>
                    <View style={{ gap: 6 }}>
                      <TouchableOpacity
                        onPress={() => restaurantId && navigation.navigate('RestaurantMenuEdit', { restaurantId, itemId: item.id })}
                        style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="Edit" size={12} color={C.inkSoft} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => confirmDelete(item)} style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: C.error, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="X" size={12} color={C.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
