import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const STEPS = ['Infos', 'Contenu', 'Prix', 'Aperçu'];
const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé'];

export default function CreateCourse() {
  const navigation = useNavigation<any>();
  const [step] = useState(1);
  const [courseTitle, setCourseTitle] = useState('Maîtrisez le Ndolé');
  const [level, setLevel] = useState(1);
  const [lessons, setLessons] = useState(['Introduction', 'Les ingrédients', 'La préparation']);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Créer une formation</Text>
      </View>

      {/* Stepper */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        {STEPS.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: i === step ? '#F9A825' : i < step ? '#2E7D32' : '#E5E0D8' }}>
              {i < step
                ? <Icon name="Check" size={14} color="#fff" />
                : <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{i + 1}</Text>
              }
            </View>
            {i < STEPS.length - 1 && <View style={{ flex: 1, height: 2, marginHorizontal: 4, backgroundColor: i < step ? '#2E7D32' : '#E5E0D8' }} />}
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 16 }}>Contenu de la formation</Text>

        {/* Title */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Titre</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, justifyContent: 'center' }}>
            <TextInput value={courseTitle} onChangeText={setCourseTitle} style={{ fontSize: 14, color: '#2C1810' }} />
          </View>
        </View>

        {/* Level */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Niveau</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {LEVELS.map((l, i) => (
              <TouchableOpacity key={i} onPress={() => setLevel(i)}
                style={{ flex: 1, height: 40, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: level === i ? '#FBF3DC' : '#fff', borderColor: level === i ? '#F9A825' : '#E5E0D8' }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: level === i ? '#F9A825' : '#6D4C41' }}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lessons */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8 }}>Leçons ({lessons.length})</Text>
            <TouchableOpacity
              onPress={() => setLessons([...lessons, `Leçon ${lessons.length + 1}`])}
              style={{ height: 28, paddingHorizontal: 12, backgroundColor: '#F9A825', borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
              <Icon name="Plus" size={12} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Ajouter</Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
            {lessons.map((lesson, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < lessons.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#6D4C41', fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{lesson}</Text>
                <Icon name="Menu" size={16} color="#8C8278" />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <TouchableOpacity style={{ flex: 1, height: 44, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#6D4C41' }}>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 2, height: 44, backgroundColor: '#F9A825', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
