import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/types';
import KFLLogo from '@/components/ui/KFLLogo';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useStoriesStore, buildStoryGroups } from '@/store/stories.store';
import { RECIPES, DIFF_LABELS } from '@/data/recipes';
import { WEEKLY_EVENTS } from '@/data/events';

export default function HomeV1() {
  const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const myStories = useStoriesStore((s) => s.myStories);
  const [registered, setRegistered] = useState(false);

  const event = WEEKLY_EVENTS[0];
  const popular = RECIPES.slice(0, 3);
  const storyGroups = buildStoryGroups(myStories);
  const myGroup = storyGroups.find((g) => g.isMine);
  const otherGroups = storyGroups.filter((g) => !g.isMine);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      {/* Top bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <KFLLogo size={34} />
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          {/* Layout switcher 6a → 6b */}
          <TouchableOpacity
            style={{ width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#E8591A', backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => nav.dispatch(StackActions.replace('HomeV2'))}
          >
            <Icon name="Grid" size={16} color="#E8591A" />
          </TouchableOpacity>
          {/* Bell with red dot */}
          <TouchableOpacity
            style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => nav.navigate('Notifications')}
          >
            <Icon name="Bell" size={18} color="#6D4C41" />
            <View style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#C62828', borderWidth: 1.5, borderColor: '#fff' }} />
          </TouchableOpacity>
          {/* Avatar initials */}
          <TouchableOpacity onPress={() => nav.navigate('ProfileScreen')} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: 'Inter-Bold' }}>AN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Hero scanner CTA */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#2C1810', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            onPress={() => nav.navigate('Camera')}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 19, color: '#fff', lineHeight: 24 }}>
                {t('home.scanCTA')}
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 17 }}>
                {t('home.scanSubtitle')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                {[t('scanner.photo'), t('scanner.audio'), t('scanner.text')].map((m, i) => (
                  <View key={i} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500' }}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Camera" size={26} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <TouchableOpacity
            style={{ height: 46, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}
            onPress={() => nav.navigate('Search')}
            activeOpacity={0.7}
          >
            <Icon name="Search" size={16} color="#8C8278" />
            <Text style={{ flex: 1, color: C.inkMute, fontSize: 13 }}>{t('home.search')}</Text>
            <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Mic" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Stories */}
        <View style={{ marginTop: 18, paddingLeft: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingRight: 16 }}>
            <Text style={{ color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('home.dishStories')}</Text>
            <TouchableOpacity onPress={() => nav.navigate('AllStories')}>
              <Text style={{ fontSize: 11, color: '#E8591A', fontWeight: '600' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16, gap: 14 }}>
            {/* Add / view your own story */}
            <TouchableOpacity
              style={{ alignItems: 'center', gap: 6 }}
              activeOpacity={0.75}
              onPress={() => myGroup ? nav.navigate('StoriesViewer', { authorId: 'me' }) : nav.navigate('AddStory')}
            >
              <View style={{ width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface2, borderWidth: 2, borderColor: myGroup ? C.gold : C.border, borderStyle: myGroup ? 'solid' : 'dashed', overflow: 'hidden' }}>
                {myGroup ? (
                  <Image
                    source={{ uri: myGroup.stories[myGroup.stories.length - 1].image as string }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Icon name="Plus" size={22} color="#E8591A" />
                )}
              </View>
              {myGroup && (
                <TouchableOpacity
                  onPress={() => nav.navigate('AddStory')}
                  style={{ position: 'absolute', top: 40, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#E8591A', borderWidth: 2, borderColor: C.cream, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="Plus" size={11} color="#fff" />
                </TouchableOpacity>
              )}
              <Text style={{ fontSize: 10.5, fontWeight: '500', color: C.inkSoft, maxWidth: 64, textAlign: 'center' }}>{t('home.yourStory')}</Text>
            </TouchableOpacity>

            {otherGroups.map((g, i) => {
              const last = g.stories[g.stories.length - 1];
              return (
                <TouchableOpacity
                  key={g.authorId}
                  style={{ alignItems: 'center', gap: 6 }}
                  activeOpacity={0.75}
                  onPress={() => nav.navigate('StoriesViewer', { authorId: g.authorId })}
                >
                  <View style={{ width: 66, height: 66, borderRadius: 33, padding: 2.5, borderWidth: 2, borderColor: i === 0 ? '#E8591A' : '#E5E0D8', overflow: 'hidden' }}>
                    <Image source={last.image as number} style={{ width: '100%', height: '100%', borderRadius: 28 }} resizeMode="cover" />
                  </View>
                  <Text style={{ fontSize: 10.5, fontWeight: '500', color: C.inkSoft, maxWidth: 64, textAlign: 'center' }}>{g.authorName}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Popular recipes */}
        <View style={{ marginTop: 18, paddingLeft: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingRight: 16 }}>
            <Text style={{ color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('home.popularRecipes')}</Text>
            <TouchableOpacity onPress={() => nav.navigate('AllRecipes')}>
              <Text style={{ fontSize: 11, color: '#E8591A', fontWeight: '600' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16, gap: 12 }}>
            {popular.map((d) => (
              <TouchableOpacity key={d.id} style={{ width: 186 }} activeOpacity={0.8} onPress={() => nav.navigate('RecipeV1')}>
                {d.image ? (
                  <Image source={d.image} style={{ width: '100%', height: 136, borderRadius: 14 }} resizeMode="cover" />
                ) : (
                  <View style={{ height: 136, backgroundColor: C.surface2, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="ChefHat" size={32} color="#E5E0D8" />
                  </View>
                )}
                <View style={{ paddingTop: 8 }}>
                  <Text style={{ color: C.ink, fontSize: 13, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>{d.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Icon name="MapPin" size={10} color="#8C8278" />
                    <Text style={{ color: C.inkMute, fontSize: 11 }}>{d.region}</Text>
                    <Text style={{ color: '#E5E0D8', fontSize: 11 }}> · </Text>
                    <Icon name="Clock" size={10} color="#8C8278" />
                    <Text style={{ color: C.inkMute, fontSize: 11 }}>{d.time}</Text>
                  </View>
                  <View
                    style={{ marginTop: 7, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: C.errorSoft }}
                  >
                    <Text style={{ color: '#E8591A', fontSize: 11, fontWeight: '600' }}>{DIFF_LABELS[d.diff]}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events this week */}
        <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('home.eventsThisWeek')}</Text>
            <TouchableOpacity onPress={() => nav.navigate('AllEvents')}>
              <Text style={{ fontSize: 11, color: '#E8591A', fontWeight: '600' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: 'hidden' }} activeOpacity={0.85} onPress={() => nav.navigate('AllEvents')}>
            <View style={{ position: 'relative' }}>
              {event.image ? (
                <Image source={event.image} style={{ width: '100%', height: 128 }} resizeMode="cover" />
              ) : (
                <View style={{ height: 128, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Calendar" size={40} color="#E5E0D8" />
                </View>
              )}
              <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: '#C62828', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{event.dateLabel}</Text>
              </View>
            </View>
            <View style={{ padding: 14 }}>
              <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{event.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Icon name="MapPin" size={11} color="#8C8278" />
                <Text style={{ color: C.inkMute, fontSize: 11 }}>{event.location} · {event.timeRange}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Users" size={12} color="#8C8278" />
                  <Text style={{ color: C.inkMute, fontSize: 11 }}>{event.attendees + (registered ? 1 : 0)} {t('events.registeredCount')}</Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation?.(); setRegistered((r) => !r); }}
                  style={{ height: 36, paddingHorizontal: 16, backgroundColor: registered ? C.successSoft : '#E8591A', borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: registered ? 1 : 0, borderColor: C.success }}
                >
                  <Text style={{ color: registered ? C.success : '#fff', fontSize: 12, fontWeight: '700' }}>
                    {registered ? t('events.registered') : t('events.register')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Daily challenge */}
        <View style={{ marginTop: 18, paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold', marginBottom: 10 }}>
            {t('games.dailyChallenge')}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: C.goldSoft, borderWidth: 1, borderColor: '#F9A825', borderRadius: 16, padding: 14 }}
            activeOpacity={0.85}
            onPress={() => nav.navigate('Games')}
          >
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Flame" size={24} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>Devinez le plat mystère</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <Icon name="Users" size={11} color="#6D4C41" />
                  <Text style={{ color: C.inkSoft, fontSize: 11 }}>1 247 joueurs</Text>
                  <Text style={{ color: '#E5E0D8' }}> · </Text>
                  <Icon name="Clock" size={11} color="#6D4C41" />
                  <Text style={{ color: C.inkSoft, fontSize: 11 }}>finit dans 4h 23m</Text>
                </View>
              </View>
              <TouchableOpacity style={{ height: 36, paddingHorizontal: 14, backgroundColor: '#E8591A', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }} onPress={() => nav.navigate('Games')}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{t('games.play')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
