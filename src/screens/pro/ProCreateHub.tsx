// Compte Pro — hub de création : publication, événement, formation, vidéo,
// plat au menu, promotion.
import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/auth.store';
import { proService } from '@/services/pro.service';

export default function ProCreateHub() {
  const C = useColors();
  const nav = useNavigation<any>();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [resolvingRestaurant, setResolvingRestaurant] = useState(false);

  const handleAddDish = async () => {
    if (resolvingRestaurant) return;
    setResolvingRestaurant(true);
    try {
      const restaurants = await proService.getMyRestaurants();
      const restaurantId = restaurants[0]?.id;
      if (!restaurantId) {
        Alert.alert(t('common.error'), t('proCreateHub.noRestaurantError'));
        return;
      }
      nav.navigate('RestaurantMenuEdit', { restaurantId });
    } catch {
      Alert.alert(t('common.error'), t('proCreateHub.noRestaurantError'));
    } finally {
      setResolvingRestaurant(false);
    }
  };

  const TYPES: { icon: Parameters<typeof Icon>[0]['name']; title: string; subtitle: string; color: string; bg: string; onPress: () => void }[] = [
    { icon: 'Camera', title: 'Publication', subtitle: "Photo ou vidéo d'un plat, coulisses, menu du jour", color: C.primary, bg: C.primarySoft, onPress: () => nav.navigate('CreatePost') },
    { icon: 'Calendar', title: 'Événement', subtitle: 'Atelier, festival, dégustation — gratuit ou payant', color: '#6A1B9A', bg: 'rgba(106,27,154,0.1)', onPress: () => nav.navigate('CreateEvent') },
    { icon: 'GraduationCap', title: 'Formation', subtitle: 'Cours en direct ou série de vidéos, avec certificat', color: C.success, bg: C.successSoft, onPress: () => nav.navigate('CreateCourse') },
    { icon: 'Video', title: 'Vidéo courte', subtitle: "Format vertical pour l'onglet Vidéos", color: '#1565C0', bg: 'rgba(21,101,192,0.1)', onPress: () => nav.navigate('CreateVideo') },
    { icon: 'Store', title: 'Plat au menu', subtitle: 'Ajouter un plat commandable aujourd\'hui', color: C.gold, bg: C.goldSoft, onPress: () => void handleAddDish() },
    { icon: 'Tag', title: 'Promotion', subtitle: 'Code promo ou réduction sur une période', color: C.error, bg: C.errorSoft, onPress: () => nav.navigate('ProPromos') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: C.border }}>
        {nav.canGoBack() && (
          <TouchableOpacity onPress={() => nav.goBack()} style={{ padding: 4 }}>
            <Icon name="ArrowLeft" size={22} color={C.ink} />
          </TouchableOpacity>
        )}
        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 19, color: C.ink }}>Créer</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 13, color: C.inkMute, lineHeight: 19, marginBottom: 16 }}>
          Que souhaitez-vous publier aujourd'hui, <Text style={{ color: C.ink, fontWeight: '700' }}>{user?.firstName ?? 'vous'}</Text> ?
        </Text>

        <View style={{ gap: 9 }}>
          {TYPES.map((item) => (
            <TouchableOpacity
              key={item.title}
              onPress={item.onPress}
              disabled={item.title === 'Plat au menu' && resolvingRestaurant}
              activeOpacity={0.85}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}
            >
              <View style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={23} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14.5, fontWeight: '700', color: C.ink }}>{item.title}</Text>
                <Text style={{ fontSize: 11.5, color: C.inkMute, marginTop: 2, lineHeight: 16 }}>{item.subtitle}</Text>
              </View>
              {item.title === 'Plat au menu' && resolvingRestaurant ? (
                <ActivityIndicator color={C.inkFaint} size="small" />
              ) : (
                <Icon name="ChevronRight" size={17} color={C.inkFaint} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginTop: 18, padding: 13, borderRadius: 14, backgroundColor: C.surface2, borderLeftWidth: 3, borderLeftColor: C.gold }}>
          <Text style={{ fontSize: 11.5, color: C.inkSoft, lineHeight: 17 }}>
            💡 Les publications avec un plat tagué génèrent en moyenne 3× plus de commandes. Pensez à lier vos photos à votre menu.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
