import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface NovaBadgeProps {
  label?: string;
  compact?: boolean;
}

/** Small "Powered by Amazon Nova" indicator for AI-driven UI sections */
export function NovaBadge({ label = 'Powered by Amazon Nova', compact }: NovaBadgeProps) {
  if (compact) {
    return (
      <View style={styles.compact}>
        <Ionicons name="sparkles" size={10} color={theme.colors.primary} />
        <Text style={styles.compactText}>Nova AI</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="sparkles" size={12} color={theme.colors.primary} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'center', marginTop: 8,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '12',
  },
  text: { color: theme.colors.primary, fontSize: 11, fontWeight: '600' },
  compact: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: theme.colors.primary + '12',
  },
  compactText: { color: theme.colors.primary, fontSize: 9, fontWeight: '700' },
});
