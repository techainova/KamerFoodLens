import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_MD, SHADOW_SM } from '@/constants/theme';
import { useAuthStore } from '@/store/auth.store';
import { paymentsService, type WalletBalance, type WalletTransaction } from '@/services/payments.service';

type IconName = Parameters<typeof Icon>[0]['name'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function WalletScreen() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const role = useAuthStore((s) => s.user?.role);

  const [wallet, setWallet] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [walletData, txData] = await Promise.all([
        paymentsService.getWallet(),
        paymentsService.getTransactions(1),
      ]);
      setWallet(walletData);
      setTransactions(txData.items.slice(0, 5));
    } catch {
      Alert.alert('Erreur', "Impossible de charger votre portefeuille. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleWithdraw = () => {
    if (role === 'pro') {
      navigation.navigate('ProRevenues');
      return;
    }
    Alert.alert(
      'Retrait indisponible',
      "Le solde de votre portefeuille sert à payer vos achats KFL (tombola, formations, événements) et ne peut pas être retiré. Seuls les comptes professionnels peuvent retirer leurs revenus depuis leur tableau de bord.",
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Mon Portefeuille</Text>
        <TouchableOpacity
          style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.navigate('TransactionHistory')}
        >
          <Icon name="List" size={16} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }} showsVerticalScrollIndicator={false}>

        {/* Balance hero */}
        <View style={{ borderRadius: 24, backgroundColor: '#1A237E', padding: 24, ...SHADOW_MD }}>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Solde disponible
          </Text>
          <Text style={{ fontSize: 36, fontFamily: 'PlayfairDisplay-Bold', color: '#fff', marginBottom: 4 }}>
            {(wallet?.balanceXAF ?? 0).toLocaleString()}{' '}
            <Text style={{ fontSize: 18, fontWeight: '400' }}>XAF</Text>
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 22 }}>
            <Icon name="Shield" size={12} color="rgba(255,255,255,0.4)" />
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Chiffré AES-256 · Sécurisé</Text>
          </View>

          {/* Quick actions */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { label: 'Recharger', icon: 'Plus'  as IconName, onPress: () => navigation.navigate('Payment') },
              { label: 'Retirer',   icon: 'ArrowUp' as IconName, onPress: handleWithdraw },
              { label: 'Historique',icon: 'List'  as IconName, onPress: () => navigation.navigate('TransactionHistory') },
            ].map(action => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                style={{ flex: 1, alignItems: 'center', gap: 6 }}
                activeOpacity={0.75}
              >
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={action.icon} size={18} color="#fff" />
                </View>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent transactions */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>Transactions récentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#E8591A' }}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          {transactions.length === 0 ? (
            <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 24, alignItems: 'center', ...SHADOW_SM }}>
              <Icon name="Wallet" size={28} color={C.inkMute} />
              <Text style={{ fontSize: 13, color: C.inkMute, marginTop: 8 }}>Aucune transaction pour le moment</Text>
            </View>
          ) : (
            <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {transactions.map((tx, i) => (
                <View key={tx.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border }}>
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: tx.type === 'credit' ? '#E3F0E4' : '#FEF3EC', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={tx.type === 'credit' ? 'ArrowDown' : 'ArrowUp'} size={16} color={tx.type === 'credit' ? '#2E7D32' : '#E8591A'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }} numberOfLines={1}>{tx.description || (tx.type === 'credit' ? 'Recharge' : 'Paiement')}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{formatDate(tx.createdAt)}</Text>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: tx.type === 'credit' ? '#2E7D32' : '#E8591A' }}>
                    {tx.type === 'credit' ? '+' : '-'}{tx.amountXAF.toLocaleString()} XAF
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Recharge CTA */}
        <TouchableOpacity
          style={{ height: 52, backgroundColor: '#E8591A', borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Payment')}
        >
          <Icon name="Plus" size={18} color="#fff" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Recharger mon portefeuille</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
