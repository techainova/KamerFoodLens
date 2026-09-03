import React, { useEffect, useRef, useState } from 'react';
import {
  View, TouchableOpacity, StatusBar, Animated, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_MD } from '@/constants/theme';
import { gamesService, type QuizQuestion, type QuizAnswer, type QuizResult } from '@/services/games.service';

const TOTAL_TIME = 30;
const QUESTION_COUNT = 10;

type Phase = 'loading' | 'playing' | 'submitting' | 'complete';

function formatCategory(category: string | null): string {
  if (!category) return '';
  return category.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function newSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function Quiz() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const sessionIdRef = useRef(newSessionId());

  const question = questions[currentQ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const qs = await gamesService.getQuizQuestions(undefined, QUESTION_COUNT);
        if (!cancelled) {
          setQuestions(qs);
          setPhase(qs.length > 0 ? 'playing' : 'complete');
        }
      } catch {
        if (!cancelled) setPhase('complete');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const submitAnswer = (nextAnswer: QuizAnswer) => {
    const nextAnswers = [...answers, nextAnswer];
    setAnswers(nextAnswers);

    if (currentQ >= questions.length - 1) {
      void finishQuiz(nextAnswers);
    } else {
      progressAnim.setValue(1);
      setCurrentQ((prev) => prev + 1);
      setSelectedIndex(null);
      setPhase('playing');
    }
  };

  const finishQuiz = async (finalAnswers: QuizAnswer[]) => {
    setPhase('submitting');
    try {
      const res = await gamesService.submitQuiz({ sessionId: sessionIdRef.current, answers: finalAnswers });
      setResult(res);
    } finally {
      setPhase('complete');
    }
  };

  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(TOTAL_TIME);
    Animated.timing(progressAnim, { toValue: 0, duration: TOTAL_TIME * 1000, useNativeDriver: false }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          submitAnswer({ questionId: question!.id, selectedIndex: -1, timeMs: TOTAL_TIME * 1000 });
          return TOTAL_TIME;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQ]);

  const handleAnswer = (optionIndex: number) => {
    if (phase !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedIndex(optionIndex);
    const timeMs = (TOTAL_TIME - timeLeft) * 1000;
    setTimeout(() => submitAnswer({ questionId: question!.id, selectedIndex: optionIndex, timeMs }), 500);
  };

  const restart = async () => {
    sessionIdRef.current = newSessionId();
    setAnswers([]);
    setResult(null);
    setCurrentQ(0);
    setSelectedIndex(null);
    setPhase('loading');
    try {
      const qs = await gamesService.getQuizQuestions(undefined, QUESTION_COUNT);
      setQuestions(qs);
      setPhase(qs.length > 0 ? 'playing' : 'complete');
    } catch {
      setPhase('complete');
    }
  };

  if (phase === 'loading' || phase === 'submitting') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle={C.statusBar} />
        <ActivityIndicator color="#E8591A" />
      </SafeAreaView>
    );
  }

  if (phase === 'complete') {
    const percentage = result && result.total > 0 ? Math.round((result.correctAnswers / result.total) * 100) : 0;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <StatusBar barStyle={C.statusBar} />
        {!result ? (
          <>
            <Icon name="AlertTriangle" size={40} color={C.inkMute} />
            <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center', marginTop: 16, marginBottom: 24 }}>{t('games.quizUnavailable')}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: '100%', height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.inkSoft }}>{t('games.backToGames')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: percentage >= 70 ? '#E3F0E4' : '#FEF3EC', borderWidth: 3, borderColor: percentage >= 70 ? '#2E7D32' : '#E8591A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Icon name={percentage >= 70 ? 'Trophy' : 'Star'} size={40} color={percentage >= 70 ? '#2E7D32' : '#E8591A'} fill={percentage >= 70 ? 'none' : '#F9A825'} />
            </View>
            <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 6, textAlign: 'center' }}>
              {percentage >= 70 ? t('games.excellent') : t('games.goodEffort')}
            </Text>
            <Text style={{ fontSize: 15, color: C.inkSoft, marginBottom: 24, textAlign: 'center' }}>
              {result.correctAnswers} / {result.total} {t('games.correctAnswers')} · {percentage}%
            </Text>

            <View style={{ width: '100%', backgroundColor: C.surface, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 24, ...SHADOW_MD }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {[
                  { label: t('games.scoreLabel'), value: `${result.correctAnswers}/${result.total}`, color: '#E8591A' },
                  { label: t('games.accuracy'), value: `${percentage}%`, color: '#2E7D32' },
                  { label: t('games.xpEarned'), value: `+${result.xpEarned} XP`, color: '#F9A825' },
                ].map((stat) => (
                  <View key={stat.label} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: stat.color, fontFamily: 'Inter-Bold' }}>{stat.value}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute }}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => void restart()}
              style={{ width: '100%', height: 52, borderRadius: 16, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>{t('games.playAgain')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: '100%', height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.inkSoft }}>{t('games.backToGames')}</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    );
  }

  if (!question) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Icon name="ArrowLeft" size={22} color="#2C1810" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink }}>{t('games.quizOfDay')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: timeLeft <= 10 ? '#FBDCDC' : '#F5F0EB' }}>
            <Icon name="Clock" size={14} color={timeLeft <= 10 ? '#C62828' : '#6D4C41'} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: timeLeft <= 10 ? '#C62828' : '#2C1810', fontFamily: 'JetBrainsMono-Regular' }}>
              {String(timeLeft).padStart(2, '0')}s
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 4 }}>
          {questions.map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < currentQ ? '#E8591A' : i === currentQ ? '#E8591A60' : '#E5E0D8' }}
            />
          ))}
        </View>
        <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 5 }}>{t('games.questionOf', { n: currentQ + 1, total: questions.length })}</Text>
      </View>

      {/* Timer progress */}
      <View style={{ height: 3, backgroundColor: C.surface2 }}>
        <Animated.View style={{ height: '100%', backgroundColor: timeLeft <= 10 ? '#C62828' : '#E8591A', width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
      </View>

      {/* Question */}
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
        {!!question.category && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#E8591A15' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#E8591A' }}>{formatCategory(question.category)}</Text>
            </View>
          </View>
        )}

        <View style={{ backgroundColor: C.surface, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: C.border, ...SHADOW_MD }}>
          <Text style={{ fontSize: 17, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, lineHeight: 26 }}>
            {question.question}
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          {question.options.map((option, i) => {
            const isSelected = selectedIndex === i;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => handleAnswer(i)}
                disabled={selectedIndex !== null}
                style={{
                  flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
                  backgroundColor: isSelected ? '#FEF3EC' : '#fff', borderRadius: 16, borderWidth: 2,
                  borderColor: isSelected ? '#E8591A' : '#E5E0D8', gap: 12,
                }}
                activeOpacity={0.8}
              >
                <Text style={{ flex: 1, fontSize: 15, color: isSelected ? '#E8591A' : '#2C1810', fontWeight: isSelected ? '700' : '500' }}>{option}</Text>
                {isSelected && <Icon name="Check" size={18} color="#E8591A" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
