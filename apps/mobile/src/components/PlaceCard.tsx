import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    building?: string;
    floor?: string;
    itemCount: number;
  };
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/place/${place.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.icon}>
        <Ionicons name="location" size={24} color={theme.colors.primary} />
      </View>
      <Text style={styles.name}>{place.name}</Text>
      {place.building && (
        <Text style={styles.detail}>
          {place.building}{place.floor ? ` - ${place.floor}` : ''}
        </Text>
      )}
      <View style={styles.countRow}>
        <Ionicons name="cube-outline" size={12} color={theme.colors.textMuted} />
        <Text style={styles.count}>{place.itemCount} items</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: 4,
  },
  icon: {
    width: 44, height: 44, borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  name: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold },
  detail: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  count: { color: theme.colors.textMuted, fontSize: theme.fontSize.xs },
});
