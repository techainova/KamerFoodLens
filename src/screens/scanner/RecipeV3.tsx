import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const TOTAL_STEPS   = 8;
const CURRENT_STEP  = 3;
const STEP_CHIPS    = ["300g pâte d'arachide", "2 verres d'eau chaude"];

export default function RecipeV3() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [timerStarted, setTimerStarted] = useState(false);
  const progress = CURRENT_STEP / TOTAL_STEPS;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink, lineHeight: 22 }}>Mode cuisson</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>Cook mode</Text>
        </View>
        <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="X" size={16} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

        {/* Progress */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.inkMute }}>ÉTAPE {CURRENT_STEP} / {TOTAL_STEPS}</Text>
          <View style={{ flex: 1, height: 4, backgroundColor: '#E5E0D8', borderRadius: 2, overflow: 'hidden' }}>
            <View style={{ height: '100%', backgroundColor: '#E8591A', borderRadius: 2, width: `${progress * 100}%` }} />
          </View>
        </View>

        {/* Step image */}
        <View style={{ height: 176, backgroundColor: C.surface2, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon name="ChefHat" size={48} color="rgba(140,130,120,0.25)" />
          <Text style={{ fontSize: 12, color: C.inkMute, fontStyle: 'italic', marginTop: 8 }}>image étape 3</Text>
        </View>

        {/* Step title */}
        <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, lineHeight: 28, marginBottom: 2 }}>Ajoutez la pâte d'arachide</Text>
        <Text style={{ fontSize: 12, fontStyle: 'italic', color: C.inkMute, marginBottom: 12 }}>Add the peanut paste</Text>

        <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22, marginBottom: 16 }}>
          Diluez 300g de pâte d'arachide dans 2 verres d'eau chaude. Versez doucement sur les feuilles cuites et remuez constamment pour éviter les grumeaux.
        </Text>

        {/* Timer */}
        <View style={{ padding: 14, borderRadius: 12, backgroundColor: C.goldSoft, borderWidth: 1, borderColor: '#E8591A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#E8591A', textTransform: 'uppercase', letterSpacing: 0.8 }}>MINUTEUR / TIMER</Text>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#E8591A', fontFamily: 'PlayfairDisplay-Bold' }}>20:00</Text>
          </View>
          <TouchableOpacity style={{ height: 48, paddingHorizontal: 16, backgroundColor: '#E8591A', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => setTimerStarted(!timerStarted)}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{timerStarted ? 'Pause' : 'Démarrer'}</Text>
          </TouchableOpacity>
        </View>

        {/* Chips */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>POUR CETTE ÉTAPE / FOR THIS STEP</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {STEP_CHIPS.map(chip => (
            <View key={chip} style={{ height: 30, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: C.inkSoft, fontWeight: '500' }}>{chip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', gap: 8, backgroundColor: C.cream, borderTopWidth: 1, borderColor: C.border }}>
        <TouchableOpacity style={{ flex: 1, height: 48, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
          <Icon name="ArrowLeft" size={16} color="#6D4C41" />
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.inkSoft }}>Précédent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, height: 48, backgroundColor: '#E8591A', borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }} activeOpacity={0.85}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Suivant</Text>
          <Icon name="ArrowRight" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
