import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import api from '@/services/api';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<any>(null);
  const [shelves, setShelves] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get(`/places/${id}`),
      api.get(`/shelves?placeId=${id}`),
      api.get(`/items?placeId=${id}`),
    ]).then(([p, s, i]) => {
      setPlace(p.data);
      setShelves(s.data);
      setItems(i.data);
    }).catch(() => {});
  }, [id]);

  if (!place) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.placeIcon}>
        <Ionicons name="location" size={36} color={theme.colors.primary} />
      </View>

      <Text style={styles.name}>{place.name}</Text>
      {place.building && (
        <Text style={styles.detail}>{place.building}{place.floor ? ` - ${place.floor}` : ''}{place.roomNumber ? ` (${place.roomNumber})` : ''}</Text>
      )}
      {place.description && <Text style={styles.desc}>{place.description}</Text>}

      {/* Shelves */}
      <Text style={styles.sectionTitle}>Shelves ({shelves.length})</Text>
      {shelves.length === 0 ? (
        <Text style={styles.empty}>No shelves configured.</Text>
      ) : (
        shelves.map((shelf) => (
          <Card key={shelf.id} style={styles.shelfCard}>
            <Ionicons name="file-tray-stacked-outline" size={18} color={theme.colors.primary} />
            <View>
              <Text style={styles.shelfName}>{shelf.name}</Text>
              {shelf.section && <Text style={styles.shelfSection}>{shelf.section}</Text>}
            </View>
            <Text style={styles.shelfCount}>{shelf.itemCount ?? 0} items</Text>
          </Card>
        ))
      )}

      {/* Items in this place */}
      <Text style={styles.sectionTitle}>Items ({items.length})</Text>
      {items.length === 0 ? (
        <Text style={styles.empty}>No items in this location.</Text>
      ) : (
        items.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => router.push(`/item/${item.id}`)}>
            <Card style={styles.itemCard}>
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.brandName && <Text style={styles.itemBrand}>{item.brandName}</Text>}
                </View>
                <Badge label={item.status} status={item.status} />
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingTop: 50 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
  backBtn: { marginBottom: 12 },
  placeIcon: {
    width: 64, height: 64, borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  name: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold },
  detail: { color: theme.colors.textSecondary, fontSize: theme.fontSize.md, marginTop: 4 },
  desc: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginTop: 8 },
  sectionTitle: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, marginTop: 24, marginBottom: 10 },
  empty: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  shelfCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  shelfName: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: '600' },
  shelfSection: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  shelfCount: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginLeft: 'auto' },
  itemCard: { marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemName: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: '600' },
  itemBrand: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
});
