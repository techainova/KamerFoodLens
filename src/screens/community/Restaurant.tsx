import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 };

const TABS = [
  { key: 'menu',    label: 'Menu' },
  { key: 'reviews', label: 'Avis' },
  { key: 'info',    label: 'Infos' },
  { key: 'photos',  label: 'Photos' },
] as const;
type TabKey = typeof TABS[number]['key'];

const MENU_SECTIONS = [
  {
    title: 'Plats principaux',
    items: [
      { name: 'Ndolé traditionnel',  price: '4500', desc: 'Feuilles de ndolé, poisson fumé, crevettes', popular: true },
      { name: 'Poulet DG',           price: '5500', desc: 'Plantains, légumes sautés, épices locales',  popular: true },
      { name: 'Koki haricots',       price: '2500', desc: 'Préparation bamiléké traditionnelle',        popular: false },
      { name: 'Mbongo tchobi',       price: '5000', desc: 'Poisson en sauce noire camerounaise',        popular: false },
    ],
  },
  {
    title: 'Accompagnements',
    items: [
      { name: 'Miondo (bâton de manioc)', price: '500',  desc: '',                        popular: false },
      { name: 'Plantains frits',          price: '800',  desc: 'Plantains mûrs dorés',    popular: false },
      { name: "Riz cuit à l'étouffée",    price: '600',  desc: '',                        popular: false },
    ],
  },
  {
    title: 'Boissons',
    items: [
      { name: 'Jus de maracuja frais', price: '1000', desc: '',                     popular: false },
      { name: 'Eau minérale',          price: '300',  desc: '',                     popular: false },
      { name: 'Bière Beaufort 65cl',   price: '800',  desc: '',                     popular: false },
    ],
  },
];

const REVIEWS = [
  { author: 'Amah N.',     avatar: 'AN', rating: 5, text: "Le meilleur ndolé de Douala ! Service rapide, cadre agréable.", date: 'il y a 2 jours' },
  { author: 'Patrick K.',  avatar: 'PK', rating: 4, text: "Cuisine authentique, portions généreuses. Le poulet DG était exceptionnel.", date: 'il y a 1 semaine' },
  { author: 'Marie T.',    avatar: 'MT', rating: 5, text: "Mama Pauline sait cuisiner ! Ambiance chaleureuse et prix raisonnables.", date: 'il y a 2 semaines' },
  { author: 'Jean-Paul B.', avatar: 'JB', rating: 4, text: "Très bon restaurant traditionnel. Les miondo maison sont délicieux.", date: 'il y a 1 mois' },
];

const HOURS = [
  { day: 'Lundi',    h: '11h00 – 22h00', today: false },
  { day: 'Mardi',    h: '11h00 – 22h00', today: true },
  { day: 'Mercredi', h: '11h00 – 22h00', today: false },
  { day: 'Jeudi',    h: '11h00 – 22h00', today: false },
  { day: 'Vendredi', h: '11h00 – 23h00', today: false },
  { day: 'Samedi',   h: '10h00 – 23h00', today: false },
  { day: 'Dimanche', h: 'Fermé',          today: false },
];

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={{ color: i <= rating ? '#F9A825' : '#E5E0D8', fontSize: size }}>★</Text>
      ))}
    </View>
  );
}

