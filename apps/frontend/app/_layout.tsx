import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/stores/auth.store';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { toastConfig } from '@/lib/toastConfig';
import { theme } from '@/constants/theme';
import '../src/lib/amplify';

export default function RootLayout() {
  const { initialize, isLoading } = useAuthStore();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useWebSocket();

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem('onboarding_done');
      setCheckingOnboarding(false);
      if (!done) return; // onboarding screen will show as initial route
      initialize();
    })();
  }, []);

  if (checkingOnboarding || isLoading) {
    return (
      <View style={styles.loading}>
        <View style={styles.splashIcon}>
          <Ionicons name="cube" size={48} color={theme.colors.primary} />
        </View>
        <Text style={styles.splashTitle}>CampusVault AI</Text>
        <Text style={styles.splashSub}>Snap. Place. Find.</Text>
        <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 24 }} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="item/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="place/[id]" options={{ presentation: 'modal' }} />
      </Stack>
      <Toast config={toastConfig} />
      <StatusBar style="light" />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  splashIcon: {
    width: 88, height: 88, borderRadius: 22,
    backgroundColor: theme.colors.primary + '18',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  splashTitle: {
    color: theme.colors.text, fontSize: 28, fontWeight: '800',
    letterSpacing: -0.5,
  },
  splashSub: {
    color: theme.colors.textMuted, fontSize: 15, marginTop: 4,
  },
});
