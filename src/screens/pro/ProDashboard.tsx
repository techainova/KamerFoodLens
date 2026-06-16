import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const QUICK_ACTIONS = [
  { icon: 'ShoppingBag' as const, label: 'Commandes',  badge: '3',  route: 'ProOrders'       },
  { icon: 'DollarSign'  as const, label: 'Revenus',    badge: null, route: 'ProRevenues'      },
  { icon: 'ChefHat'     as const, label: 'Menu',       badge: null, route: 'RestaurantMenu'   },
  { icon: 'Tag'         as const, label: 'Promos',     badge: null, route: 'ProPromos'        },
  { icon: 'Users'       as const, label: 'Communauté', badge: null, route: 'ManageCommunity'  },
  { icon: 'BarChart2'   as const, label: 'Analytics',  badge: null, route: 'ProAnalytics'     },
];

const RECENT_ORDERS = [
  { id: '#KFL-4825', client: 'Sami N.',   total: 13000, status: 'new',       time: '14:38' },
  { id: '#KFL-4822', client: 'Adèle B.',  total: 6500,  status: 'preparing', time: '14:21' },
];

export default function ProDashboard() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="light-content" />

      {/* Pro header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, backgroundColor: '#1A237E' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'PlayfairDisplay-Bold' }}>Chez Mama Pauline</Text>
              <View style={{ backgroundColor: '#F9A825', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>PRO</Text>
              </View>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Lundi 15 Juin 2026</Text>
          </View>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bell" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Revenue card */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: '#1A237E', marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Revenus ce mois</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 8 }}>195 400 XAF</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#2E7D32', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
              <Icon name="TrendingUp" size={11} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>+12% vs mois dernier</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            {[{ v: '47', l: 'Commandes' }, { v: '4.8', l: 'Note' }, { v: '98%', l: 'Acceptation' }].map((s, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{s.v}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick actions */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>Actions rapides</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {QUICK_ACTIONS.map((action, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate(action.route)}
              style={{ alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', width: '30%', ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              <View style={{ position: 'relative', marginBottom: 6 }}>
                <Icon name={action.icon} size={26} color="#E8591A" />
                {action.badge && (
                  <View style={{ position: 'absolute', top: -4, right: -8, width: 18, height: 18, backgroundColor: '#C62828', borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{action.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#2C1810' }}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent orders */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>Commandes récentes</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
          {RECENT_ORDERS.map((order, i) => (
            <TouchableOpacity
              key={i}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < RECENT_ORDERS.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{order.id} · {order.client}</Text>
                <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 2 }}>{order.time}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810', marginRight: 8 }}>{order.total.toLocaleString()} XAF</Text>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: order.status === 'new' ? '#FEF3EC' : '#FBF3DC' }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: order.status === 'new' ? '#E8591A' : '#F9A825' }}>
                  {order.status === 'new' ? 'Nouvelle' : 'En prépa.'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
