import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import type { IconName } from '@/components/ui/Icon';

const CHAT = [
  { user: 'Adèle',   msg: 'Incroyable démonstration !', time: '14:23' },
  { user: 'Sami N.', msg: "Quelle quantité de pâte d'arachide ?", time: '14:24' },
  { user: 'Maman P.', msg: 'Je prends des notes !', time: '14:24' },
  { user: 'Ngo M.',  msg: 'Merci Chef Joël ! Super masterclass', time: '14:25' },
  { user: 'Kevin B.', msg: "Bravissimo ! On peut avoir la recette en PDF ?", time: '14:26' },
];

const REACTIONS: { icon: IconName; color: string }[] = [
  { icon: 'Heart',     color: '#C62828' },
  { icon: 'Flame',     color: '#E8591A' },
  { icon: 'ThumbsUp',  color: '#F9A825' },
  { icon: 'Star',      color: '#F9A825' },
  { icon: 'Check',     color: '#2E7D32' },
];

export default function Live() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [msg, setMsg] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Video area */}
      <View style={{ height: 256, position: 'relative', backgroundColor: '#1A237E', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowLeft" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#C62828', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.surface }} />
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>LIVE</Text>
          </View>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Share2" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Chef avatar */}
        <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ChefHat" size={36} color="rgba(255,255,255,0.8)" />
        </View>
        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 8 }}>Chef Joël · Masterclass Ndolé</Text>

        {/* Viewer count */}
        <View style={{ position: 'absolute', bottom: 12, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E7D32' }} />
          <Text style={{ color: '#fff', fontSize: 11 }}>124 spectateurs</Text>
        </View>
      </View>

      {/* Chat */}
      <View style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Chat en direct</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="MessageCircle" size={12} color="rgba(255,255,255,0.5)" />
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{CHAT.length * 12} messages</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }} showsVerticalScrollIndicator={false}>
          {CHAT.map((c, i) => (
            <View key={i} style={{ marginBottom: 10, flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>{c.user[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' }}>{c.user}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{c.time}</Text>
                </View>
                <Text style={{ color: '#fff', fontSize: 13, marginTop: 2, lineHeight: 19 }}>{c.msg}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Reactions bar */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          {REACTIONS.map((r, i) => (
            <TouchableOpacity key={i} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={r.icon} size={16} color={r.color} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#1A1A1A' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, paddingHorizontal: 14, height: 40 }}>
            <TextInput
              value={msg}
              onChangeText={setMsg}
              placeholder="Votre message..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={{ flex: 1, fontSize: 13, color: '#fff' }}
            />
          </View>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
