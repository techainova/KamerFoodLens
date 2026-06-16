import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const INGREDIENTS = [
  { qty: '500g', name: 'Feuilles de ndolé fraîches', en: 'Fresh ndolé leaves' },
  { qty: '300g', name: "Pâte d'arachide",           en: 'Peanut paste' },
  { qty: '400g', name: 'Poisson fumé',               en: 'Smoked fish' },
  { qty: '200g', name: 'Viande de bœuf',             en: 'Beef' },
  { qty: '4',    name: 'Crevettes séchées',           en: 'Dried shrimps' },
  { qty: '1',    name: 'Oignon',                      en: 'Onion' },
  { qty: '3',    name: "Gousses d'ail",               en: 'Garlic cloves' },
  { qty: '50ml', name: 'Huile de palme',              en: 'Palm oil' },
];

const STEPS = [
  { n: 1, text: "Laver et blanchir les feuilles de ndolé dans de l'eau bouillante 3 minutes. Égoutter et presser pour enlever l'amertume.", timer: '3 min' },
  { n: 2, text: "Dans une casserole, faire revenir l'oignon et l'ail émincés dans l'huile de palme à feu moyen.", timer: '5 min' },
  { n: 3, text: "Ajouter la viande coupée en morceaux, saler, poivrer. Faire dorer puis couvrir d'eau à mi-hauteur.", timer: '20 min' },
  { n: 4, text: "Incorporer la pâte d'arachide délayée dans un peu d'eau tiède. Mélanger soigneusement.", timer: '' },
  { n: 5, text: "Ajouter le poisson fumé émietté, les crevettes séchées et les feuilles de ndolé. Laisser mijoter.", timer: '25 min' },
  { n: 6, text: "Ajuster l'assaisonnement. Servir chaud avec du plantain mûr frit ou du riz.", timer: '' },
];

const NUTRITION = [
  { label: 'Calories', value: '420', unit: 'kcal', color: '#E8591A', pct: 72 },
  { label: 'Protéines', value: '32', unit: 'g', color: '#2E7D32', pct: 65 },
  { label: 'Lipides', value: '24', unit: 'g', color: '#F9A825', pct: 48 },
  { label: 'Glucides', value: '18', unit: 'g', color: '#1A237E', pct: 30 },
  { label: 'Fibres', value: '6', unit: 'g', color: '#2E7D32', pct: 24 },
];

const REVIEWS = [
  { author: 'Amah N.', rating: 5, text: "Recette authentique ! J'ai suivi à la lettre et c'était délicieux.", date: 'il y a 2 jours', avatar: 'AN' },
  { author: 'Patrick K.', rating: 4, text: "Très bon, j'aurais mis un peu plus de piment. Mais la texture des feuilles est parfaite.", date: 'il y a 1 semaine', avatar: 'PK' },
  { author: 'Marie T.', rating: 5, text: "Mon plat préféré ! Félicitations pour la qualité de la recette.", date: 'il y a 2 semaines', avatar: 'MT' },
];

const TAB_KEYS = ['ingredients', 'steps', 'nutrition', 'reviews'] as const;
type TabKey = typeof TAB_KEYS[number];

