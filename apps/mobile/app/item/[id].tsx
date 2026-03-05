import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/services/api';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const [item, setItem] = useState<any>(null);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    api.get(`/items/${id}`).then(({ data }) => setItem(data)).catch(() => {});
  }, [id]);

  const handleBorrow = async () => {
    setBorrowing(true);
    try {
      await api.post('/borrow', {
        itemId: id,
        purpose: 'Academic use',
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      const { data } = await api.get(`/items/${id}`);
      setItem(data);
    } catch (err) {
      console.error('Borrow failed:', err);
    } finally {
      setBorrowing(false);
    }
  };

  if (!item) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Image */}
      {item.imageUrls?.[0] ? (
        <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="cube-outline" size={64} color={theme.colors.textDim} />
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <Badge label={item.status} status={item.status} />
      </View>

      {item.brandName && <Text style={styles.brand}>{item.brandName}</Text>}
      <Text style={styles.category}>{item.category}</Text>

      {/* Location */}
      <Card style={styles.locationCard}>
        <Ionicons name="location" size={18} color={theme.colors.primary} />
        <View>
          <Text style={styles.locationText}>{item.placeName ?? 'Unassigned'}</Text>
          {item.shelfName && <Text style={styles.locationSub}>{item.shelfName}{item.section ? ` - ${item.section}` : ''}</Text>}
        </View>
      </Card>

      {/* Tags */}
      {item.tags?.length > 0 && (
        <View style={styles.tags}>
          {item.tags.map((tag: string) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Description */}
      {item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}

      {/* Notes */}
      {item.notes && (
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </Card>
      )}

      {/* Actions */}
      {item.status === 'available' && (
        <Button
          title="Request to Borrow"
          onPress={handleBorrow}
          loading={borrowing}
          style={{ marginTop: 20 }}
        />
      )}

      {(user?.role === 'faculty' || user?.role === 'admin') && (
        <Button
          title="Transfer Location"
          variant="outline"
          onPress={() => {}}
          style={{ marginTop: 10 }}
        />
      )}

      {/* AI Analysis info */}
      {item.aiAnalysis && (
        <Card style={{ marginTop: 20 }}>
          <View style={styles.aiRow}>
            <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
            <Text style={styles.aiLabel}>AI Identified</Text>
          </View>
          <Text style={styles.aiDetail}>
            {item.aiAnalysis.originalName} ({Math.round(item.aiAnalysis.confidence * 100)}% confidence)
          </Text>
          {item.aiAnalysis.wasOverridden && (
            <Text style={styles.aiOverride}>Manually overridden by user</Text>
          )}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingTop: 50 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  backBtn: { marginBottom: 12 },
  image: { width: '100%', height: 250, borderRadius: theme.radius.lg, marginBottom: 16 },
  imagePlaceholder: {
    width: '100%', height: 200, borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  name: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold, flex: 1, marginRight: 10 },
  brand: { color: theme.colors.textSecondary, fontSize: theme.fontSize.md, marginBottom: 2 },
  category: { color: theme.colors.primary, fontSize: theme.fontSize.sm, marginBottom: 14, textTransform: 'capitalize' },
  locationCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  locationText: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold },
  locationSub: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  tag: { backgroundColor: theme.colors.surfaceAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.full },
  tagText: { color: theme.colors.primaryLight, fontSize: theme.fontSize.xs },
  description: { color: theme.colors.textSecondary, fontSize: theme.fontSize.md, lineHeight: 22 },
  notesLabel: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm, fontWeight: '600', marginBottom: 4 },
  notesText: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  aiLabel: { color: theme.colors.primary, fontSize: theme.fontSize.sm, fontWeight: '600' },
  aiDetail: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  aiOverride: { color: theme.colors.warning, fontSize: theme.fontSize.xs, marginTop: 4 },
});
