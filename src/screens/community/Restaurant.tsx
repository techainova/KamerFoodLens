import React, { useCallback, useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert, Share, ActivityIndicator, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { useRestaurantStore, type Restaurant as RestaurantData, type MenuItem } from '@/store/restaurant.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { useCartStore } from '@/store/cart.store';
import { restaurantsService, type RestaurantReview } from '@/services/restaurants.service';

const TABS = [
  { key: 'menu',    label: 'Menu' },
  { key: 'reviews', label: 'Avis' },
  { key: 'info',    label: 'Infos' },
  { key: 'photos',  label: 'Photos' },
] as const;
type TabKey = typeof TABS[number]['key'];

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon key={i} name="Star" size={size} color={i <= rounded ? '#F9A825' : '#E5E0D8'} fill={i <= rounded ? '#F9A825' : 'none'} />
      ))}
    </View>
  );
}

function groupByCategory(items: MenuItem[]): { title: string; items: MenuItem[] }[] {
  const map = new Map<string, MenuItem[]>();
  for (const item of items) {
    const key = item.category || 'Autres';
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
}

export default function Restaurant() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const restaurantId: string | undefined = route.params?.restaurantId;

  const fetchById = useRestaurantStore((s) => s.fetchById);
  const isSaved = useFavoritesStore((s) => s.isSaved);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const fetchFavorites = useFavoritesStore((s) => s.fetchAll);
  const { addItem, items: cartItems, restaurantId: cartRestaurantId, count } = useCartStore();

  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [reviews, setReviews] = useState<RestaurantReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('menu');
  const [reviewText, setReviewText] = useState('');
  const [myRating, setMyRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!restaurantId) return;
    try {
      const data = await restaurantsService.getReviews(restaurantId);
      setReviews(data);
    } catch {
      setReviews([]);
    }
  }, [restaurantId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const detail = await fetchById(restaurantId);
      if (!cancelled) {
        setRestaurant(detail ?? null);
        setLoading(false);
      }
    })();
    void loadReviews();
    void fetchFavorites();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const bookmarked = restaurantId ? isSaved(restaurantId) : false;
  const totalCart = cartRestaurantId === restaurantId ? count() : 0;

  const addToCart = (item: MenuItem) => {
    if (!restaurant) return;
    addItem(restaurant.id, restaurant.name, { id: item.id, name: item.name, price: item.price });
  };

  const submitReview = async () => {
    if (!restaurantId || myRating === 0 || reviewText.length <= 5) return;
    setSubmittingReview(true);
    try {
      await restaurantsService.createReview(restaurantId, myRating, reviewText);
      setReviewText('');
      setMyRating(0);
      await loadReviews();
    } catch (err) {
      if (__DEV__) {
        console.warn('[KFL][Restaurant] échec de publication de l\'avis :', err);
      }
      Alert.alert(t('common.error', 'Erreur'), t('restaurant.reviewFailed', "Impossible de publier l'avis."));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#E8591A" />
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center' }}>
          {t('restaurant.notFound', 'Restaurant introuvable.')}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('common.goBack', 'Retour')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const menuSections = groupByCategory(restaurant.menu);

  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={{ height: 220, position: 'relative' }}>
        {restaurant.imageUrl ? (
          <Image source={{ uri: restaurant.imageUrl }} style={{ flex: 1, backgroundColor: '#3D2418' }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#3D2418', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ChefHat" size={64} color="rgba(255,255,255,0.12)" />
          </View>
        )}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(20,10,6,0.65)' }} />

        <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <View style={{ paddingHorizontal: 16, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="ArrowLeft" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => restaurantId && void toggleFavorite('restaurant', restaurantId)}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: bookmarked ? 'rgba(232,89,26,0.5)' : 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: bookmarked ? '#E8591A' : 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="Bookmark" size={17} color="#fff" fill={bookmarked ? '#fff' : 'none'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Share.share({ message: `${restaurant.name} sur KmerFoodLens — ${restaurant.type}` })} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Share2" size={17} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <View style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', color: '#fff', fontSize: 26, lineHeight: 30, marginBottom: 6 }}>
            {restaurant.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Stars rating={restaurant.rating} />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} avis) · {restaurant.price}
            </Text>
          </View>
        </View>
      </View>

      {/* Info chips */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, flexWrap: 'wrap' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: restaurant.isOpen ? C.successSoft : '#FBDCDC', borderWidth: 1, borderColor: restaurant.isOpen ? 'rgba(46,125,50,0.25)' : 'rgba(198,40,40,0.25)' }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: restaurant.isOpen ? '#2E7D32' : '#C62828' }} />
          <Text style={{ color: restaurant.isOpen ? '#2E7D32' : '#C62828', fontSize: 12, fontWeight: '600' }}>
            {restaurant.isOpen ? 'Ouvert' : 'Fermé'}
          </Text>
        </View>
        {restaurant.hoursLabel.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }}>
            <Icon name="Clock" size={12} color="#6D4C41" />
            <Text style={{ color: C.inkSoft, fontSize: 12 }}>{restaurant.hoursLabel}</Text>
          </View>
        )}
        {restaurant.distance.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }}>
            <Icon name="MapPin" size={12} color="#6D4C41" />
            <Text style={{ color: C.inkSoft, fontSize: 12 }}>{restaurant.distance}</Text>
          </View>
        )}
        {restaurant.isVerified && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: '#FEF0E8', borderWidth: 1, borderColor: 'rgba(232,89,26,0.3)' }}>
            <Icon name="Check" size={12} color="#E8591A" />
            <Text style={{ color: '#E8591A', fontSize: 12, fontWeight: '600' }}>KFL Vérifié</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{ flex: 1, paddingVertical: 13, borderBottomWidth: 2, borderColor: activeTab === tab.key ? '#E8591A' : 'transparent', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 13, fontWeight: activeTab === tab.key ? '700' : '500', color: activeTab === tab.key ? '#E8591A' : '#8C8278' }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

        {/* ── MENU ── */}
        {activeTab === 'menu' && (
          <View style={{ padding: 20 }}>
            {menuSections.length === 0 && (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 20 }}>
                {t('restaurant.noMenu', 'Menu indisponible pour le moment.')}
              </Text>
            )}
            {menuSections.map((section, si) => (
              <View key={si} style={{ marginBottom: 24 }}>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 17, color: C.ink, marginBottom: 12 }}>
                  {section.title}
                </Text>
                {section.items.map((item) => (
                  <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border }}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: C.surface2 }} resizeMode="cover" />
                    ) : (
                      <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="ChefHat" size={20} color="rgba(140,130,120,0.35)" />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, fontFamily: 'Inter-SemiBold', marginBottom: 2 }}>{item.name}</Text>
                      {item.desc ? <Text style={{ fontSize: 11, color: C.inkMute }}>{item.desc}</Text> : null}
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>
                        {item.price.toLocaleString()} XAF
                      </Text>
                      <TouchableOpacity
                        onPress={() => addToCart(item)}
                        style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="Plus" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── AVIS ── */}
        {activeTab === 'reviews' && (
          <View style={{ padding: 20, gap: 16 }}>
            {/* Summary card */}
            <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 20, ...SHADOW_SM }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 48, color: C.ink, lineHeight: 52 }}>
                  {restaurant.rating.toFixed(1)}
                </Text>
                <Stars rating={restaurant.rating} />
                <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 4 }}>{restaurant.reviewCount} avis</Text>
              </View>
            </View>

            {/* Write review */}
            <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16, gap: 12, ...SHADOW_SM }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>Votre avis</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <TouchableOpacity key={s} onPress={() => setMyRating(s)}>
                    <Icon name="Star" size={32} color={s <= myRating ? '#F9A825' : '#E5E0D8'} fill={s <= myRating ? '#F9A825' : 'none'} />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Partagez votre expérience..."
                placeholderTextColor="#8C8278"
                multiline
                style={{ minHeight: 80, backgroundColor: C.surface2, borderRadius: 12, padding: 12, fontSize: 13, color: C.ink, textAlignVertical: 'top', lineHeight: 20 }}
              />
              <TouchableOpacity
                onPress={submitReview}
                style={{ height: 44, borderRadius: 22, backgroundColor: myRating > 0 && reviewText.length > 5 ? '#E8591A' : '#E5E0D8', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
                disabled={myRating === 0 || reviewText.length <= 5 || submittingReview}
              >
                {submittingReview ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Icon name="Send" size={15} color={myRating > 0 && reviewText.length > 5 ? '#fff' : '#8C8278'} />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: myRating > 0 && reviewText.length > 5 ? '#fff' : '#8C8278' }}>Publier</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {reviews.length === 0 && (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center' }}>
                {t('restaurant.noReviews', 'Aucun avis pour le moment.')}
              </Text>
            )}
            {reviews.map((r) => (
              <View key={r.id} style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16, gap: 10, ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
                      {r.authorName.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{r.authorName}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute }}>{new Date(r.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <Stars rating={r.rating} />
                </View>
                <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 20 }}>{r.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── INFOS ── */}
        {activeTab === 'info' && (
          <View style={{ padding: 20, gap: 12 }}>
            <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {([
                { icon: 'MapPin' as const, label: 'Adresse',   value: restaurant.address || '—' },
                ...(restaurant.phone ? [{ icon: 'Phone' as const, label: 'Téléphone', value: restaurant.phone }] : []),
              ]).map((item, i, arr) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={item.icon} size={17} color="#E8591A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: C.inkMute, marginBottom: 1 }}>{item.label}</Text>
                    <Text style={{ fontSize: 13, color: C.ink, fontWeight: '500' }}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            {restaurant.hoursLabel.length > 0 && (
              <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 18, ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="Clock" size={17} color="#E8591A" />
                  </View>
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>Horaires</Text>
                    <Text style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>{restaurant.hoursLabel}</Text>
                  </View>
                </View>
              </View>
            )}

            {restaurant.isVerified && (
              <View style={{ backgroundColor: '#FEF0E8', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(232,89,26,0.2)', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Check" size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#E8591A', fontFamily: 'Inter-Bold', marginBottom: 2 }}>Restaurant KFL Vérifié</Text>
                  <Text style={{ fontSize: 12, color: C.inkSoft, lineHeight: 18 }}>
                    Cuisine authentiquement camerounaise, évaluée et certifiée par l'équipe KFL.
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ── PHOTOS ── */}
        {activeTab === 'photos' && (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 14, color: C.inkMute, marginBottom: 16 }}>
              {t('restaurant.noPhotos', 'Aucune photo pour le moment.')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={{ width: '31%', aspectRatio: 1, backgroundColor: C.surface2, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Camera" size={20} color="rgba(140,130,120,0.4)" />
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 14, paddingBottom: 28, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={() => Alert.alert(t('settings.comingSoonTitle', 'Bientôt disponible'), t('settings.comingSoonMsg', 'Cette fonctionnalité arrive dans une prochaine mise à jour.'))}
          style={{ flex: 1, height: 52, borderWidth: 2, borderColor: '#E8591A', borderRadius: 26, alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#E8591A', fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
            {t('restaurant.reserve', 'Réserver')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(totalCart > 0 ? 'OrderSummary' : 'OrderMenu', { restaurantId: restaurant.id })}
          style={{ flex: 2, height: 52, backgroundColor: '#E8591A', borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          <Icon name="Package" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
            {t('restaurant.order', 'Commander')}{totalCart > 0 ? ` (${totalCart})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
