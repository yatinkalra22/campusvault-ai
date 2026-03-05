import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { DEMO_MODE } from '@/lib/demo';
import { MOCK_PLACES } from '@/mock';
import api from '@/services/api';

export default function ExploreScreen() {
  const [places, setPlaces] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlaces = async () => {
    if (DEMO_MODE) { setPlaces(MOCK_PLACES); return; }
    try {
      const { data } = await api.get('/places');
      setPlaces(data);
    } catch {
      // Not connected
    }
  };

  useEffect(() => { loadPlaces(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlaces();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
    >
      <Text style={styles.title}>Explore Places</Text>
      <Text style={styles.subtitle}>Browse locations and their inventory</Text>

      <View style={styles.grid}>
        {places.length === 0 ? (
          <Card><Text style={styles.empty}>No places yet. Ask an admin to create locations.</Text></Card>
        ) : (
          places.map((place) => (
            <TouchableOpacity
              key={place.id}
              onPress={() => router.push(`/place/${place.id}`)}
              activeOpacity={0.7}
            >
              <Card style={styles.placeCard}>
                <View style={styles.placeIcon}>
                  <Ionicons name="location" size={28} color={theme.colors.primary} />
                </View>
                <Text style={styles.placeName}>{place.name}</Text>
                {place.building && (
                  <Text style={styles.placeDetail}>{place.building}{place.floor ? ` - ${place.floor}` : ''}</Text>
                )}
                <View style={styles.countRow}>
                  <Ionicons name="cube-outline" size={14} color={theme.colors.textMuted} />
                  <Text style={styles.countText}>{place.itemCount ?? 0} items</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingTop: 60 },
  title: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold },
  subtitle: { color: theme.colors.textMuted, fontSize: theme.fontSize.md, marginBottom: 24 },
  grid: { gap: 12 },
  placeCard: { alignItems: 'flex-start', gap: 6 },
  placeIcon: {
    width: 48, height: 48, borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  placeName: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold },
  placeDetail: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  countText: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  empty: { color: theme.colors.textMuted, textAlign: 'center', fontSize: theme.fontSize.sm },
});
