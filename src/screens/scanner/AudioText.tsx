import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView,
  TextInput, ScrollView, Animated, Easing,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ScannerStackParams } from '@/navigation/types';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useVoiceToText } from '@/hooks/useVoiceToText';

type Nav = NativeStackNavigationProp<ScannerStackParams, 'AudioText'>;

const WAVE_BARS = 36;

function WaveBar({ index, active }: { index: number; active: boolean }) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!active) { anim.setValue(0.3); return; }
    const delay = (index % 8) * 60;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400 + (index % 4) * 80, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.15, duration: 400 + (index % 3) * 80, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, anim, index]);

  const baseH = 8 + (index % 5) * 10;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 80 }}>
      <Animated.View style={{
        width: 3, borderRadius: 2,
        height: baseH,
        backgroundColor: index % 3 === 0 ? '#E8591A' : '#E5E0D8',
        transform: [{ scaleY: anim }],
      }} />
    </View>
  );
}

export default function AudioText() {
    const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<'audio' | 'text'>('audio');
  const [textInput, setTextInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const {
    isRecording, isProcessing, transcript, error: voiceError,
    startRecording, stopRecording,
  } = useVoiceToText();

  // Mic pulse animation
  const micPulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!isRecording) { micPulse.setValue(1); return; }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(micPulse, { toValue: 1.12, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(micPulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording, micPulse]);

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 1200));
    setAnalyzing(false);
    nav.navigate('Result', { scanId: 'audio-scan-001' });
  };

  const hasInput = activeTab === 'audio' ? transcript.length > 0 : textInput.length > 2;

  const TABS = [
    { key: 'audio' as const, label: t('audioText.audioTab'), icon: 'Mic' as const },
    { key: 'text'  as const, label: t('audioText.textTab'),  icon: 'MessageCircle' as const },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity
          style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => nav.goBack()}
        >
          <Icon name="ArrowLeft" size={17} color="#6D4C41" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>
          {t('audioText.title')}
        </Text>
        <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ScanLine" size={18} color="#fff" />
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderBottomWidth: 2, borderColor: activeTab === tab.key ? '#E8591A' : 'transparent' }}
          >
            <Icon name={tab.icon} size={16} color={activeTab === tab.key ? '#E8591A' : '#8C8278'} />
            <Text style={{ fontSize: 14, fontWeight: activeTab === tab.key ? '700' : '500', color: activeTab === tab.key ? '#E8591A' : '#8C8278' }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

        {/* ── AUDIO TAB ── */}
        {activeTab === 'audio' && (
          <View style={{ flex: 1, alignItems: 'center', paddingTop: 32, paddingHorizontal: 24, gap: 24 }}>

            {/* Waveform */}
            <View style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              {Array.from({ length: WAVE_BARS }).map((_, i) => (
                <WaveBar key={i} index={i} active={isRecording} />
              ))}
            </View>

            {/* Mic button */}
            <Animated.View style={{ transform: [{ scale: micPulse }] }}>
              <TouchableOpacity
                onPress={handleMicPress}
                activeOpacity={0.85}
                disabled={isProcessing}
                style={{
                  width: 96, height: 96, borderRadius: 48,
                  backgroundColor: isRecording ? '#C62828' : isProcessing ? '#8C8278' : '#E8591A',
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: isRecording ? '#C62828' : '#E8591A',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                <Icon name={isRecording ? 'Square' as never : 'Mic'} size={38} color="#fff" strokeWidth={1.75} />
              </TouchableOpacity>
            </Animated.View>

            {/* Label */}
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>
                {isRecording ? 'Enregistrement...' : isProcessing ? 'Transcription en cours...' : t('audioText.speak')}
              </Text>
              <Text style={{ color: C.inkMute, fontSize: 12 }}>{t('audioText.spokenHint')}</Text>
            </View>

            {/* Transcript area */}
            {(transcript.length > 0 || voiceError || (!isRecording && !isProcessing)) && (
              <View style={{ width: '100%', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 14, minHeight: 90 }}>
                {voiceError ? (
                  <Text style={{ fontSize: 13, color: C.error }}>{voiceError}</Text>
                ) : transcript.length > 0 ? (
                  <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22 }}>
                    {transcript}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 13, color: C.inkMute, fontStyle: 'italic' }}>
                    {t('audioText.spokenHint')}...
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* ── TEXT TAB ── */}
        {activeTab === 'text' && (
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('scanner.describeText')}
              </Text>
              <TextInput
                style={{
                  minHeight: 160, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
                  borderRadius: 16, padding: 16, fontSize: 14, color: C.ink,
                  lineHeight: 22, textAlignVertical: 'top',
                }}
                value={textInput}
                onChangeText={setTextInput}
                placeholder={t('audioText.textHint')}
                placeholderTextColor="#8C8278"
                multiline
                maxLength={400}
              />
              <Text style={{ fontSize: 11, color: C.inkMute, textAlign: 'right' }}>
                {textInput.length}/400 {t('audioText.charCount')}
              </Text>
            </View>

            {/* Quick suggest chips */}
            <View>
              <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 8 }}>Suggestions :</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {['Feuilles vertes', 'Sauce rouge', 'Arachides', 'Poisson fumé', 'Plantain', 'Piment'].map((chip) => (
                  <TouchableOpacity
                    key={chip}
                    onPress={() => setTextInput(prev => prev + (prev ? ', ' : '') + chip.toLowerCase())}
                    style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface }}
                  >
                    <Text style={{ fontSize: 13, color: C.inkSoft }}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* CTA bar */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 14, paddingBottom: 24, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.cream, gap: 10 }}>
        <TouchableOpacity
          style={{ height: 54, backgroundColor: hasInput ? '#E8591A' : '#E5E0D8', borderRadius: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onPress={handleAnalyze}
          disabled={!hasInput || analyzing}
          activeOpacity={0.85}
        >
          <Icon name="Search" size={20} color={hasInput ? '#fff' : '#8C8278'} />
          <Text style={{ color: hasInput ? '#fff' : '#8C8278', fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
            {analyzing ? t('scanner.analyzing') : t('audioText.analyze')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
