import { Redirect } from 'expo-router';

import { GlobalLoader } from '../components/ui/GlobalLoader';
import { useAuthSession } from '../hooks/auth/useAuthSession';

export default function Index() {
  const { data, isPending } = useAuthSession();

  if (isPending) return <GlobalLoader label="Demarrage..." />;

  return <Redirect href={data?.isAuthenticated ? '/(app)/(tabs)/rendez-vous' : '/(auth)/login'} />;
}
