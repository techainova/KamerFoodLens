import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const QUESTIONS = [
  {
    id: 1,
    category: 'Identification',
    categoryColor: '#E8591A',
    question: 'Ce plat est préparé avec des feuilles de Gnetum africanum (okok). Comment s\'appelle-t-il ?',
    options: ['Ndolé', 'Kpwem', 'Eru', 'Mbongo'],
    correct: 'Eru',
    points: 100,
    region: 'Sud-Ouest',
  },
  {
    id: 2,
    category: 'Ingrédients',
    categoryColor: '#2E7D32',
    question: 'Quel est l\'ingrédient principal du Ndolé ?',
    options: ['Feuilles de ndolé', 'Plantain', 'Ecorces HK', 'Njansang'],
    correct: 'Feuilles de ndolé',
    points: 100,
    region: 'Littoral',
  },
  {
    id: 3,
    category: 'Région',
    categoryColor: '#1A237E',
    question: 'Le Mbongo Tchobi est un plat signature de quelle région du Cameroun ?',
    options: ['Centre', 'Nord', 'Littoral', 'Ouest'],
    correct: 'Littoral',
    points: 150,
    region: 'Littoral',
  },
  {
    id: 4,
    category: 'Culture',
    categoryColor: '#F9A825',
    question: 'Quel plat est traditionnellement servi lors des grandes cérémonies dans la région de l\'Ouest ?',
    options: ['Poulet DG', 'Achu Soup', 'Koki', 'Beignets haricots'],
    correct: 'Achu Soup',
    points: 150,
    region: 'Ouest',
  },
  {
    id: 5,
    category: 'Identification',
    categoryColor: '#E8591A',
    question: 'Le "DG" dans "Poulet DG" signifie :',
    options: ['Directeur Général', 'Doré et Garni', 'Délicieux & Goûteux', 'Double Garniture'],
    correct: 'Directeur Général',
    points: 200,
    region: 'Cameroun',
  },
];

const TOTAL_TIME = 30;

type Phase = 'playing' | 'answered' | 'complete';

export default function Quiz() {
  const navigation = useNavigation<any>();
  const [phase, setPhase] = useState<Phase>('playing');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const question = QUESTIONS[currentQ];

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
          handleNextQuestion();
          return TOTAL_TIME;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, currentQ]);

  const handleAnswer = (option: string) => {
    if (phase !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(option);
    setPhase('answered');
    if (option === question!.correct) {
      setScore(prev => prev + question!.points);
    }
    setTimeout(handleNextQuestion, 1600);
  };

  const handleNextQuestion = () => {
    if (currentQ >= QUESTIONS.length - 1) {
      setPhase('complete');
    } else {
      progressAnim.setValue(1);
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setPhase('playing');
    }
  };

  const getOptionStyle = (option: string) => {
    if (phase !== 'answered') {
      return { bg: '#fff', border: '#E5E0D8', text: '#2C1810' };
    }
    if (option === question!.correct) return { bg: '#E3F0E4', border: '#2E7D32', text: '#2E7D32' };
    if (option === selected) return { bg: '#FBDCDC', border: '#C62828', text: '#C62828' };
    return { bg: '#fff', border: '#E5E0D8', text: '#8C8278' };
  };

  const totalScore = QUESTIONS.reduce((s, q) => s + q.points, 0);
  const percentage = Math.round((score / totalScore) * 100);

  if (phase === 'complete') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <StatusBar barStyle="dark-content" />
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: percentage >= 70 ? '#E3F0E4' : '#FEF3EC', borderWidth: 3, borderColor: percentage >= 70 ? '#2E7D32' : '#E8591A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon name={percentage >= 70 ? 'Trophy' : 'Star'} size={40} color={percentage >= 70 ? '#2E7D32' : '#E8591A'} fill={percentage >= 70 ? 'none' : '#F9A825'} />
        </View>
        <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 6, textAlign: 'center' }}>
          {percentage >= 70 ? 'Excellent !' : 'Bon effort !'}
        </Text>
        <Text style={{ fontSize: 15, color: '#6D4C41', marginBottom: 24, textAlign: 'center' }}>
          {score} / {totalScore} points · {percentage}%
        </Text>

        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 24, ...SHADOW_MD }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {[
              { label: 'Score', value: `${score} pts`, color: '#E8591A' },
              { label: 'Précision', value: `${percentage}%`, color: '#2E7D32' },
              { label: 'XP gagnés', value: `+${Math.round(score * 0.15)} XP`, color: '#F9A825' },
            ].map((stat) => (
              <View key={stat.label} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: stat.color, fontFamily: 'Inter-Bold' }}>{stat.value}</Text>
                <Text style={{ fontSize: 11, color: '#8C8278' }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => { setCurrentQ(0); setScore(0); setSelected(null); setPhase('playing'); progressAnim.setValue(1); }}
          style={{ width: '100%', height: 52, borderRadius: 16, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Rejouer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: '100%', height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#6D4C41' }}>Retour aux jeux</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Icon name="ArrowLeft" size={22} color="#2C1810" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: '#2C1810' }}>Quiz du jour</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: timeLeft <= 10 ? '#FBDCDC' : '#F5F0EB' }}>
            <Icon name="Clock" size={14} color={timeLeft <= 10 ? '#C62828' : '#6D4C41'} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: timeLeft <= 10 ? '#C62828' : '#2C1810', fontFamily: 'JetBrainsMono-Regular' }}>
              {String(timeLeft).padStart(2, '0')}s
            </Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#E8591A15' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#E8591A' }}>{score} pts</Text>
          </View>
        </View>

        {/* Progress bar (questions) */}
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {QUESTIONS.map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < currentQ ? '#E8591A' : i === currentQ ? '#E8591A60' : '#E5E0D8' }}
            />
          ))}
        </View>
        <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 5 }}>Question {currentQ + 1} sur {QUESTIONS.length}</Text>
      </View>

      {/* Timer progress */}
      <View style={{ height: 3, backgroundColor: '#F5F0EB' }}>
        <Animated.View style={{ height: '100%', backgroundColor: timeLeft <= 10 ? '#C62828' : '#E8591A', width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
      </View>

      {/* Question */}
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
        {/* Category */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: question!.categoryColor + '15' }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: question!.categoryColor }}>{question!.category}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#F5F0EB' }}>
            <Text style={{ fontSize: 11, color: '#6D4C41' }}>{question!.region}</Text>
          </View>
          <Text style={{ fontSize: 11, color: '#8C8278' }}>+{question!.points} pts</Text>
        </View>

        {/* Question card */}
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_MD }}>
          <Text style={{ fontSize: 17, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', lineHeight: 26 }}>
            {question!.question}
          </Text>
        </View>

        {/* Options */}
        <View style={{ gap: 10 }}>
          {question!.options.map((option) => {
            const style = getOptionStyle(option);
            const isCorrect = phase === 'answered' && option === question!.correct;
            const isWrong = phase === 'answered' && option === selected && option !== question!.correct;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => handleAnswer(option)}
                disabled={phase === 'answered'}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: style.bg, borderRadius: 16, borderWidth: 2, borderColor: style.border, gap: 12 }}
                activeOpacity={0.8}
              >
                <Text style={{ flex: 1, fontSize: 15, color: style.text, fontWeight: '500' }}>{option}</Text>
                {isCorrect && <Icon name="Check" size={18} color="#2E7D32" />}
                {isWrong && <Icon name="X" size={18} color="#C62828" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
