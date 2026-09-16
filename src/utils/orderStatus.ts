// src/utils/orderStatus.ts
// Source unique de vérité pour l'apparence d'un statut de commande — avant
// cette extraction, OrderInvoice.tsx et OrderHistory.tsx avaient chacun leur
// propre mapping de couleurs, en désaccord l'un avec l'autre (ex. "confirmée"
// n'avait pas la même couleur selon l'écran).
import type { OrderStatus } from '@/services/orders.service';
import type { useColors } from '@/hooks/useAppTheme';
import type { IconName } from '@/components/ui/Icon';

export interface OrderStatusVisual {
  icon: IconName;
  color: string;
  bg: string;
  border: string;
}

// Étapes réelles du cycle de vie d'une commande, dans l'ordre — utilisées à la
// fois pour un badge de statut et pour le stepper visuel de OrderInvoice.
// 'cancelled' n'est pas une étape de ce parcours, c'est un état terminal à part.
export const ORDER_STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed'];

export function getOrderStatusVisual(status: OrderStatus, C: ReturnType<typeof useColors>): OrderStatusVisual {
  switch (status) {
    case 'pending':    return { icon: 'Clock',   color: C.gold,    bg: C.goldSoft,    border: C.gold };
    case 'confirmed':  return { icon: 'Check',   color: C.navy,    bg: C.navySoft,    border: C.navy };
    case 'preparing':  return { icon: 'ChefHat', color: C.navy,    bg: C.navySoft,    border: C.navy };
    case 'ready':      return { icon: 'Check',   color: C.success, bg: C.successSoft, border: C.success };
    case 'delivering': return { icon: 'Truck',   color: C.success, bg: C.successSoft, border: C.success };
    case 'completed':  return { icon: 'Check',   color: C.success, bg: C.successSoft, border: C.success };
    case 'cancelled':  return { icon: 'X',       color: C.error,   bg: C.errorSoft,   border: C.error };
    default:           return { icon: 'Clock',   color: C.inkMute, bg: C.surface2,    border: C.border };
  }
}
