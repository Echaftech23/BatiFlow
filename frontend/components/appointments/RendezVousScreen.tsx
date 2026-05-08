import { router } from 'expo-router';
import { Bell, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/types';
import { GlobalLoader } from '@/components/ui/GlobalLoader';
import { useAppointmentsQuery } from '@/hooks/appointments/useAppointmentsQuery';
import { useConfirmAppointmentMutation } from '@/hooks/appointments/useConfirmAppointmentMutation';
import { AppointmentCard } from '../AppointmentCard';
import '@/lib/calendarLocaleFr';
import { appointmentsToMarkedDates, type Appointment } from '@/shared/schemas/appointmentsSchemas';

type ViewMode = 'list' | 'calendar';

export default function RendezVousScreen() {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalDay, setModalDay] = useState<string | null>(null);
  const { data, isPending, isError, error, refetch, isRefetching } = useAppointmentsQuery();
  const items = data ?? [];
  const confirmMutation = useConfirmAppointmentMutation();

  const onConfirm = (id: string) => {
    confirmMutation.mutate(id, {
      onError: (e) => {
        const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Echec de la confirmation';
        Alert.alert('Confirmation', msg);
      },
    });
  };

  const modalItems: Appointment[] = modalDay ? items.filter((a) => a.dateKey === modalDay) : [];
  const markedDates = useMemo(() => {
    const base = appointmentsToMarkedDates(items);
    const out: Record<string, { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string }> = { ...base };
    if (selectedDay) out[selectedDay] = { ...out[selectedDay], selected: true, selectedColor: '#F27427', marked: out[selectedDay]?.marked ?? false, dotColor: out[selectedDay]?.dotColor ?? '#F27427' };
    return out;
  }, [items, selectedDay]);

  if (isPending && items.length === 0) return <GlobalLoader label="Chargement des rendez-vous..." />;

  return (
    <View className="flex-1 bg-background">
      <View className="bg-surface px-screen-x pb-3 shadow-segmented" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-bold text-title text-navy">Rendez-vous</Text>
          <View className="rounded-full bg-muted p-2"><Bell size={22} color="#1A2B48" /></View>
        </View>
        <View className="mt-4 flex-row rounded-input bg-muted p-1">
          <Pressable onPress={() => setViewMode('list')} className={`flex-1 rounded-button py-2 ${viewMode === 'list' ? 'bg-surface shadow-segmented' : ''}`}><Text className={`text-center font-sans-semibold text-caption ${viewMode === 'list' ? 'text-navy' : 'text-muted-foreground'}`}>Vue liste</Text></Pressable>
          <Pressable onPress={() => setViewMode('calendar')} className={`flex-1 rounded-button py-2 ${viewMode === 'calendar' ? 'bg-surface shadow-segmented' : ''}`}><Text className={`text-center font-sans-semibold text-caption ${viewMode === 'calendar' ? 'text-navy' : 'text-muted-foreground'}`}>Vue calendrier</Text></Pressable>
        </View>
      </View>
      {viewMode === 'list' ? (
        <FlatList
          data={items}
          keyExtractor={(a) => a.id}
          contentContainerClassName="px-screen-x py-4 pb-28"
          ListHeaderComponent={isError ? <Text className="mb-2 font-sans text-caption text-destructive">{error instanceof Error ? error.message : 'Erreur reseau ou serveur.'}</Text> : isRefetching ? <View className="mb-2 flex-row items-center gap-2"><ActivityIndicator color="#F27427" /><Text className="font-sans text-caption text-muted-foreground">Actualisation...</Text></View> : null}
          renderItem={({ item }) => <AppointmentCard item={item} onConfirm={onConfirm} />}
          ItemSeparatorComponent={() => <View className="h-4" />}
        />
      ) : (
        <View className="flex-1 px-screen-x pb-28 pt-4">
          <Calendar markingType="multi-dot" markedDates={markedDates} onDayPress={(day) => { setSelectedDay(day.dateString); if (items.some((a) => a.dateKey === day.dateString)) setModalDay(day.dateString); }} enableSwipeMonths />
          <Pressable onPress={() => void refetch()} className="mt-3 rounded-button border border-border py-2"><Text className="text-center font-sans-semibold text-caption text-navy">Rafraichir</Text></Pressable>
        </View>
      )}
      <Pressable onPress={() => router.push('/(app)/booking/date')} className="absolute right-5 h-14 w-14 items-center justify-center rounded-fab bg-primary shadow-fab" style={{ bottom: 88 + Math.max(insets.bottom, 8) }}>
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
      <Modal visible={modalDay !== null && modalItems.length > 0} animationType="slide" transparent onRequestClose={() => setModalDay(null)}>
        <Pressable className="flex-1 justify-end" style={{ backgroundColor: 'rgba(26, 43, 72, 0.45)' }} onPress={() => setModalDay(null)}>
          <Pressable className="max-h-[85%] rounded-t-card bg-background px-screen-x pt-6" onPress={(e) => e.stopPropagation()} style={{ paddingBottom: insets.bottom + 20 }}>
            <Text className="font-sans-bold text-subtitle text-navy">{modalDay ?? ''}</Text>
            <ScrollView className="mt-4 max-h-96" showsVerticalScrollIndicator={false}>{modalItems.map((item, i) => <View key={item.id} className={i > 0 ? 'mt-3' : ''}><AppointmentCard item={item} onConfirm={onConfirm} compact /></View>)}</ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
