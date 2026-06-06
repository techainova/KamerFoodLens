// src/screens/order/OrderInvoice.tsx
// Facture numérique — N° unique + QR code + partage — C4

import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, fontFamily, fontSize, radius, spacing, shadows } from '@/constants/theme';

// QR Code placeholder (react-native-qrcode-svg requis en production)
function QRPlaceholder() {
  return (
    <View style={styles.qrPlaceholder}>
      <Text style={styles.qrEmoji}>▣</Text>
      <Text style={styles.qrHint}>QR Code</Text>
    </View>
  );
}

export default function OrderInvoice() {
  const navigation = useNavigation();
  const INVOICE_REF = 'KFL-2026-MP-00847';
  const DATE        = '24 Nov 2026 · 14:32';

  const ITEMS = [
    { name: 'Ndolé aux crevettes', qty: 2, priceXAF: 7000 },
    { name: 'Plantains frits',     qty: 1, priceXAF: 1500 },
    { name: 'Eau minérale Tangui', qty: 2, priceXAF: 2000 },
  ];
  const total = ITEMS.reduce((s, i) => s + i.priceXAF, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Facture card */}
        <View style={[styles.invoiceCard, shadows.lg]}>
          {/* Header facture */}
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceLogoRow}>
              <View style={styles.invoiceLogo}><Text style={styles.invoiceLogoText}>KFL</Text></View>
              <View>
                <Text style={styles.invoiceRestaurant}>Chez Maman Pauline</Text>
                <Text style={styles.invoiceVerified}>✓ Établissement vérifié KFL</Text>
                <Text style={styles.invoiceAddress}>Akwa · Douala · +237 6XX XX XX XX</Text>
              </View>
            </View>
            <View style={styles.dividerDashed} />
            <Text style={styles.invoiceLabel}>FACTURE N°</Text>
            <Text style={styles.invoiceRef}>{INVOICE_REF}</Text>
            <View style={styles.invoiceMeta}>
              <View>
                <Text style={styles.invoiceMetaLabel}>DATE</Text>
                <Text style={styles.invoiceMetaValue}>{DATE}</Text>
              </View>
              <View>
                <Text style={styles.invoiceMetaLabel}>CLIENT</Text>
                <Text style={styles.invoiceMetaValue}>@amah_ndongo</Text>
              </View>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>✓ PAYÉE / PAID</Text>
              </View>
            </View>
          </View>

          <View style={styles.dividerDashed} />

          {/* Lignes commande */}
          <Text style={styles.orderSection}>COMMANDE / ORDER</Text>
          {ITEMS.map((item) => (
            <View key={item.name} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name} × {item.qty}</Text>
              <Text style={styles.itemPrice}>{item.priceXAF.toLocaleString()} XAF</Text>
            </View>
          ))}

          <View style={styles.dividerDashed} />

          {/* Totaux */}
          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total</Text>
              <Text style={styles.totalValue}>{total.toLocaleString()} XAF</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Frais de service</Text>
              <Text style={styles.totalValue}>0 XAF</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA (0%)</Text>
              <Text style={styles.totalValue}>0 XAF</Text>
            </View>
            <View style={[styles.totalRow, styles.totalFinalRow]}>
              <Text style={styles.totalFinalLabel}>TOTAL PAYÉ</Text>
              <Text style={styles.totalFinalValue}>{total.toLocaleString()} XAF</Text>
            </View>
          </View>

          <View style={styles.dividerDashed} />

          {/* Paiement */}
          <View style={styles.paymentBlock}>
            <Text style={styles.paymentTitle}>PAIEMENT / PAYMENT</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Méthode</Text>
              <Text style={styles.paymentValue}>🟠 Orange Money</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Référence</Text>
              <Text style={styles.paymentValue}>OM-TXN-48291847</Text>
            </View>
          </View>

          <View style={styles.dividerDashed} />

          {/* QR Code */}
          <View style={styles.qrBlock}>
            <QRPlaceholder />
            <Text style={styles.qrInstruction}>
              Scannez ce code ou montrez cette facture à votre arrivée
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} accessibilityLabel="Télécharger PDF">
            <Text style={styles.actionBtnEmoji}>⬇️</Text>
            <Text style={styles.actionBtnText}>Télécharger en PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} accessibilityLabel="Partager WhatsApp">
            <Text style={styles.actionBtnEmoji}>💬</Text>
            <Text style={styles.actionBtnText}>Partager sur WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} accessibilityLabel="Imprimer">
            <Text style={styles.actionBtnEmoji}>🖨️</Text>
            <Text style={styles.actionBtnText}>Imprimer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('HomeScreen' as never)}
          accessibilityLabel="Retour à l'accueil"
        >
          <Text style={styles.homeBtnText}>Retour à l'accueil</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.surface2 },
  container: { padding: spacing.md },

  invoiceCard:  { backgroundColor: colors.ink, borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.md },
  invoiceHeader:{ padding: spacing.lg },
  invoiceLogoRow:{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  invoiceLogo:  { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  invoiceLogoText:{ fontFamily: fontFamily.serifBold, fontSize: fontSize.md, color: colors.ink },
  invoiceRestaurant:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
  invoiceVerified:  { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.success },
  invoiceAddress:   { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },

  dividerDashed:{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed', marginVertical: spacing.md },

  invoiceLabel: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  invoiceRef:   { fontFamily: fontFamily.bold, fontSize: fontSize.xl, color: colors.primary, marginBottom: spacing.md },
  invoiceMeta:  { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  invoiceMetaLabel:{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.5)' },
  invoiceMetaValue:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.white },
  paidBadge:    { marginLeft: 'auto', backgroundColor: colors.successSoft, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  paidText:     { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.success },

  orderSection: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  itemRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  itemName:     { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.white, flex: 1 },
  itemPrice:    { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.white },

  totalsBlock:  { paddingHorizontal: spacing.lg },
  totalRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  totalLabel:   { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  totalValue:   { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.white },
  totalFinalRow:{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: spacing.sm, marginTop: spacing.xs },
  totalFinalLabel:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
  totalFinalValue:{ fontFamily: fontFamily.serifBold, fontSize: fontSize.lg, color: colors.primary },

  paymentBlock: { paddingHorizontal: spacing.lg },
  paymentTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: spacing.sm },
  paymentRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  paymentLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  paymentValue: { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.white },

  qrBlock:      { alignItems: 'center', padding: spacing.lg },
  qrPlaceholder:{ width: 120, height: 120, backgroundColor: colors.surface, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  qrEmoji:      { fontSize: 60, color: colors.ink },
  qrHint:       { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.inkMute },
  qrInstruction:{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },

  actions:      { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  actionBtn:    { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.border },
  actionBtnEmoji:{ fontSize: 20 },
  actionBtnText: { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.inkSoft, textAlign: 'center' },

  homeBtn:      { backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center' },
  homeBtnText:  { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
});
