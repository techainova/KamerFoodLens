import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const TARGETS = ['Tous les utilisateurs', 'Standard seulement', 'Pro seulement', 'Segment personnalisé'];

export default function AdminPush() {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Notifications Push</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

        {/* Preview */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: '#0D0D0D', marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 10 }}>Aperçu notification</Text>
          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 14, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ChefHat" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{title || 'Titre de la notification'}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>{body || 'Texte du message...'}</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Titre</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, justifyContent: 'center' }}>
            <TextInput
              value={title} onChangeText={setTitle}
              placeholder="Ex: Nouvelle recette disponible !"
              placeholderTextColor="#8C8278"
              style={{ fontSize: 14, color: '#2C1810' }}
            />
          </View>
          <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 4, textAlign: 'right' }}>{title.length}/50</Text>
        </View>

        {/* Body */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Message</Text>
          <View style={{ borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 12, minHeight: 90 }}>
            <TextInput
              value={body} onChangeText={setBody}
              placeholder="Texte complet de la notification..."
              placeholderTextColor="#8C8278"
              multiline numberOfLines={3}
              style={{ fontSize: 14, color: '#2C1810' }}
            />
          </View>
          <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 4, textAlign: 'right' }}>{body.length}/160</Text>
        </View>

        {/* Target */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Audience cible</Text>
          <View style={{ gap: 8 }}>
            {TARGETS.map((t, i) => (
              <TouchableOpacity
                key={i} onPress={() => setTarget(i)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1.5, borderColor: target === i ? '#1A237E' : '#E5E0D8', backgroundColor: target === i ? '#E8EAF6' : '#fff' }}
              >
                <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: target === i ? '#1A237E' : '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  {target === i && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#1A237E' }} />}
                </View>
                <Text style={{ fontSize: 14, fontWeight: target === i ? '600' : '400', color: target === i ? '#1A237E' : '#2C1810' }}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <TouchableOpacity
          style={{ height: 48, backgroundColor: '#1A237E', borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          <Icon name="Megaphone" size={16} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Envoyer la notification</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