export default function RecipeV1() {
  const { t } = useTranslation();
  const nav = useNavigation();
  const [activeTab, setActiveTab] = useState<TabKey>('ingredients');
  const [portions, setPortions] = useState(4);
  const [checked, setChecked] = useState<Set<number>>(new Set([2, 5]));
  const [reviewText, setReviewText] = useState('');
  const [myRating, setMyRating] = useState(0);

  const toggleCheck = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i); else next.add(i);
    setChecked(next);
  };

  const TAB_LABELS: Record<TabKey, string> = {
    ingredients: t('recipe.ingredients'),
    steps:       t('recipe.steps'),
    nutrition:   t('recipe.nutrition'),
    reviews:     t('recipe.reviews'),
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <TouchableOpacity
          style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
          onPress={() => nav.goBack()}
        >
          <Icon name="ArrowLeft" size={17} color="#6D4C41" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: '#2C1810', fontFamily: 'Inter-Bold' }}>
          {t('recipe.title')}
        </Text>
        <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Share2" size={16} color="#6D4C41" />
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Bookmark" size={16} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

        {/* Video / Hero */}
        <View style={{ margin: 16, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
          <View style={{ height: 200, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ChefHat" size={50} color="#E5E0D8" />
            <Text style={{ color: '#8C8278', fontSize: 11, marginTop: 8, fontStyle: 'italic' }}>vidéo recette · 7:45</Text>
          </View>
          {/* Play button */}
          <TouchableOpacity style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 }}>
              <Icon name="PlayCircle" size={30} color="#fff" fill="#E8591A" />
            </View>
          </TouchableOpacity>
          {/* Duration */}
          <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>7:45</Text>
          </View>
          {/* TTS button */}
          <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Volume2" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title + Meta */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: '#2C1810', lineHeight: 30 }}>
            Ndolé traditionnel
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="Clock" size={13} color="#8C8278" />
              <Text style={{ color: '#8C8278', fontSize: 12 }}>1h 30min</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="BarChart2" size={13} color="#8C8278" />
              <Text style={{ color: '#8C8278', fontSize: 12 }}>{t('recipe.medium')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              {[1,2,3,4,5].map(s => (
                <Text key={s} style={{ color: '#F9A825', fontSize: 12 }}>★</Text>
              ))}
              <Text style={{ color: '#8C8278', fontSize: 12, marginLeft: 4 }}>(312)</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="MapPin" size={13} color="#8C8278" />
              <Text style={{ color: '#8C8278', fontSize: 12 }}>Littoral</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', marginTop: 12 }}>
          {TAB_KEYS.map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveTab(key)}
              style={{ flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === key ? '#E8591A' : 'transparent' }}
            >
              <Text style={{ fontSize: 12, fontWeight: activeTab === key ? '700' : '500', color: activeTab === key ? '#E8591A' : '#8C8278' }}>
                {TAB_LABELS[key]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>

          {/* ── INGRÉDIENTS ── */}
          {activeTab === 'ingredients' && (
            <>
              {/* Portions stepper */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810', fontFamily: 'Inter-SemiBold' }}>
                  {t('recipe.servings')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 24, overflow: 'hidden' }}>
                  <TouchableOpacity
                    onPress={() => setPortions(Math.max(1, portions - 1))}
                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#E8591A', fontWeight: '700', fontSize: 20 }}>−</Text>
                  </TouchableOpacity>
                  <View style={{ width: 44, height: 38, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#2C1810', fontWeight: '700', fontSize: 15 }}>{portions}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPortions(portions + 1)}
                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#E8591A', fontWeight: '700', fontSize: 20 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Ingredient list */}
              <View style={{ gap: 2 }}>
                {INGREDIENTS.map((item, i) => {
                  const isChecked = checked.has(i);
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => toggleCheck(i)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F5F0EB' }}
                      activeOpacity={0.7}
                    >
                      <View style={{ width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: isChecked ? '#2E7D32' : 'transparent', borderWidth: isChecked ? 0 : 1.5, borderColor: '#E5E0D8', flexShrink: 0 }}>
                        {isChecked && <Icon name="Check" size={14} color="#fff" strokeWidth={2.5} />}
                      </View>
                      <Text style={{ width: 48, fontSize: 13, fontWeight: '700', color: '#E8591A' }}>{item.qty}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, color: isChecked ? '#8C8278' : '#2C1810', textDecorationLine: isChecked ? 'line-through' : 'none' }}>
                          {item.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#8C8278', fontStyle: 'italic' }}>{item.en}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* ── ÉTAPES ── */}
          {activeTab === 'steps' && (
            <View style={{ gap: 16 }}>
              {STEPS.map((step) => (
                <View key={step.n} style={{ flexDirection: 'row', gap: 14 }}>
                  {/* Step number */}
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{step.n}</Text>
                  </View>
                  {/* Content */}
                  <View style={{ flex: 1, paddingBottom: 16, borderBottomWidth: step.n < STEPS.length ? 1 : 0, borderColor: '#F5F0EB' }}>
                    {/* Step image slot */}
                    <View style={{ height: 120, backgroundColor: '#F5F0EB', borderRadius: 12, marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="ChefHat" size={30} color="#E5E0D8" />
                    </View>
                    <Text style={{ fontSize: 14, color: '#2C1810', lineHeight: 22 }}>{step.text}</Text>
                    {step.timer && (
                      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#FEF0E8', borderWidth: 1, borderColor: '#E8591A' }}>
                        <Icon name="Clock" size={14} color="#E8591A" />
                        <Text style={{ color: '#E8591A', fontSize: 12, fontWeight: '700' }}>{step.timer}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── NUTRITION ── */}
          {activeTab === 'nutrition' && (
            <View style={{ gap: 16 }}>
              {/* Calorie circle */}
              <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                <View style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 8, borderColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: '#2C1810' }}>420</Text>
                  <Text style={{ fontSize: 11, color: '#8C8278' }}>kcal</Text>
                </View>
                <Text style={{ color: '#8C8278', fontSize: 12, marginTop: 8 }}>par portion · {t('recipe.servings')}: {portions}</Text>
              </View>

              {/* Macros */}
              {NUTRITION.slice(1).map((n) => (
                <View key={n.label}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: '#2C1810', fontWeight: '500' }}>{n.label}</Text>
                    <Text style={{ fontSize: 14, color: '#2C1810', fontWeight: '700' }}>{n.value}{n.unit}</Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: '#F5F0EB', borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{ height: 8, width: `${n.pct}%`, backgroundColor: n.color, borderRadius: 4 }} />
                  </View>
                </View>
              ))}

              {/* Vitamins note */}
              <View style={{ backgroundColor: '#E3F0E4', padding: 14, borderRadius: 14, marginTop: 4 }}>
                <Text style={{ color: '#2E7D32', fontSize: 13, fontWeight: '600' }}>✓ Riche en vitamines A, C, K</Text>
                <Text style={{ color: '#2E7D32', fontSize: 12, marginTop: 2 }}>Source de protéines complètes · Faible en glucides</Text>
              </View>
            </View>
          )}

          {/* ── AVIS ── */}
          {activeTab === 'reviews' && (
            <View style={{ gap: 16 }}>
              {/* Summary */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 42, color: '#2C1810' }}>4.8</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[1,2,3,4,5].map(s => (
                      <Text key={s} style={{ color: '#F9A825', fontSize: 14 }}>★</Text>
                    ))}
                  </View>
                  <Text style={{ color: '#8C8278', fontSize: 11 }}>312 avis</Text>
                </View>
                <View style={{ flex: 1, gap: 5 }}>
                  {[5,4,3,2,1].map((s) => (
                    <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ color: '#8C8278', fontSize: 11, width: 8 }}>{s}</Text>
                      <View style={{ flex: 1, height: 6, backgroundColor: '#F5F0EB', borderRadius: 3, overflow: 'hidden' }}>
                        <View style={{ height: 6, width: `${s === 5 ? 75 : s === 4 ? 18 : s === 3 ? 5 : 2}%`, backgroundColor: '#F9A825', borderRadius: 3 }} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Write review */}
              <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>Votre avis</Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {[1,2,3,4,5].map(s => (
                    <TouchableOpacity key={s} onPress={() => setMyRating(s)}>
                      <Text style={{ fontSize: 24, color: s <= myRating ? '#F9A825' : '#E5E0D8' }}>★</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={{ height: 80, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 12, padding: 12, fontSize: 13, color: '#2C1810', textAlignVertical: 'top' }}
                  placeholder="Partagez votre expérience..."
                  placeholderTextColor="#8C8278"
                  value={reviewText}
                  onChangeText={setReviewText}
                  multiline
                />
                <TouchableOpacity style={{ height: 44, backgroundColor: reviewText.length > 3 ? '#E8591A' : '#E5E0D8', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Publier</Text>
                </TouchableOpacity>
              </View>

              {/* Reviews list */}
              {REVIEWS.map((r, i) => (
                <View key={i} style={{ gap: 10, paddingTop: 14, borderTopWidth: 1, borderColor: '#F5F0EB' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{r.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810' }}>{r.author}</Text>
                      <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                        {[1,2,3,4,5].map(s => (
                          <Text key={s} style={{ color: s <= r.rating ? '#F9A825' : '#E5E0D8', fontSize: 11 }}>★</Text>
                        ))}
                        <Text style={{ color: '#8C8278', fontSize: 11 }}> · {r.date}</Text>
                      </View>
                    </View>
                    <TouchableOpacity>
                      <Icon name="ThumbsUp" size={16} color="#8C8278" />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ fontSize: 13, color: '#6D4C41', lineHeight: 20 }}>{r.text}</Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 24, backgroundColor: '#FFFAF5', borderTopWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity
          style={{ height: 52, backgroundColor: '#E8591A', borderRadius: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          activeOpacity={0.85}
        >
          <Icon name="Package" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
            {t('recipe.addToShopping')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
