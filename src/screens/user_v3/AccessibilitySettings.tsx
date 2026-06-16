import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const TEXT_SIZES    = ['Petit', 'Normal', 'Grand', 'Très grand'];
const CONTRAST_MODES = ['Standard', 'Élevé', 'Maximum'];

export default function AccessibilitySettings() {
  const navigation = useNavigation<any>();
  const [textSize, setTextSize]       = useState(1);
  const [contrastMode, setContrastMode] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [haptics, setHaptics]         = useState(true);
  const [boldText, setBoldText]       = useState(false);

  const TOGGLES = [
    { label: 'Réduire les animations', icon: 'Pause'    as const, value: reduceMotion, set: setReduceMotion },
    { label: "Lecteur d'écran",         icon: 'Volume2'  as const, value: screenReader, set: setScreenReader },
    { label: 'Retour haptique',          icon: 'Zap'      as const, value: haptics,      set: setHaptics      },
    { label: 'Texte en gras',            icon: 'Type'     as const, value: boldText,      set: setBoldText     },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Accessibilité</Text>
        <TouchableOpacity style={{ height: 32, paddingHorizontal: 14, backgroundColor: '#E8591A', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Text size */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>Taille du texte</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {TEXT_SIZES.map((size, i) => (
            <TouchableOpacity key={i} onPress={() => setTextSize(i)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 2, alignItems: 'center', backgroundColor: i === textSize ? '#FEF3EC' : '#fff', borderColor: i === textSize ? '#E8591A' : '#E5E0D8' }}>
              <Text style={{ fontWeight: '500', fontSize: 10 + i * 3, color: i === textSize ? '#E8591A' : '#6D4C41' }}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 20, ...SHADOW_SM }}>
          <Text style={{ fontSize: 11, color: '#8C8278', marginBottom: 8 }}>Aperçu</Text>
          <Text style={{ fontWeight: '600', color: '#2C1810', fontSize: 12 + textSize * 3 }}>Ndolé traditionnel du Littoral</Text>
          <Text style={{ color: '#6D4C41', fontSize: 10 + textSize * 3, marginTop: 2 }}>Cuisine camerounaise · Région du Littoral</Text>
        </View>

        {/* Contrast mode */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>Mode contraste</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {CONTRAST_MODES.map((mode, i) => (
            <TouchableOpacity key={i} onPress={() => setContrastMode(i)}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2, alignItems: 'center', backgroundColor: i === contrastMode ? '#FEF3EC' : '#fff', borderColor: i === contrastMode ? '#E8591A' : '#E5E0D8' }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: i === contrastMode ? '#E8591A' : '#6D4C41' }}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Toggles */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>Options</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', marginBottom: 20, ...SHADOW_SM }}>
          {TOGGLES.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < TOGGLES.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={16} color="#6D4C41" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{item.label}</Text>
              <Switch value={item.value} onValueChange={item.set} trackColor={{ false: '#E5E0D8', true: '#E8591A' }} thumbColor="#fff" />
            </View>
          ))}
        </View>

        {/* Reset */}
        <TouchableOpacity style={{ height: 44, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#6D4C41' }}>Réinitialiser par défaut</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
