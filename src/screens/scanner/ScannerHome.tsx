// KFL Lens — accueil conversationnel du scanner IA, minimaliste façon Claude
// (pas de barre de menu, très peu de texte, tout tient autour du composer).
import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ScannerStackParams } from '@/navigation/types';
import Icon from '@/components/ui/Icon';
import KFLLogo from '@/components/ui/KFLLogo';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/auth.store';
import { useGuestStore, FREE_SCAN_LIMIT } from '@/store/guest.store';
import { matchDishByDescription } from '@/ai/text/matchDishByDescription';
import { scannerService } from '@/services/scanner.service';
import ScanHistoryDrawer from './ScanHistoryDrawer';

type Nav = NativeStackNavigationProp<ScannerStackParams, 'Camera'>;

const CHIPS: { icon: Parameters<typeof Icon>[0]['name']; label: string; query?: string; action?: 'camera' | 'restos' }[] = [
  { icon: 'Camera', label: 'Identifier une photo', action: 'camera' },
  { icon: 'GraduationCap', label: "Recette de l'Achu", query: 'achu jaune' },
  { icon: 'Store', label: 'Restaurants proches', action: 'restos' },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function ScannerHome() {
  const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const anonymousScanCount = useGuestStore((s) => s.anonymousScanCount);
  const registerAnonymousScan = useGuestStore((s) => s.registerAnonymousScan);

  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const greetLine = `${greeting()}${user?.firstName ? `, ${user.firstName}` : ''}`;
  const canSubmit = text.trim().length > 1 && !analyzing;

  const runTextQuery = async (query: string) => {
    if (!isAuthenticated && anonymousScanCount >= FREE_SCAN_LIMIT) {
      Alert.alert(
        t('scanner.guestLimitTitle'),
        t('scanner.guestLimitMsg'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('auth.signup'), onPress: () => nav.navigate('Login' as never) },
        ],
      );
      return;
    }
    setAnalyzing(true);
    let scanId = `text-scan-${Date.now()}`;
    let classId: string;
    let confidence: number;
    try {
      // Recherche réelle côté backend (synchronisée : historique + XP) — voir
      // scan.service.ts::scanText, port serveur de matchDishByDescription.
      const apiResult = await scannerService.analyzeText({ text: query });
      scanId = apiResult.scanId;
      classId = apiResult.classId;
      confidence = apiResult.confidence;
    } catch (err) {
      if (__DEV__) {
        console.warn('[KFL][ScannerHome] API indisponible, correspondance locale de secours :', err);
      }
      const local = matchDishByDescription(query);
      classId = local.classId;
      confidence = local.confidence;
    }
    setAnalyzing(false);
    if (!isAuthenticated) registerAnonymousScan();
    setText('');
    nav.navigate('Result', { scanId, classId, confidence, query } as never);
  };

  const handleChip = (c: typeof CHIPS[number]) => {
    if (c.query) { void runTextQuery(c.query); return; }
    if (c.action === 'camera') { nav.navigate('Camera'); return; }
    nav.navigate('MapScreen' as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top', 'left', 'right']}>
      {/* Barre du haut — minimaliste : retour, logo KFLens, historique */}
      <View style={{ height: 50, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => (nav.canGoBack() ? nav.goBack() : nav.getParent()?.navigate('HomeTab' as never))}
          style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="ArrowLeft" size={20} color={C.ink} />
        </TouchableOpacity>
        <KFLLogo size={26} />
        <TouchableOpacity
          onPress={() => setHistoryOpen(true)}
          style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="Menu" size={20} color={C.ink} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={8}>
        {/* Centre — très peu de texte, façon Claude */}
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: C.ink, textAlign: 'center' }}>
            {greetLine}
          </Text>
        </View>

        {/* Bas d'écran — suggestions puis composer, comme un vrai assistant */}
        <View style={{ paddingHorizontal: 14, paddingBottom: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingBottom: 10, paddingHorizontal: 6, alignItems: 'center' }}>
            {CHIPS.map((c) => (
              <TouchableOpacity
                key={c.label}
                onPress={() => handleChip(c)}
                activeOpacity={0.75}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, height: 34,
                  borderRadius: 17, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
                }}
              >
                <Icon name={c.icon} size={14} color={C.inkSoft} />
                <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.inkSoft }}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Composer */}
          <View style={{
            borderRadius: 24, backgroundColor: C.surface, borderWidth: 1, borderColor: C.borderStrong,
            padding: 10, paddingBottom: 8,
          }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Un plat à identifier ?"
              placeholderTextColor={C.inkMute}
              multiline
              style={{ fontSize: 14.5, color: C.ink, paddingHorizontal: 6, paddingBottom: 8, maxHeight: 90 }}
              onSubmitEditing={() => canSubmit && void runTextQuery(text)}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                onPress={() => nav.navigate('Camera')}
                style={{ width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: C.borderStrong, alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="Camera" size={16} color={C.inkSoft} />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => nav.navigate('AudioText')}
                style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="Mic" size={19} color={C.inkSoft} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => canSubmit && void runTextQuery(text)}
                disabled={!canSubmit}
                style={{
                  width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: canSubmit ? C.primary : C.divider,
                }}
              >
                <Icon name="Send" size={16} color={canSubmit ? '#fff' : C.inkMute} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <ScanHistoryDrawer visible={historyOpen} onClose={() => setHistoryOpen(false)} />
    </SafeAreaView>
  );
}
