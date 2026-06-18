import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const TAB_KEYS = ['tabScans', 'tabRecipes', 'tabEvents'] as const;

const SCAN_HISTORY_INITIAL = [
  { dish: 'Ndolé traditionnel', date: "Aujourd'hui 14:23", confidence: 97, region: 'Littoral'   },
  { dish: 'Poulet DG',          date: 'Hier 12:05',         confidence: 91, region: 'Centre'     },
  { dish: 'Eru & Fufu',         date: 'Lun 9 Jun · 18:41',  confidence: 88, region: 'Nord-Ouest' },
  { dish: 'Koki haricots',      date: 'Dim 8 Jun · 11:20',  confidence: 84, region: 'Ouest'      },
  { dish: 'Mbongo tchobi',      date: 'Sam 7 Jun · 19:55',  confidence: 79, region: 'Littoral'   },
];

export default function History() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [scanHistory, setScanHistory] = useState(SCAN_HISTORY_INITIAL);

  const handleClear = () => {
    Alert.alert(
      t('history.clearConfirmTitle'),
      t('history.clearConfirmMsg'),
      [
        { text: t('history.clearConfirmCancel'), style: 'cancel' },
        { text: t('history.clearConfirmAction'), style: 'destructive', onPress: () => setScanHistory([]) },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('history.title')}</Text>
        {activeTab === 0 && scanHistory.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.primary }}>{t('history.clear')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        {TAB_KEYS.map((key, i) => (
          <TouchableOpacity key={key} onPress={() => setActiveTab(i)}
            style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderColor: i === activeTab ? C.primary : 'transparent', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '600' : '500', color: i === activeTab ? C.primary : C.inkMute }}>{t(`history.${key}`)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {activeTab === 0 && (
          scanHistory.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
              <Icon name="Camera" size={48} color={C.inkMute} />
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.ink, textAlign: 'center', marginBottom: 6, marginTop: 16 }}>{t('history.emptyTitle')}</Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {scanHistory.map((item, i) => (
                <TouchableOpacity key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                  <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="Camera" size={20} color={C.inkMute} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{item.dish}</Text>
                    <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>{item.region} · {item.date}</Text>
                  </View>
                  <View style={{ height: 24, paddingHorizontal: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: item.confidence >= 90 ? C.successSoft : C.surface2 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: item.confidence >= 90 ? C.success : C.inkSoft }}>{item.confidence}%</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )
        )}

        {activeTab !== 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Icon name={activeTab === 1 ? 'BookOpen' : 'Calendar'} size={48} color={C.inkMute} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: C.ink, textAlign: 'center', marginBottom: 6, marginTop: 16 }}>{t('history.emptyTitle')}</Text>
            <Text style={{ fontSize: 14, color: C.inkMute, textAlign: 'center', lineHeight: 20 }}>
              {activeTab === 1 ? t('history.emptyRecipes') : t('history.emptyEvents')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
