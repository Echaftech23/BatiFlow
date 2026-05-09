  import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

  import { Clock, Phone } from 'lucide-react-native';

  import type { Appointment } from '@/shared/schemas/appointmentsSchemas';

  type Props = {
    item: Appointment;
    onConfirm: (id: string) => void;
    onDetails?: () => void;
    compact?: boolean;
  };

  function digitsOnly(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  function dateBadgeParts(dateKey: string): { month: string; day: string } {
    const [ys, ms, ds] = dateKey.split('-');
    const y = Number(ys);
    const mo = Number(ms);
    const dayNum = Number(ds);
    const local = new Date(
      Number.isFinite(y) && Number.isFinite(mo) && Number.isFinite(dayNum) ? y : 2026,
      Number.isFinite(mo) ? mo - 1 : 0,
      Number.isFinite(dayNum) ? dayNum : 1,
    );
    const month = local
      .toLocaleDateString('fr-FR', { month: 'short' })
      .replace(/\./g, '')
      .toUpperCase();
    return { month, day: String(local.getDate()) };
  }

  export function AppointmentCard({ item, onConfirm, onDetails, compact }: Props) {
    const onCall = async () => {
      const n = digitsOnly(item.phone);
      if (!n) {
        Alert.alert('Téléphone', 'Numéro indisponible.');
        return;
      }
      const url = `tel:${n}`;
      try {
        const ok = await Linking.canOpenURL(url);
        if (ok) await Linking.openURL(url);
        else Alert.alert('Appeler', 'Impossible d’ouvrir le composeur.');
      } catch {
        Alert.alert('Appeler', 'Impossible d’ouvrir le composeur.');
      }
    };

    const isPending = item.status === 'EN_ATTENTE';
    const accentColor = isPending ? '#F27427' : '#1A2B48';
    const badge = dateBadgeParts(item.dateKey);

    return (
      <View className="mt-5 overflow-hidden rounded-card bg-surface border border-[#E8EAEF]" style={styles.card}>
        <View className="flex-row">
          <View style={{ width: 5, backgroundColor: accentColor }} />
          <View className={`min-w-0 flex-1 p-5`}>
            <View className="flex-row items-start gap-3">
              <View
                className={`items-center justify-center rounded-full bg-muted/50 ${compact ? 'h-14 w-14' : 'h-[52px] w-[52px]'}`}
              >
                <Text
                  className={`fornt-bold font-quicksand text-muted-foreground ${compact ? 'text-[9px] leading-[11px]' : 'text-caption leading-4'}`}
                >
                  {badge.month}
                </Text>
                <Text
                  className={`font-bold font-quicksand text-navy ${compact ? 'text-[16px] leading-5' : 'text-[18px] leading-[22px]'}`}
                >
                  {badge.day}
                </Text>
              </View>

              <View className="min-w-0 flex-1">
                <View className="flex-row items-start justify-between gap-2">
                  <View className="min-w-0 flex-1">
                    <Text className="font-semibold font-quicksand text-subtitle text-navy" numberOfLines={2}>
                      {item.clientName}
                    </Text>
                    <View className="mt-1 flex-row items-center gap-1">
                      <Clock size={14} color="#6B7280" />
                      <Text className="font-normal font-sans text-body text-muted-foreground" numberOfLines={1}>
                        {item.timeLabel} {'\u2022'} {item.durationLabel}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`shrink-0 rounded-full px-2.5 py-1 ${
                      isPending ? 'bg-[#FEF3C7]' : 'bg-[#DCFCE7]'
                    }`}
                  >
                    <Text
                      className={`font-sans-semibold text-caption ${
                        isPending ? 'text-[#B45309]' : 'text-[#166534]'
                      }`}
                    >
                      {isPending ? 'EN ATTENTE' : 'CONFIRMÉ'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className={`mt-4 rounded-[6px] bg-[#F8FAFC] border border-[#E8EAEF] px-5 py-5`}>
              <Text className="font-sans-bold text-body text-navy" numberOfLines={2}>
                {item.serviceLabel}
              </Text>
              {item.addressLine ? (
                <Text className="font-sans mt-1 text-badge text-[#94A3B8]" numberOfLines={2}>
                  {item.addressLine}
                </Text>
              ) : null}
            </View>

            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={() =>
                  onDetails ? onDetails() : Alert.alert('Détails', 'Bientôt disponible.')
                }
                className={`flex-1 rounded-full bg-[#F1F5F9] ${compact ? 'py-2.5' : 'py-3'}`}
              >
                <Text className="text-center font-sans-semibold text-badge text-navy">Détails</Text>
              </Pressable>
              {isPending ? (
                <Pressable
                  onPress={() => onConfirm(item.id)}
                  className={`flex-1 rounded-full border border-[#E5E5E5] bg-transparent ${compact ? 'py-2.5' : 'py-3'}`}
                >
                  <Text className="text-center font-semibold font-Inter text-badge text-primary">
                    Confirmer
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={onCall}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-full bg-navy ${compact ? 'py-2.5' : 'py-3'}`}
                >
                  <Phone size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text className="font-semibold font-Inter text-badge text-on-primary">Appeler</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    card: {
      shadowColor: "#1A2B48",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
  });
