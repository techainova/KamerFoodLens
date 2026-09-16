// src/components/ui/QuickActionsSheet.tsx
// Feuille remontante ouverte par le bouton central de la barre de navigation —
// un menu de raccourcis plutôt qu'un aller direct à la caméra, à l'identique
// du bouton central du document de référence (structure, pas contenu copié).
import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

export type QuickAction = 'scanPhoto' | 'scanVoice' | 'addStory' | 'history';

interface ActionDef {
  key: QuickAction;
  icon: IconName;
  color: string;
  labelKey: string;
  descKey: string;
}

const ACTIONS: ActionDef[] = [
  { key: 'scanPhoto', icon: 'Camera',    color: '#E8591A', labelKey: 'quickActions.scanPhoto',  descKey: 'quickActions.scanPhotoDesc' },
  { key: 'scanVoice', icon: 'Mic',       color: '#1A237E', labelKey: 'quickActions.scanVoice',  descKey: 'quickActions.scanVoiceDesc' },
  { key: 'addStory',  icon: 'Plus',      color: '#F9A825', labelKey: 'quickActions.addStory',   descKey: 'quickActions.addStoryDesc' },
  { key: 'history',   icon: 'Clock',     color: '#2E7D32', labelKey: 'quickActions.history',    descKey: 'quickActions.historyDesc' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (action: QuickAction) => void;
}

export default function QuickActionsSheet({ visible, onClose, onSelect }: Props) {
  const { t } = useTranslation();
  const C = useColors();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} activeOpacity={1} onPress={onClose}>
        <View style={{ marginTop: 'auto', backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 28 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 8 }} />

          {ACTIONS.map((action, i) => (
            <TouchableOpacity
              key={action.key}
              onPress={() => onSelect(action.key)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 14,
                paddingHorizontal: 20, paddingVertical: 14,
                borderTopWidth: i === 0 ? 0 : 1, borderColor: C.border,
              }}
              activeOpacity={0.7}
            >
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: action.color + '18', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={action.icon} size={20} color={action.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{t(action.labelKey)}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>{t(action.descKey)}</Text>
              </View>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
