// src/screens/home/story-stickers/StoryTextTool.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';

const TEXT_COLORS = ['#FFFFFF', '#2C1810', '#E8591A', '#1A237E', '#F9A825', '#2E7D32'];

export interface DraftTextOverlay {
  text: string;
  color: string;
  align: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (overlay: DraftTextOverlay) => void;
}

export default function StoryTextTool({ visible, onClose, onConfirm }: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [color, setColor] = useState(TEXT_COLORS[0]);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [highlighted, setHighlighted] = useState(false);

  const handleConfirm = () => {
    if (!text.trim()) { onClose(); return; }
    onConfirm({ text: text.trim(), color, align, backgroundColor: highlighted ? 'rgba(0,0,0,0.55)' : undefined });
    setText('');
    setHighlighted(false);
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(20,15,10,0.92)', paddingTop: 60 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="X" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setHighlighted((h) => !h)}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: highlighted ? '#fff' : 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Type" size={16} color={highlighted ? '#000' : '#fff'} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('home.storyTextPlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.5)"
            multiline
            autoFocus
            style={{
              color, fontSize: 28, fontWeight: '700', textAlign: align,
              backgroundColor: highlighted ? 'rgba(0,0,0,0.55)' : 'transparent',
              padding: highlighted ? 10 : 0, borderRadius: 8,
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, paddingBottom: 16 }}>
          {(['left', 'center', 'right'] as const).map((a) => (
            <TouchableOpacity
              key={a}
              onPress={() => setAlign(a)}
              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: align === a ? '#fff' : 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name={a === 'left' ? 'ArrowLeft' : a === 'right' ? 'ArrowRight' : 'Minus'} size={14} color={align === a ? '#000' : '#fff'} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, paddingBottom: 30 }}>
          {TEXT_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c, borderWidth: color === c ? 2 : 0, borderColor: '#fff' }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          style={{ position: 'absolute', bottom: 30, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="Check" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
