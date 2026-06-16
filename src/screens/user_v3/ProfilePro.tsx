import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const TABS  = ['Aperçu', 'Menu', 'Avis'];
const STATS = [
  { v: '4.8',  l: 'Note',      icon: 'Star'      as const },
  { v: '312',  l: 'Avis',      icon: 'MessageSquare' as const },
  { v: '1.4k', l: 'Suivis',    icon: 'Users'     as const },
  { v: '47',   l: 'Commandes', icon: 'ShoppingBag' as const },
];

export default function ProfilePro() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810' }}>Chez Mama Pauline</Text>
            <View style={{ backgroundColor: '#F9A825', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>PRO</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: '#8C8278' }}>@chef_mama_pauline</Text>
        </View>
        <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 18, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Settings" size={16} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Cover */}
        <View style={{ height: 144, backgroundColor: '#F5F0EB', borderBottomWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', position: 'relative' }}>
          <View style={{ position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
            <View style={{ width: 80, height: 80, borderRadius: 18, backgroundColor: '#fff', borderWidth: 2, borderColor: '#F9A825', alignItems: 'center', justifyContent: 'center', ...SHADOW_MD }}>
              <Icon name="ChefHat" size={36} color="rgba(140,130,120,0.35)" />
            </View>
            <View style={{ marginBottom: 4 }}>
              <View style={{ height: 20, paddingHorizontal: 8, backgroundColor: '#2E7D32', borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
                <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' }} />
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Ouvert</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
          <Text style={{ fontSize: 14, color: '#8C8278' }}>Cuisine camerounaise traditionnelle · Douala · Littoral</Text>

          {/* Stats row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: '#F5F0EB' }}>
            {STATS.map((s, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name={s.icon} size={14} color="#8C8278" />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1810' }}>{s.v}</Text>
                </View>
                <Text style={{ fontSize: 11, color: '#8C8278' }}>{s.l}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <TouchableOpacity style={{ flex: 1, height: 40, backgroundColor: '#E8591A', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Commander</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ height: 40, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Phone" size={18} color="#6D4C41" />
            </TouchableOpacity>
            <TouchableOpacity style={{ height: 40, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="MapPin" size={18} color="#6D4C41" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Revenue summary */}
        <View style={{ marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 18, backgroundColor: '#1A237E', marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Ce mois · Pro Dashboard</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'PlayfairDisplay-Bold' }}>195 400 XAF</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Revenus nets après commission</Text>
            </View>
            <View style={{ backgroundColor: '#2E7D32', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="TrendingUp" size={12} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>+12%</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
          {TABS.map((tab, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveTab(i)}
              style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '600' : '500', color: i === activeTab ? '#E8591A' : '#8C8278' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={{ fontSize: 14, color: '#2C1810', lineHeight: 22 }}>
              Restaurant familial spécialisé dans la cuisine camerounaise traditionnelle. Nos recettes sont transmises de génération en génération depuis Édéa.
            </Text>
          </View>
        )}

        {activeTab === 1 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
            {['Ndolé traditionnel · 4 500 XAF', 'Poulet DG · 5 500 XAF', 'Eru & Fufu · 4 000 XAF'].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8' }} />
                <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 2 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={{ fontSize: 14, color: '#8C8278' }}>312 avis · Note moyenne :</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={16} color="#F9A825" fill="#F9A825" />)}
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1810', marginLeft: 4 }}>4.8</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
