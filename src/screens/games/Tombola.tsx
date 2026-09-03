import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM, SHADOW_MD } from '@/constants/theme';
import { useTombolaStore } from '@/store/tombola.store';

function countdown(targetIso: string): { j: string; h: string; m: string; s: string } {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const totalSec = Math.floor(diff / 1000);
  return {
    j: String(Math.floor(totalSec / 86400)).padStart(2, '0'),
    h: String(Math.floor((totalSec % 86400) / 3600)).padStart(2, '0'),
    m: String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0'),
    s: String(totalSec % 60).padStart(2, '0'),
  };
}

export default function Tombola() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [ticketCount, setTicketCount] = useState(1);
  const [tick, setTick] = useState(0);
  const [buying, setBuying] = useState(false);

  const active = useTombolaStore(s => s.active);
  const myTickets = useTombolaStore(s => s.myTickets);
  const isLoading = useTombolaStore(s => s.isLoading);
  const fetchActive = useTombolaStore(s => s.fetchActive);
  const fetchMyTickets = useTombolaStore(s => s.fetchMyTickets);
  const buyTickets = useTombolaStore(s => s.buyTickets);

  const TICKET_PRICE = active?.pricePerTicketXAF ?? 0;
  const total = ticketCount * TICKET_PRICE;

  useEffect(() => {
    void fetchActive();
  }, [fetchActive]);

  useEffect(() => {
    if (active) void fetchMyTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  useEffect(() => {
    const id = setInterval(() => setTick(prev => prev + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const cd = active ? countdown(active.drawAt) : { j: '00', h: '00', m: '00', s: '00' };

  const handleBuy = async () => {
    if (!active || buying) return;
    setBuying(true);
    try {
      const newTickets = await buyTickets(ticketCount);
      Alert.alert(
        t('games.purchaseConfirmed'),
        `${t('games.ticketsBought', { count: ticketCount })}\n\n${t('games.ticketNumbers')} : ${newTickets.map(tk => `#${tk.ticketNumber}`).join(', ')}`,
        [{ text: t('games.great') }]
      );
    } catch {
      Alert.alert(t('common.error'), t('games.buyTicketsError'));
    } finally {
      setBuying(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('games.tombola')}</Text>
        {!!active && (
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: C.goldSoft }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#F9A825' }}>J-{cd.j}</Text>
          </View>
        )}
      </View>

      {isLoading && !active ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : !active ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Icon name="Gift" size={48} color={C.inkMute} />
          <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center', marginTop: 16 }}>{t('games.noTombolaActive')}</Text>
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

            {/* Countdown hero */}
            <View style={{ margin: 16, borderRadius: 20, backgroundColor: '#F9A825', padding: 20, ...SHADOW_MD }}>
              <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('games.nextDraw')}</Text>
              <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 16 }}>{active.title}</Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                {[{ v: cd.j, l: 'JOURS' }, { v: cd.h, l: 'HEURES' }, { v: cd.m, l: 'MIN' }, { v: cd.s, l: 'SEC' }].map(({ v, l }) => (
                  <View key={l} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 12, paddingVertical: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: C.ink, fontFamily: 'JetBrainsMono-Regular' }}>{v}</Text>
                    <Text style={{ fontSize: 9, color: 'rgba(0,0,0,0.5)', letterSpacing: 0.5 }}>{l}</Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}>
                <Icon name="Ticket" size={15} color="rgba(0,0,0,0.5)" />
                <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>
                  {t('games.soldTicketsOf', { sold: active.soldCount, total: active.maxTickets })}
                </Text>
              </View>
            </View>

            {/* My tickets */}
            <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ flex: 1, fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>{t('games.myTickets')} ({myTickets.length})</Text>
              </View>

              {myTickets.length === 0 ? (
                <View style={{ padding: 20, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center' }}>
                  <Icon name="Ticket" size={28} color="rgba(140,130,120,0.3)" />
                  <Text style={{ fontSize: 13, color: C.inkMute, marginTop: 8 }}>{t('games.noTickets')}</Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                  {myTickets.map(ticket => (
                    <View
                      key={ticket.id}
                      style={{ width: 170, backgroundColor: C.surface, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: '#E5E0D8', ...SHADOW_SM }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Icon name="Ticket" size={18} color="#E8591A" />
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#2C1810', fontFamily: 'JetBrainsMono-Regular' }}>#{ticket.ticketNumber}</Text>
                      </View>
                      <Text style={{ fontSize: 10, color: '#8C8278' }}>
                        {t('games.purchasedOn', { date: new Date(ticket.purchasedAt).toLocaleDateString() })}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Prizes */}
            <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('games.prizes')}</Text>
              <View style={{ gap: 10 }}>
                {active.prizes.map((prize, i) => {
                  const colors = ['#F9A825', '#8C8278', '#E8591A', '#2E7D32'];
                  const c = colors[i % colors.length];
                  return (
                    <View key={prize.rank} style={{ backgroundColor: C.surface, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c + '15', borderWidth: 1.5, borderColor: c + '40', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 22 }}>{prize.icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: c + '15', alignSelf: 'flex-start', marginBottom: 4 }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: c }}>{prize.label}</Text>
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink, marginBottom: 1 }}>{prize.description}</Text>
                        <Text style={{ fontSize: 11, color: C.inkMute }}>{t('games.prizeValue', { value: prize.value })}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Buy ticket footer */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Text style={{ flex: 1, fontSize: 14, color: C.inkSoft }}>{t('games.ticketQuantityLabel', { price: TICKET_PRICE.toLocaleString() })}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
                <TouchableOpacity onPress={() => setTicketCount(n => Math.max(1, n - 1))} style={{ width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ChevronLeft" size={18} color="#6D4C41" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: C.ink, width: 40, textAlign: 'center' }}>{ticketCount}</Text>
                <TouchableOpacity onPress={() => setTicketCount(n => Math.min(10, n + 1))} style={{ width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ChevronRight" size={18} color="#6D4C41" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => void handleBuy()}
              disabled={buying}
              style={{ height: 52, borderRadius: 16, backgroundColor: '#F9A825', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              activeOpacity={0.85}
            >
              {buying ? (
                <ActivityIndicator color="#2C1810" />
              ) : (
                <>
                  <Icon name="Ticket" size={18} color="#2C1810" />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink }}>
                    {t('games.buyTicketsCta', { count: ticketCount, total: total.toLocaleString() })}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
