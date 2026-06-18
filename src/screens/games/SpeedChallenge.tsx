import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const ROUND_TIME = 6;

const DISHES = [
  { name: 'Ndolé',       region: 'Littoral',  xp: 50, options: ['Ndolé', 'Kpwem', 'Beignets', 'Eru'] },
  { name: 'Eru',         region: 'Sud-Ouest', xp: 60, options: ['Mbongo', 'Eru', 'Koki', 'Ndolé'] },
  { name: 'Poulet DG',   region: 'Centre',    xp: 50, options: ['Poulet DG', 'Bolo Bolo', 'Fufu', 'Achu'] },
  { name: 'Mbongo',      region: 'Littoral',  xp: 70, options: ['Njama Njama', 'Mbongo', 'Kpwem', 'Tilapia'] },
  { name: 'Achu Soup',   region: 'Ouest',     xp: 80, options: ['Koki', 'Eru', 'Achu Soup', 'Ndolé'] },
];

type Phase = 'playing' | 'answered' | 'complete';

export default function SpeedChallenge() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [phase, setPhase]         = useState<Phase>('playing');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected]   = useState<string | null>(null);
  const [totalXP, setTotalXP]     = useState(0);
  const [streak, setStreak]       = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft]   = useState(ROUND_TIME);
  const [answers, setAnswers]     = useState<boolean[]>([]);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const dish = DISHES[currentIdx]!;

  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(ROUND_TIME);
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0, duration: ROUND_TIME * 1000, useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTimeout();
          return ROUND_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIdx]);

  const onTimeout = () => {
    setSelected(null);
    setPhase('answered');
    setStreak(0);
    setAnswers(prev => [...prev, false]);
    setTimeout(goNext, 900);
  };

  const handleAnswer = (option: string) => {
    if (phase !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(option);
    setPhase('answered');
    const correct = option === dish.name;
    if (correct) {
      const ns = streak + 1;
      setStreak(ns);
      setMaxStreak(s => Math.max(s, ns));
      const bonus = ns >= 3 ? 1.5 : 1;
      setTotalXP(prev => prev + Math.round(dish.xp * bonus));
    } else {
      setStreak(0);
    }
    setAnswers(prev => [...prev, correct]);
    setTimeout(goNext, 1000);
  };

  const goNext = () => {
    if (currentIdx >= DISHES.length - 1) {
      setPhase('complete');
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setPhase('playing');
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setTotalXP(0);
    setStreak(0);
    setMaxStreak(0);
    setSelected(null);
    setAnswers([]);
    setPhase('playing');
  };

  const getOptionStyle = (option: string) => {
    if (phase !== 'answered') return { bg: '#fff', border: '#E5E0D8', text: '#2C1810' };
    if (option === dish.name)  return { bg: '#E3F0E4', border: '#2E7D32', text: '#2E7D32' };
    if (option === selected)   return { bg: '#FBDCDC', border: '#C62828', text: '#C62828' };
    return { bg: '#fff', border: '#E5E0D8', text: '#8C8278' };
  };

  // ── Complete screen ────────────────────────────────────────────────────────
  if (phase === 'complete') {
    const correct = answers.filter(Boolean).length;
    const perfect = correct === DISHES.length;
    const good    = correct >= 3;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <StatusBar barStyle={C.statusBar} />

        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: perfect ? '#E3F0E4' : '#FBF3DC', borderWidth: 3, borderColor: perfect ? '#2E7D32' : '#F9A825', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon name="Zap" size={40} color={perfect ? '#2E7D32' : '#F9A825'} fill={perfect ? '#2E7D32' : '#F9A825'} />
        </View>

        <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 6, textAlign: 'center' }}>
          {perfect ? 'Parfait !' : good ? 'Bien joué !' : "Continue d'essayer !"}
        </Text>
        <Text style={{ fontSize: 15, color: C.inkSoft, marginBottom: 24, textAlign: 'center' }}>
          {correct}/{DISHES.length} identifications correctes
        </Text>

        <View style={{ width: '100%', backgroundColor: C.surface, borderRadius: 18, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {[
              { label: 'XP gagnés', value: `+${totalXP}`, color: '#F9A825' },
              { label: 'Corrects',  value: `${correct}/${DISHES.length}`, color: '#2E7D32' },
              { label: 'Streak max', value: `x${maxStreak}`, color: '#E8591A' },
            ].map(stat => (
              <View key={stat.label} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: stat.color, fontFamily: 'Inter-Bold' }}>{stat.value}</Text>
                <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={restart}
          style={{ width: '100%', height: 52, borderRadius: 16, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Rejouer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: '100%', height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: C.inkSoft }}>Retour aux jeux</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Playing screen ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Icon name="ArrowLeft" size={22} color="#2C1810" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink }}>Défi rapide</Text>
          {streak >= 2 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#FEF3EC' }}>
              <Icon name="Flame" size={13} color="#E8591A" fill="#E8591A" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>{streak}x streak</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: C.goldSoft }}>
            <Icon name="Zap" size={13} color="#F9A825" fill="#F9A825" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#F9A825' }}>{totalXP} XP</Text>
          </View>
        </View>

        {/* Progress pips */}
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 6 }}>
          {DISHES.map((_, i) => {
            const bg = i < currentIdx
              ? (answers[i] ? '#2E7D32' : '#C62828')
              : i === currentIdx ? '#E8591A80' : '#E5E0D8';
            return <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: bg }} />;
          })}
        </View>
        <Text style={{ fontSize: 11, color: C.inkMute }}>Plat {currentIdx + 1} sur {DISHES.length}</Text>
      </View>

      {/* Timer bar */}
      <View style={{ height: 3, backgroundColor: C.surface2 }}>
        <Animated.View style={{
          height: '100%',
          backgroundColor: timeLeft <= 2 ? '#C62828' : '#E8591A',
          width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>

        {/* Dish image */}
        <View style={{ height: 180, borderRadius: 20, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' }}>
          <Icon name="ChefHat" size={56} color="rgba(140,130,120,0.22)" />
          <Text style={{ fontSize: 12, color: C.inkMute, fontStyle: 'italic', marginTop: 8 }}>Identifiez ce plat</Text>

          {/* Region badge */}
          <View style={{ position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.48)' }}>
            <Icon name="MapPin" size={10} color="#fff" />
            <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>{dish.region}</Text>
          </View>

          {/* Countdown circle */}
          <View style={{ position: 'absolute', top: 12, right: 12, width: 44, height: 44, borderRadius: 22, backgroundColor: timeLeft <= 2 ? '#FBDCDC' : '#fff', borderWidth: 2, borderColor: timeLeft <= 2 ? '#C62828' : '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: timeLeft <= 2 ? '#C62828' : '#E8591A', fontFamily: 'JetBrainsMono-Regular' }}>{timeLeft}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 15, fontWeight: '600', color: C.inkSoft, textAlign: 'center', marginBottom: 16 }}>
          Quel est ce plat camerounais ?
        </Text>

        {/* Options */}
        <View style={{ gap: 10 }}>
          {dish.options.map(option => {
            const s = getOptionStyle(option);
            const isCorrect = phase === 'answered' && option === dish.name;
            const isWrong   = phase === 'answered' && option === selected && option !== dish.name;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => handleAnswer(option)}
                disabled={phase === 'answered'}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: s.bg, borderRadius: 16, borderWidth: 2, borderColor: s.border, gap: 12 }}
                activeOpacity={0.8}
              >
                <Text style={{ flex: 1, fontSize: 15, color: s.text, fontWeight: '500' }}>{option}</Text>
                {isCorrect && <Icon name="Check" size={18} color="#2E7D32" />}
                {isWrong   && <Icon name="X"     size={18} color="#C62828" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
