import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import type { IconName } from '@/components/ui/Icon';

const FOUND = { fr: 'Ndolé', region: 'Littoral', conf: 87 };

const INFO_ITEMS: { fr: string; en: string; icon: IconName }[] = [
  { fr: 'Histoire & Origine',     en: 'History & origin',    icon: 'BookOpen'    },
  { fr: 'Ingrédients clés',       en: 'Key ingredients',     icon: 'List'        },
  { fr: 'Recette détaillée',      en: 'Full recipe',         icon: 'FileText'    },
  { fr: 'Restaurants à proximité', en: 'Nearby restaurants', icon: 'MapPin'      },
  { fr: 'Valeur nutritionnelle',   en: 'Nutrition info',     icon: 'BarChart2'   },
];

export default function ResultV3() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const circumference = 2 * Math.PI * 26;
  const offset = circumference * (1 - FOUND.conf / 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink, lineHeight: 22 }}>Analyse</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>Analysis</Text>
        </View>
        <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="MoreHorizontal" size={18} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Top: image + name + confidence ring */}
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 16 }}>
          <View style={{ width: 88, height: 88, backgroundColor: C.surface2, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ChefHat" size={36} color="rgba(140,130,120,0.35)" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1 }}>Identifié</Text>
            <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, lineHeight: 28 }}>{FOUND.fr}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{FOUND.region} · Cameroun</Text>
          </View>
          {/* Confidence ring */}
          <View style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={64} height={64} viewBox="0 0 64 64">
              <Circle cx={32} cy={32} r={26} fill="none" stroke="#E5E0D8" strokeWidth={6} />
              <Circle
                cx={32} cy={32} r={26}
                fill="none" stroke="#2E7D32" strokeWidth={6}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
            </Svg>
            <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#2E7D32' }}>{FOUND.conf}%</Text>
            </View>
          </View>
        </View>

        {/* Info cards */}
        <View style={{ gap: 8, marginBottom: 18 }}>
          {INFO_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={18} color="#6D4C41" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{item.fr}</Text>
                <Text style={{ fontSize: 12, fontStyle: 'italic', color: C.inkMute }}>{item.en}</Text>
              </View>
              <Icon name="ChevronRight" size={16} color="#8C8278" />
            </TouchableOpacity>
          ))}
        </View>

        {/* CTAs */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={{ flex: 1, height: 48, backgroundColor: '#E8591A', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Recette</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, height: 48, borderWidth: 2, borderColor: '#2E7D32', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#2E7D32' }}>Partager</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
