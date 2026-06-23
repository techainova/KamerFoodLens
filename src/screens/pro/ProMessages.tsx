import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const CONVOS = [
  { name: 'Sami Nguimfack', last: 'Bonjour, ma commande est-elle prête ?', time: '14:32', unread: 2 },
  { name: 'Adèle Biya',     last: 'Merci pour la livraison rapide !',      time: '11:15', unread: 0 },
  { name: 'Ngo Mireille',   last: 'Avez-vous le Ndolé sans piment ?',      time: 'Hier',  unread: 1 },
];

export default function ProMessages() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = CONVOS.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proMessages.title')}</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={15} color={C.inkMute} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('proMessages.searchPlaceholder')}
            placeholderTextColor={C.inkMute}
            style={{ flex: 1, fontSize: 14, color: C.ink }}
          />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
            <Icon name="Search" size={32} color={C.inkMute} />
            <Text style={{ fontSize: 13, color: C.inkMute }}>{t('proMessages.noResults')}</Text>
          </View>
        ) : (
          filtered.map((convo, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate('ProMessageDetail', { userId: convo.name })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border, backgroundColor: convo.unread > 0 ? '#FEF3EC' : C.surface }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: C.inkSoft, fontSize: 16, fontWeight: '600' }}>{convo.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{convo.name}</Text>
                <Text style={{ fontSize: 12, color: convo.unread > 0 ? C.ink : C.inkMute, fontWeight: convo.unread > 0 ? '500' : '400', marginTop: 2 }} numberOfLines={1}>{convo.last}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Text style={{ fontSize: 11, color: C.inkMute }}>{convo.time}</Text>
                {convo.unread > 0 && (
                  <View style={{ width: 20, height: 20, backgroundColor: C.primary, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{convo.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
