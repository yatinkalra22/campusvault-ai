import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterScreen() {
  const { register, confirmCode, isLoading, error, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleRegister = async () => {
    clearError();
    await register(email.trim(), password, name.trim());
    if (!useAuthStore.getState().error) {
      setNeedsConfirmation(true);
    }
  };

  const handleConfirm = async () => {
    clearError();
    await confirmCode(email.trim(), code.trim());
    if (!useAuthStore.getState().error) {
      router.replace('/(auth)/login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>{theme.brand.name}</Text>
        </View>

        {!needsConfirmation ? (
          <View style={styles.form}>
            <Input label="Full Name" placeholder="John Doe" value={name} onChangeText={setName} />
            <Input
              label="Email"
              placeholder="you@indianatech.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              placeholder="Min 8 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={isLoading}
              disabled={!name || !email || !password}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.confirmText}>
              We sent a verification code to {email}
            </Text>
            <Input
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Button
              title="Verify"
              onPress={handleConfirm}
              loading={isLoading}
              disabled={!code}
            />
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.link}>Sign In</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.xl },
  header: { alignItems: 'center', marginBottom: 48 },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
  form: { gap: 16 },
  confirmText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    textAlign: 'center',
    marginBottom: 8,
  },
  error: { color: theme.colors.error, fontSize: theme.fontSize.sm, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  link: { color: theme.colors.primary, fontSize: theme.fontSize.sm, fontWeight: '600' },
});
