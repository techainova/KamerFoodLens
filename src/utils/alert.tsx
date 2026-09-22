// src/utils/alert.tsx
// react-native-web's Alert.alert() is a no-op (`static alert() {}` — see
// node_modules/react-native-web/src/exports/Alert/index.js). On native this
// module simply forwards to the real Alert; on web it renders an actual modal
// so confirmation dialogs (cancel/delete/etc.) and error messages are usable.
import React, { useEffect, useState } from 'react';
import {
  Alert as RNAlert,
  AlertButton,
  AlertOptions,
  Modal,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useColors } from '@/hooks/useAppTheme';

interface PendingAlert {
  title: string;
  message?: string;
  buttons: AlertButton[];
}

type Listener = (alert: PendingAlert) => void;
let listener: Listener | null = null;

function showWebAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  const normalized: AlertButton[] = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];
  if (listener) {
    listener({ title, message, buttons: normalized });
  } else {
    // AlertHost not mounted yet — fall back so the message is not lost.
    // eslint-disable-next-line no-alert
    window.alert(message ? `${title}\n\n${message}` : title);
  }
}

export const Alert = {
  alert(title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions): void {
    if (Platform.OS === 'web') {
      showWebAlert(title, message, buttons);
    } else {
      RNAlert.alert(title, message, buttons, options);
    }
  },
};

export function AlertHost(): React.ReactElement | null {
  const C = useColors();
  const [pending, setPending] = useState<PendingAlert | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    listener = setPending;
    return () => {
      listener = null;
    };
  }, []);

  if (Platform.OS !== 'web' || !pending) return null;

  const dismiss = (btn: AlertButton) => {
    setPending(null);
    btn.onPress?.();
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => setPending(null)}>
      <TouchableWithoutFeedback onPress={() => setPending(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <TouchableWithoutFeedback>
            <View style={{ width: '100%', maxWidth: 360, backgroundColor: C.surface, borderRadius: 16, padding: 20 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: C.ink, marginBottom: pending.message ? 8 : 16 }}>
                {pending.title}
              </Text>
              {pending.message ? (
                <Text style={{ fontSize: 14, color: C.inkSoft, marginBottom: 16, lineHeight: 20 }}>
                  {pending.message}
                </Text>
              ) : null}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                {pending.buttons.map((btn, i) => (
                  <TouchableOpacity key={i} onPress={() => dismiss(btn)} style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: btn.style === 'cancel' ? '500' : '700',
                        color: btn.style === 'destructive' ? C.error : btn.style === 'cancel' ? C.inkMute : C.primary,
                      }}
                    >
                      {btn.text ?? 'OK'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
