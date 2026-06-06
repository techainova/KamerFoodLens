// src/screens/order/OrderMenu.tsx
// Menu restaurant + panier — C1

import React from 'react';
import {
  FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useOrder } from '@/hooks/useOrder';
import { WFButton } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const CATEGORIES = ['Tout', 'Plats princ.', 'Soupes', 'Grillades', 'Boissons'];

export default function OrderMenu() {
  const navigation = useNavigation();
  const { menu, cart, total, addItem, removeItem, getQty } = useOrder();
  const [activeCategory, setActiveCategory] = React.useState('Tout');
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.restaurantName}>Menu · Chez Maman Pauline</Text>
          <Text style={styles.restaurantSub}>Restaurant menu</Text>
        </View>
        {totalItems > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{totalItems}</Text>
          </View>
        )}
      </View>

      {/* Info restaurant */}
      <View style={styles.restaurantInfo}>
        <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>✓ Vérifié</Text></View>
        <Text style={styles.restaurantMeta}>· Akwa · Douala</Text>
        <Text style={styles.openText}>🟢 Ouvert jusqu'à 22h</Text>
      </View>

      {/* Catégories */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(c) => c}
        contentContainerStyle={styles.catsRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveCategory(item)}
            style={[styles.catBtn, activeCategory === item && styles.catBtnActive]}
          >
            <Text style={[styles.catText, activeCategory === item && styles.catTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Date menu */}
      <Text style={styles.menuDate}>MENU DU JOUR · LUNDI 24 NOV / Today's menu</Text>

      {/* Items */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.itemsList}>
        {menu.map((item) => {
          const qty = getQty(item.id);
          return (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemImage}>
                <Text style={styles.menuItemEmoji}>{item.emoji}</Text>
              </View>
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemCategory}>{item.category}</Text>
                <Text style={styles.menuItemDesc} numberOfLines={1}>{item.desc}</Text>
                <Text style={styles.menuItemPrice}>{item.priceXAF.toLocaleString()} XAF</Text>
              </View>
              <View style={styles.menuItemQty}>
                {qty > 0 ? (
                  <View style={styles.qtyControl}>
                    <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{qty}</Text>
                    <TouchableOpacity onPress={() => addItem(item)} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => addItem(item)} style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Panier sticky */}
      {totalItems > 0 && (
        <View style={styles.cartBar}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItems}>🛒 {totalItems} articles dans votre panier</Text>
            <Text style={styles.cartRestaurant}>Chez Maman Pauline</Text>
          </View>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('OrderSummary' as never)}
            accessibilityLabel="Voir le récapitulatif"
          >
            <Text style={styles.cartBtnTotal}>{total.toLocaleString()} XAF</Text>
            <Text style={styles.cartBtnText}>Voir le récapitulatif →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  header:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm },
  backBtn: { padding: spacing.xs },
  backIcon:{ fontSize: 28, color: colors.ink },
  restaurantName:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  restaurantSub: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  cartBadge: { marginLeft: 'auto', backgroundColor: colors.primary, borderRadius: radius.full, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText:{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },

  restaurantInfo:{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.sm },
  verifiedBadge: { backgroundColor: colors.successSoft, borderRadius: radius.sm, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  verifiedText:  { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.success },
  restaurantMeta:{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },
  openText:      { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.success, marginLeft: 'auto' },

  catsRow:    { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
  catBtn:     { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  catBtnActive:{ backgroundColor: colors.primary, borderColor: colors.primary },
  catText:    { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  catTextActive:{ color: colors.white },

  menuDate:   { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.inkMute, paddingHorizontal: spacing.md, marginBottom: spacing.sm, letterSpacing: 0.5 },

  itemsList:  { flex: 1 },
  menuItem:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm },
  menuItemImage: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  menuItemEmoji: { fontSize: 28 },
  menuItemInfo:  { flex: 1 },
  menuItemName:  { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  menuItemCategory:{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  menuItemDesc:  { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkSoft },
  menuItemPrice: { fontFamily: fontFamily.serifBold, fontSize: fontSize.md, color: colors.primary, marginTop: 2 },

  menuItemQty: { alignItems: 'center' },
  qtyControl:  { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qtyBtn:      { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText:  { fontSize: 18, color: colors.primary, lineHeight: 22 },
  qtyValue:    { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink, minWidth: 20, textAlign: 'center' },
  addBtn:      { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  addBtnText:  { fontSize: 20, color: colors.white, lineHeight: 24 },

  cartBar:    { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.ink, padding: spacing.md },
  cartInfo:   { marginBottom: spacing.xs },
  cartItems:  { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.white },
  cartRestaurant:{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  cartBtn:    { backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg },
  cartBtnTotal:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
  cartBtnText: { fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.white },
});