export default function Restaurant() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabKey>('menu');
  const [bookmarked, setBookmarked] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [myRating, setMyRating] = useState(0);
  const [cartCount, setCartCount] = useState<Record<string, number>>({});

  const addToCart = (name: string) => setCartCount(prev => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
  const totalCart = Object.values(cartCount).reduce((s, v) => s + v, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={{ height: 220, position: 'relative' }}>
        <View style={{ flex: 1, backgroundColor: '#3D2418', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ChefHat" size={64} color="rgba(255,255,255,0.12)" />
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontStyle: 'italic', marginTop: 6 }}>photo du restaurant</Text>
        </View>
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
                onPress={() => setBookmarked(!bookmarked)}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: bookmarked ? 'rgba(232,89,26,0.5)' : 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: bookmarked ? '#E8591A' : 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="Bookmark" size={17} color="#fff" fill={bookmarked ? '#fff' : 'none'} />
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Share2" size={17} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <View style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', color: '#fff', fontSize: 26, lineHeight: 30, marginBottom: 6 }}>
            Chez Mama Pauline
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Stars rating={5} />
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>4.8 (127 avis) · $$</Text>
          </View>
        </View>
      </View>

      {/* Info chips */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8', flexWrap: 'wrap' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: '#E3F0E4', borderWidth: 1, borderColor: 'rgba(46,125,50,0.25)' }}>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#2E7D32' }} />
          <Text style={{ color: '#2E7D32', fontSize: 12, fontWeight: '600' }}>Ouvert</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8' }}>
          <Icon name="Clock" size={12} color="#6D4C41" />
          <Text style={{ color: '#6D4C41', fontSize: 12 }}>11h–22h</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8' }}>
          <Icon name="MapPin" size={12} color="#6D4C41" />
          <Text style={{ color: '#6D4C41', fontSize: 12 }}>1.4 km</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, height: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: '#FEF0E8', borderWidth: 1, borderColor: 'rgba(232,89,26,0.3)' }}>
          <Icon name="Check" size={12} color="#E8591A" />
          <Text style={{ color: '#E8591A', fontSize: 12, fontWeight: '600' }}>KFL Vérifié</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
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
            {MENU_SECTIONS.map((section, si) => (
              <View key={si} style={{ marginBottom: 24 }}>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 17, color: '#2C1810', marginBottom: 12 }}>
                  {section.title}
                </Text>
                {section.items.map((item, ii) => (
                  <View key={ii} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
                    <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {item.popular && (
                        <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#F9A825', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="Flame" size={10} color="#fff" />
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810', fontFamily: 'Inter-SemiBold', marginBottom: 2 }}>{item.name}</Text>
                      {item.desc ? <Text style={{ fontSize: 11, color: '#8C8278' }}>{item.desc}</Text> : null}
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810', fontFamily: 'Inter-Bold' }}>
                        {Number(item.price).toLocaleString()} XAF
                      </Text>
                      <TouchableOpacity
                        onPress={() => addToCart(item.name)}
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
            <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E0D8', padding: 20, flexDirection: 'row', alignItems: 'center', gap: 20, ...SHADOW_SM }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 48, color: '#2C1810', lineHeight: 52 }}>4.8</Text>
                <Stars rating={5} />
                <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 4 }}>127 avis</Text>
              </View>
              <View style={{ flex: 1, gap: 5 }}>
                {[5, 4, 3, 2, 1].map(s => (
                  <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 11, color: '#8C8278', width: 8 }}>{s}</Text>
                    <Text style={{ color: '#F9A825', fontSize: 11 }}>★</Text>
                    <View style={{ flex: 1, height: 6, backgroundColor: '#F5F0EB', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: 6, borderRadius: 3, backgroundColor: '#F9A825', width: s === 5 ? '75%' : s === 4 ? '18%' : s === 3 ? '5%' : '2%' }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Write review */}
            <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E0D8', padding: 16, gap: 12, ...SHADOW_SM }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810', fontFamily: 'Inter-Bold' }}>Votre avis</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <TouchableOpacity key={s} onPress={() => setMyRating(s)}>
                    <Text style={{ fontSize: 30, color: s <= myRating ? '#F9A825' : '#E5E0D8' }}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Partagez votre expérience..."
                placeholderTextColor="#8C8278"
                multiline
                style={{ minHeight: 80, backgroundColor: '#F5F0EB', borderRadius: 12, padding: 12, fontSize: 13, color: '#2C1810', textAlignVertical: 'top', lineHeight: 20 }}
              />
              <TouchableOpacity
                style={{ height: 44, borderRadius: 22, backgroundColor: myRating > 0 && reviewText.length > 5 ? '#E8591A' : '#E5E0D8', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
                disabled={myRating === 0 || reviewText.length <= 5}
              >
                <Icon name="Send" size={15} color={myRating > 0 && reviewText.length > 5 ? '#fff' : '#8C8278'} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: myRating > 0 && reviewText.length > 5 ? '#fff' : '#8C8278' }}>Publier</Text>
              </TouchableOpacity>
            </View>

            {REVIEWS.map((r, i) => (
              <View key={i} style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E0D8', padding: 16, gap: 10, ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{r.avatar}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810', fontFamily: 'Inter-Bold' }}>{r.author}</Text>
                    <Text style={{ fontSize: 11, color: '#8C8278' }}>{r.date}</Text>
                  </View>
                  <Stars rating={r.rating} />
                </View>
                <Text style={{ fontSize: 13, color: '#6D4C41', lineHeight: 20 }}>{r.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── INFOS ── */}
        {activeTab === 'info' && (
          <View style={{ padding: 20, gap: 12 }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
              {([
                { icon: 'MapPin' as const, label: 'Adresse',    value: 'Rue Joffre, Akwa · Douala, Cameroun' },
                { icon: 'Phone'  as const, label: 'Téléphone',  value: '+237 6 99 88 77 66' },
                { icon: 'Globe'  as const, label: 'Site web',   value: 'www.chezmamapauline.cm' },
              ]).map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: i < 2 ? 1 : 0, borderColor: '#F5F0EB' }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={item.icon} size={17} color="#E8591A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: '#8C8278', marginBottom: 1 }}>{item.label}</Text>
                    <Text style={{ fontSize: 13, color: '#2C1810', fontWeight: '500' }}>{item.value}</Text>
                  </View>
                  <Icon name="ChevronRight" size={16} color="#8C8278" />
                </View>
              ))}
            </View>

            <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E0D8', padding: 18, ...SHADOW_SM }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Clock" size={17} color="#E8591A" />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#2C1810', fontFamily: 'Inter-Bold' }}>Horaires</Text>
              </View>
              {HOURS.map((h, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: i < HOURS.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
                  <Text style={{ fontSize: 13, color: h.today ? '#E8591A' : '#6D4C41', fontWeight: h.today ? '700' : '400' }}>{h.day}</Text>
                  <Text style={{ fontSize: 13, color: h.h === 'Fermé' ? '#C62828' : '#2C1810', fontWeight: h.today ? '700' : '400' }}>{h.h}</Text>
                </View>
              ))}
            </View>

            <View style={{ backgroundColor: '#FEF0E8', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(232,89,26,0.2)', padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Check" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#E8591A', fontFamily: 'Inter-Bold', marginBottom: 2 }}>Restaurant KFL Vérifié</Text>
                <Text style={{ fontSize: 12, color: '#6D4C41', lineHeight: 18 }}>
                  Cuisine authentiquement camerounaise, évaluée et certifiée par l'équipe KFL.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── PHOTOS ── */}
        {activeTab === 'photos' && (
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 14, color: '#8C8278' }}>24 photos</Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#E8591A' }}>
                <Icon name="Plus" size={14} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: 'Inter-Bold' }}>Ajouter</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <View key={i} style={{ width: '31%', aspectRatio: 1, backgroundColor: '#F5F0EB', borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Camera" size={20} color="rgba(140,130,120,0.4)" />
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 14, paddingBottom: 28, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E0D8', flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={{ flex: 1, height: 52, borderWidth: 2, borderColor: '#E8591A', borderRadius: 26, alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#E8591A', fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
            {t('restaurant.reserve', 'Réserver')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
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
