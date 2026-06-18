import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon, { type IconName } from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const CATEGORIES = ['Tous', 'Cuisson', 'Culture', 'Communauté', 'Pro', 'Exploration'];

const BADGES: { id: string; name: string; desc: string; icon: IconName; color: string; category: string; unlocked: boolean; xp: number }[] = [
  { id: 'b1',  name: 'Premier scan', desc: 'Scannez votre premier plat', icon: 'Camera',         color: '#E8591A', category: 'Exploration', unlocked: true,  xp: 50  },
  { id: 'b2',  name: 'Chef curieux',  desc: 'Scannez 10 plats différents', icon: 'Search',       color: '#2E7D32', category: 'Exploration', unlocked: true,  xp: 100 },
  { id: 'b3',  name: 'Maître Ndolé',  desc: 'Réussissez la recette du Ndolé', icon: 'ChefHat',  color: '#E8591A', category: 'Cuisson',    unlocked: true,  xp: 200 },
  { id: 'b4',  name: 'Flamme vive',   desc: 'Participez à 5 défis rapides', icon: 'Flame',       color: '#F9A825', category: 'Cuisson',    unlocked: true,  xp: 150 },
  { id: 'b5',  name: 'Historien',     desc: 'Lisez 5 fiches culturelles', icon: 'Globe',         color: '#1A237E', category: 'Culture',    unlocked: true,  xp: 100 },
  { id: 'b6',  name: 'Voyageur',      desc: 'Explorez 5 régions', icon: 'Navigation',            color: '#2E7D32', category: 'Exploration', unlocked: true,  xp: 200 },
  { id: 'b7',  name: 'Social',        desc: 'Faites 3 publications', icon: 'Share2',             color: '#E8591A', category: 'Communauté', unlocked: true,  xp: 75  },
  { id: 'b8',  name: 'Forum actif',   desc: 'Répondez à 10 discussions', icon: 'MessageCircle', color: '#2E7D32', category: 'Communauté', unlocked: true,  xp: 150 },
  { id: 'b9',  name: 'Collectionneur', desc: 'Sauvegardez 20 recettes', icon: 'Bookmark',       color: '#F9A825', category: 'Cuisson',    unlocked: true,  xp: 100 },
  { id: 'b10', name: 'Pro débutant',   desc: 'Passez au statut Pro', icon: 'Award',              color: '#F9A825', category: 'Pro',        unlocked: true,  xp: 500 },
  { id: 'b11', name: 'Formateur',      desc: 'Créez votre première formation', icon: 'GraduationCap', color: '#F9A825', category: 'Pro',   unlocked: true,  xp: 300 },
  { id: 'b12', name: 'Top chef',       desc: 'Atteignez le niveau Chef Maître', icon: 'Trophy',  color: '#F9A825', category: 'Pro',        unlocked: true,  xp: 1000 },
  // Locked badges
  { id: 'b13', name: 'Encyclopédie', desc: 'Lisez 50 fiches culturelles', icon: 'FileText',     color: '#8C8278', category: 'Culture',    unlocked: false, xp: 500  },
  { id: 'b14', name: 'Légende',       desc: 'Atteignez le niveau Légende', icon: 'Star',         color: '#8C8278', category: 'Pro',        unlocked: false, xp: 2000 },
  { id: 'b15', name: 'Grand Voyageur', desc: 'Explorez toutes les 10 régions', icon: 'Globe',   color: '#8C8278', category: 'Exploration', unlocked: false, xp: 400  },
  { id: 'b16', name: 'Influenceur',    desc: 'Gagnez 500 abonnés', icon: 'Users',               color: '#8C8278', category: 'Communauté', unlocked: false, xp: 600  },
  { id: 'b17', name: 'Épicurien',      desc: 'Scannez 100 plats', icon: 'ScanLine',             color: '#8C8278', category: 'Exploration', unlocked: false, xp: 300  },
  { id: 'b18', name: 'Maître absolu',  desc: 'Obtenez 10 000 XP', icon: 'Sparkles',             color: '#8C8278', category: 'Pro',        unlocked: false, xp: 1500 },
];

export default function Badges() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedBadge, setSelectedBadge] = useState<(typeof BADGES)[0] | null>(null);

  const filtered = BADGES.filter(b => activeCategory === 'Tous' || b.category === activeCategory);
  const unlocked = BADGES.filter(b => b.unlocked).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Badges</Text>
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#E8591A15' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>{unlocked}/{BADGES.length}</Text>
        </View>
      </View>

      {/* Progress banner */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 13, color: C.inkSoft }}>{unlocked} badges débloqués sur {BADGES.length}</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#E8591A' }}>{Math.round((unlocked / BADGES.length) * 100)}%</Text>
        </View>
        <View style={{ height: 6, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${(unlocked / BADGES.length) * 100}%`, backgroundColor: '#E8591A', borderRadius: 3 }} />
        </View>
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }} style={{ backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: cat === activeCategory ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: cat === activeCategory ? '#E8591A' : '#E5E0D8' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: cat === activeCategory ? '#fff' : '#6D4C41' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {filtered.map(badge => (
            <TouchableOpacity
              key={badge.id}
              onPress={() => setSelectedBadge(badge)}
              style={{ width: '30%', alignItems: 'center', gap: 6 }}
              activeOpacity={0.8}
            >
              <View style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: badge.unlocked ? badge.color + '15' : '#F5F0EB',
                borderWidth: 2,
                borderColor: badge.unlocked ? badge.color + '50' : '#E5E0D8',
                alignItems: 'center', justifyContent: 'center',
                ...SHADOW_SM,
              }}>
                <Icon name={badge.icon} size={28} color={badge.unlocked ? badge.color : '#C4BDB7'} fill="none" />
                {!badge.unlocked && (
                  <View style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#E5E0D8', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="Lock" size={10} color="#8C8278" />
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 11, fontWeight: badge.unlocked ? '600' : '400', color: badge.unlocked ? '#2C1810' : '#8C8278', textAlign: 'center' }} numberOfLines={2}>
                {badge.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Badge detail modal */}
      <Modal visible={!!selectedBadge} transparent animationType="fade" onRequestClose={() => setSelectedBadge(null)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }} activeOpacity={1} onPress={() => setSelectedBadge(null)}>
          {selectedBadge && (
            <TouchableOpacity activeOpacity={1} style={{ width: '80%', backgroundColor: C.surface, borderRadius: 24, padding: 28, alignItems: 'center', ...SHADOW_SM }}>
              <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: selectedBadge.unlocked ? selectedBadge.color + '15' : '#F5F0EB', borderWidth: 3, borderColor: selectedBadge.unlocked ? selectedBadge.color + '50' : '#E5E0D8', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon name={selectedBadge.icon} size={36} color={selectedBadge.unlocked ? selectedBadge.color : '#C4BDB7'} />
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: selectedBadge.unlocked ? '#E3F0E4' : '#F5F0EB', marginBottom: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: selectedBadge.unlocked ? '#2E7D32' : '#8C8278', textTransform: 'uppercase' }}>
                  {selectedBadge.unlocked ? 'Débloqué' : 'Non débloqué'} · {selectedBadge.category}
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8, textAlign: 'center' }}>{selectedBadge.name}</Text>
              <Text style={{ fontSize: 13, color: C.inkSoft, textAlign: 'center', lineHeight: 20, marginBottom: 16 }}>{selectedBadge.desc}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="Zap" size={14} color="#F9A825" fill="#F9A825" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#F9A825' }}>+{selectedBadge.xp} XP</Text>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
