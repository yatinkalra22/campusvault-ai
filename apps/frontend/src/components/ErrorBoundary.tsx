import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches React render errors and shows a retry screen */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.iconWrap}>
            <Ionicons name="warning-outline" size={56} color={theme.colors.error} />
          </View>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>An unexpected error occurred. Please try again.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={this.handleRetry}>
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: theme.colors.background,
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  iconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: theme.colors.error + '15',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  title: { color: theme.colors.text, fontSize: theme.fontSize.xl, fontWeight: '700', marginBottom: 8 },
  message: { color: theme.colors.textMuted, fontSize: theme.fontSize.md, textAlign: 'center', marginBottom: 24 },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: theme.radius.full,
  },
  retryText: { color: '#fff', fontSize: theme.fontSize.md, fontWeight: '700' },
});
