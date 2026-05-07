import { Tabs } from 'expo-router';
import { CalendarClock, Home, Settings, TrendingUp } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: false,
        tabBarActiveTintColor: '#F27427',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: { fontFamily: 'Poppins_500Medium', fontSize: 12 },
        tabBarStyle: {
          display: 'flex',
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: '#E8EAEF',
          borderTopWidth: 1,
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rendez-vous"
        options={{
          title: 'Rendez-vous',
          tabBarIcon: ({ color, size }) => (
            <CalendarClock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="roi"
        options={{
          title: 'ROI',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
