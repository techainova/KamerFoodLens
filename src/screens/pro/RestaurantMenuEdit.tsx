import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

export default function RestaurantMenuEdit() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [name, setName] = useState('Ndolé traditionnel');
  const [desc, setDesc] = useState('Poisson fumé, crevettes, pâte d\'arachide maison');
  const [price, setPrice] = useState('4500');
  const [category, setCategory] = useState('Plats principaux');

  const fields = [
    { l: 'Nom du plat', v: name,     s: setName,    p: 'Ndolé traditionnel...' },
    { l: 'Catégorie',   v: category, s: setCategory, p: 'Plats, Entrées, Desserts...' },
    { l: 'Prix (XAF)',  v: price,    s: setPrice,    p: '4500', keyboard: 'numeric' as const },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Modifier le plat</Text>
        <TouchableOpacity style={{ height: 32, paddingHorizontal: 14, backgroundColor: '#F9A825', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Photo area */}
        <TouchableOpacity style={{ height: 160, backgroundColor: C.surface2, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon name="Camera" size={32} color="rgba(140,130,120,0.4)" />
          <Text style={{ color: C.inkMute, fontSize: 14, marginTop: 8 }}>Ajouter une photo</Text>
        </TouchableOpacity>

        {/* Fields */}
        {fields.map((f, i) => (
          <View key={i} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{f.l}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
              <TextInput
                value={f.v} onChangeText={f.s} placeholder={f.p} placeholderTextColor="#8C8278"
                style={{ fontSize: 14, color: C.ink }} keyboardType={f.keyboard}
              />
            </View>
          </View>
        ))}

        {/* Description */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Description</Text>
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, paddingVertical: 12, minHeight: 90 }}>
            <TextInput
              value={desc} onChangeText={setDesc} multiline numberOfLines={3}
              style={{ fontSize: 14, color: C.ink }}
            />
          </View>
        </View>

        <TouchableOpacity style={{ height: 44, borderWidth: 1, borderColor: '#C6282830', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#C62828' }}>Supprimer ce plat</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
