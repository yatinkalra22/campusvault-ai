import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Badge } from './ui/Badge';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    brandName?: string;
    category: string;
    status: string;
    placeName?: string;
    imageUrls?: string[];
  };
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/item/${item.id}`)}
      activeOpacity={0.7}
    >
      {item.imageUrls?.[0] ? (
        <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="cube-outline" size={24} color={theme.colors.textDim} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        {item.brandName && <Text style={styles.brand}>{item.brandName}</Text>}
        <View style={styles.meta}>
          <Text style={styles.location}>{item.placeName ?? item.category}</Text>
          <Badge label={item.status} status={item.status} />
        </View>
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
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: { width: 80, height: 80 },
  imagePlaceholder: {
    width: 80, height: 80,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, padding: 12, justifyContent: 'center', gap: 2 },
  name: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold },
  brand: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  location: { color: theme.colors.textMuted, fontSize: theme.fontSize.xs },
});
