import { Alert, Linking, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Clock, Phone } from "lucide-react-native";

import type { Appointment } from "@/shared/schemas/appointmentsSchemas";

function dateBadgeParts(dateKey: string): { month: string; day: string } {
  const [ys, ms, ds] = dateKey.split("-");
  const d = new Date(Number(ys), Number(ms) - 1, Number(ds));
  const month = d
    .toLocaleDateString("fr-FR", { month: "short" })
    .replace(/\./g, "")
    .toUpperCase();
  return { month, day: String(d.getDate()) };
}

async function callPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    Alert.alert("Téléphone", "Numéro indisponible.");
    return;
  }

  const url = `tel:${digits}`;
  try {
    const ok = await Linking.canOpenURL(url);
    if (ok) await Linking.openURL(url);
    else Alert.alert("Appeler", "Impossible d'ouvrir le composeur.");
  } catch {
    Alert.alert("Appeler", "Impossible d'ouvrir le composeur.");
  }
}

type CardProps = {
  item: Appointment;
  onConfirm: (id: string) => void;
};

function ModalAppointmentCard({ item, onConfirm }: CardProps) {
  const isPending = item.status === "EN_ATTENTE";
  const badge = dateBadgeParts(item.dateKey);

  return (
    <View className="rounded-card py-6">
      <View className="flex-row items-start gap-4">
        <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-[#FFF7ED]">
          <Text className="font-bold text-[12px] font-quicksand text-primary">
            {badge.month}
          </Text>
          <Text className="font-bold text-[19px] font-quicksand text-primary">
            {badge.day}
          </Text>
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="flex-1 font-semibold text-[16px] font-quicksand text-navy" numberOfLines={1}>
              {item.clientName}
            </Text>
            <View
              className={`rounded-pill px-3 py-2 ${
                isPending ? "bg-[#FEF3C7]" : "bg-[#DCFCE7]"
              }`}
            >
              <Text
                className={`font-sans-semibold text-[10px] leading-[14px] ${
                  isPending ? "text-[#B45309]" : "text-[#15803D]"
                }`}
              >
                {isPending ? "EN ATTENTE" : "CONFIRMÉ"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5">
            <Clock size={13} color="#9CA3AF" strokeWidth={2} />
            <Text className="font-sans text-medium text-muted-foreground">
              {item.timeLabel} {"•"} {item.durationLabel}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-3 rounded-input px-[14px] py-3">
        <Text className="font-medium text-body text-navy" numberOfLines={2}>
          {item.serviceLabel}
        </Text>
        {item.addressLine ? (
          <Text className="mt-1 font-normal text-[12px] leading-[17px] text-[#9CA3AF]" numberOfLines={2}>
            {item.addressLine}
          </Text>
        ) : null}
      </View>

      <View className="mt-3 flex-row gap-[10px]">
        <Pressable
          className="flex-1 items-center justify-center rounded-pill bg-[#F3F4F6] py-[10px]"
          onPress={() => Alert.alert("Détails", "Bientôt disponible.")}
        >
          <Text className="font-sans-semibold text-medium text-navy">Détails</Text>
        </Pressable>

        {isPending ? (
          <Pressable
            className="flex-1 items-center justify-center rounded-pill border-2 border-primary py-[10px]"
            onPress={() => onConfirm(item.id)}
          >
            <Text className="font-sans-semibold text-medium text-primary">Confirmer</Text>
          </Pressable>
        ) : (
          <Pressable
            className="flex-1 flex-row items-center justify-center gap-[7px] rounded-pill bg-primary py-[10px]"
            onPress={() => void callPhone(item.phone)}
          >
            <Phone size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text className="font-sans-semibold text-medium text-on-primary">Appeler</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

type Props = {
  day: string | null;
  items: Appointment[];
  onClose: () => void;
  onConfirm: (id: string) => void;
};

export function DayAppointmentsModal({ day, items, onClose, onConfirm }: Props) {
  const visible = day !== null && items.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center px-screen-x"
        style={{ backgroundColor: "rgba(26, 43, 72, 0.5)" }}
        onPress={onClose}
      >
        <Pressable
          className="max-h-[80%] w-full overflow-hidden rounded-card bg-surface"
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView
            className="grow-0"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          >
            {items.map((item, i) => (
              <View key={item.id}>
                {i > 0 && (
                  <View
                    style={{
                      height: 10,
                      marginHorizontal: -20,
                      backgroundColor: "rgba(241, 245, 249, 0.85)",
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: "rgba(229, 231, 235, 0.6)",
                    }}
                  />
                )}
                <ModalAppointmentCard item={item} onConfirm={onConfirm} />
              </View>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
