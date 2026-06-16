import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const FEATURED_ORGS = [
  { name: 'Chez Mama Pauline', type: 'Restaurant', rating: '4.8', open: true  },
  { name: 'Chef Joël Academy', type: 'Formation',   rating: '4.9', open: true  },
  { name: 'Kmer Saveurs',      type: 'Street food', rating: '4.3', open: false },
];

const POPULAR = ['Ndolé traditionnel', 'Poulet DG', 'Eru & Fufu'];

export default function HomeProAware() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>KmerFoodLens</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bell" size={18} color="#6D4C41" />
          </TouchableOpacity>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>S</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Hero scan CTA */}
        <View style={{ marginHorizontal: 16, marginTop: 16, padding: 20, borderRadius: 24, backgroundColor: '#2C1810' }}>
          <Text style={{ color: '#E8591A', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>Scanner un plat</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 28, marginBottom: 16 }}>Découvrez la cuisine{'\n'}camerounaise</Text>
          <TouchableOpacity style={{ height: 44, backgroundColor: '#E8591A', borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 20 }} activeOpacity={0.85}>
            <Icon name="Camera" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Scanner maintenant</Text>
          </TouchableOpacity>
        </View>

        {/* Pro featured orgs */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810' }}>Organisateurs à la une</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ backgroundColor: '#F9A825', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>PRO</Text>
                </View>
                <Text style={{ fontSize: 12, color: '#8C8278' }}>partenaires certifiés</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#E8591A' }}>Voir tout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
            {FEATURED_ORGS.map((org, i) => (
              <TouchableOpacity key={i} style={{ width: 176, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_MD }}>
                <View style={{ height: 96, backgroundColor: '#F5F0EB', borderBottomWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ChefHat" size={36} color="rgba(140,130,120,0.35)" />
                  <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#F9A825', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>PRO</Text>
                  </View>
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810' }}>{org.name}</Text>
                  <Text style={{ fontSize: 12, color: '#8C8278' }}>{org.type}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Icon name="Star" size={12} color="#F9A825" fill="#F9A825" />
                      <Text style={{ fontSize: 12, color: '#F9A825', fontWeight: '600' }}>{org.rating}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, backgroundColor: org.open ? '#E3F0E4' : '#FBDCDC' }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: org.open ? '#2E7D32' : '#C62828' }}>
                        {org.open ? 'Ouvert' : 'Fermé'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Popular recipes */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810' }}>Recettes populaires</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#E8591A' }}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {POPULAR.map((name, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
              <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChefHat" size={22} color="rgba(140,130,120,0.35)" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{name}</Text>
                <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 2 }}>Littoral · Cameroun</Text>
                <View style={{ flexDirection: 'row', gap: 2, marginTop: 3 }}>
                  {[1,2,3,4,5].map(s => <Icon key={s} name="Star" size={11} color="#F9A825" fill="#F9A825" />)}
                </View>
              </View>
              <Icon name="ChevronRight" size={18} color="#8C8278" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
