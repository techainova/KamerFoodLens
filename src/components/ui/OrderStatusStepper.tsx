// src/components/ui/OrderStatusStepper.tsx
// Barre de progression de commande — points reliés, franchis/courant/à venir.
// Adaptation du même principe structurel qu'un traceur d'expédition classique,
// mais sur les 6 vraies étapes du cycle de vie d'une commande KFL.
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useAppTheme';
import { ORDER_STATUS_STEPS } from '@/utils/orderStatus';
import type { OrderStatus } from '@/services/orders.service';

interface Props {
  status: OrderStatus;
}

export default function OrderStatusStepper({ status }: Props) {
  const { t } = useTranslation();
  const C = useColors();

  if (status === 'cancelled') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.error }} />
        <Text style={{ fontSize: 12, color: C.error, fontWeight: '600' }}>{t('order.statuses.cancelled')}</Text>
      </View>
    );
  }

  const currentIndex = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      {ORDER_STATUS_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === ORDER_STATUS_STEPS.length - 1;
        const filled = isDone || isCurrent;

        return (
          <View key={step} style={{ flex: isLast ? 0 : 1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <View
                style={{
                  width: isCurrent ? 14 : 10, height: isCurrent ? 14 : 10, borderRadius: 7,
                  backgroundColor: filled ? '#E8591A' : C.surface,
                  borderWidth: isCurrent ? 3 : isDone ? 0 : 1.5,
                  borderColor: isCurrent ? '#FBD8C4' : C.border,
                }}
              />
              {!isLast && (
                <View style={{ flex: 1, height: 2, backgroundColor: isDone ? '#E8591A' : C.border }} />
              )}
            </View>
            <Text
              numberOfLines={2}
              style={{ fontSize: 9.5, color: isCurrent ? C.ink : C.inkMute, fontWeight: isCurrent ? '700' : '500', textAlign: 'center', marginTop: 6, maxWidth: 56 }}
            >
              {t(`order.statuses.${step}`)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
