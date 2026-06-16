import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  dark?: boolean;
}

export default function LangSwitch({ dark = false }: Props) {
  const { i18n } = useTranslation();
  const current = i18n.language === 'en' ? 'EN' : 'FR';

  const toggle = (lang: 'FR' | 'EN') => {
    i18n.changeLanguage(lang === 'FR' ? 'fr' : 'en');
  };

  if (dark) {
    return (
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {(['FR', 'EN'] as const).map(l => (
          <TouchableOpacity
            key={l}
            onPress={() => toggle(l)}
            style={[
              { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
              l === current
                ? { backgroundColor: 'rgba(255,255,255,0.2)' }
                : { opacity: 0.5 },
            ]}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: l === current ? '600' : '400' }}>
              {l}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, overflow: 'hidden' }}>
      {(['FR', 'EN'] as const).map(l => (
        <TouchableOpacity
          key={l}
          onPress={() => toggle(l)}
          style={[
            { paddingHorizontal: 10, paddingVertical: 4 },
            l === current ? { backgroundColor: '#2C1810' } : { backgroundColor: 'transparent' },
          ]}
        >
          <Text style={[
            { fontSize: 12, fontWeight: '600' },
            l === current ? { color: '#fff' } : { color: '#8C8278' },
          ]}>
            {l}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
