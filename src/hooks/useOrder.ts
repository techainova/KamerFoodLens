// src/hooks/useOrder.ts
// Logique commande restaurant — panier + paiement + facture

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export interface MenuItem {
  id:       string;
  name:     string;
  nameEN:   string;
  category: string;
  priceXAF: number;
  desc:     string;
  emoji:    string;
}

export interface CartItem extends MenuItem {
  qty: number;
}

export type PayMethod = 'orange_money' | 'mtn_momo' | 'card';

const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Ndolé aux crevettes', nameEN: 'Shrimp Ndolé', category: 'Plat principal', priceXAF: 3500, desc: 'Plat mijoté aux feuilles, arachides pilées', emoji: '🍲' },
  { id: '2', name: 'Poulet DG',           nameEN: 'DG Chicken',   category: 'Plat principal', priceXAF: 4500, desc: 'Poulet sauté avec plantains mûrs',        emoji: '🍗' },
  { id: '3', name: 'Plantains frits',     nameEN: 'Fried Plantains', category: 'Accompagnement', priceXAF: 1500, desc: 'Plantains mûrs dorés à point',          emoji: '🍌' },
  { id: '4', name: 'Eau minérale Tangui', nameEN: 'Tangui Water', category: 'Boisson',        priceXAF: 1000, desc: 'Bouteille 50cl',                          emoji: '💧' },
];

export function useOrder() {
  const navigation  = useNavigation();
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [payMethod, setPayMethod] = useState<PayMethod>('orange_money');
  const [note, setNote]           = useState('');
  const [loading, setLoading]     = useState(false);

  const total = cart.reduce((sum, i) => sum + i.qty * i.priceXAF, 0);

  function addItem(item: MenuItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeItem(id: string) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  }

  function getQty(id: string): number {
    return cart.find((c) => c.id === id)?.qty ?? 0;
  }

  async function placeOrder() {
    if (cart.length === 0) return;
    setLoading(true);
    // Simuler paiement mock
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    navigation.navigate('OrderInvoice' as never);
  }

  return {
    menu: MOCK_MENU, cart, total, payMethod, note, loading,
    addItem, removeItem, getQty, setPayMethod, setNote, placeOrder,
  };
}
