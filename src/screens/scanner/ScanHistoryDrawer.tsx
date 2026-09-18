// Tiroir d'historique des conversations KFL Lens — glisse depuis la gauche
// par-dessus l'écran courant (accueil ou résultat), comme les threads de
// conversation d'un assistant IA.
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Image } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import KFLLogo from '@/components/ui/KFLLogo';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/auth.store';
import { scannerService, buildScanDayGroups, type ScanHistoryItem } from '@/services/scanner.service';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ScanHistoryDrawer({ visible, onClose }: Props) {
  const C = useColors();
  const nav = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [items, setItems] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !isAuthenticated) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { items: fetched } = await scannerService.getHistory(1, 50);
        if (!cancelled) setItems(fetched);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [visible, isAuthenticated]);

  const groups = buildScanDayGroups(items);

  const openItem = (item: ScanHistoryItem) => {
    onClose();
    nav.navigate('Result', { scanId: item.scanId, classId: item.classId, confidence: item.confidence, imageUri: item.imageUrl });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(20,17,14,0.45)' }}>
        <View style={{ width: '82%', maxWidth: 320, backgroundColor: C.surface }}>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <KFLLogo size={24} />
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, flex: 1 }}>KFL Lens</Text>
                <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                  <Icon name="X" size={20} color={C.inkSoft} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => { onClose(); nav.navigate('ScannerHome'); }}
                style={{
                  marginTop: 13, paddingVertical: 10, paddingHorizontal: 12,
                  borderRadius: 11, backgroundColor: C.primarySoft, flexDirection: 'row', alignItems: 'center', gap: 8,
                }}
              >
                <Icon name="Plus" size={16} color={C.primary} strokeWidth={2.2} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.primary }}>Nouvelle conversation</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 8 }}>
              {!isAuthenticated ? (
                <Text style={{ fontSize: 12.5, color: C.inkMute, textAlign: 'center', marginTop: 30, paddingHorizontal: 16 }}>
                  Connectez-vous pour retrouver l'historique de vos identifications.
                </Text>
              ) : loading ? (
                <ActivityIndicator color={C.primary} style={{ marginTop: 30 }} />
              ) : groups.length === 0 ? (
                <Text style={{ fontSize: 12.5, color: C.inkMute, textAlign: 'center', marginTop: 30, paddingHorizontal: 16 }}>
                  Aucune conversation pour le moment.
                </Text>
              ) : groups.map((g) => (
                <View key={g.dayKey} style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 1, color: C.inkMute, paddingHorizontal: 10, paddingVertical: 5 }}>
                    {g.dateLabel.toUpperCase()}
                  </Text>
                  {[...g.items].reverse().map((item) => (
                    <TouchableOpacity
                      key={item.scanId}
                      onPress={() => openItem(item)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, paddingVertical: 9, borderRadius: 9 }}
                    >
                      {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={{ width: 26, height: 26, borderRadius: 7 }} />
                      ) : (
                        <View style={{ width: 26, height: 26, borderRadius: 7, backgroundColor: C.surface2 }} />
                      )}
                      <Text numberOfLines={1} style={{ flex: 1, fontSize: 13, color: C.inkSoft }}>{item.dishName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>

            {isAuthenticated && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 0.5, borderColor: C.border }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} style={{ width: 32, height: 32 }} />
                  ) : (
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                      {((user?.firstName?.charAt(0) ?? '') + (user?.lastName?.charAt(0) ?? '')).toUpperCase() || '?'}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{user?.firstName} {user?.lastName}</Text>
                  <Text style={{ fontSize: 10.5, color: C.inkMute }}>{items.length} plats identifiés</Text>
                </View>
              </View>
            )}
          </SafeAreaView>
        </View>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </View>
    </Modal>
  );
}
