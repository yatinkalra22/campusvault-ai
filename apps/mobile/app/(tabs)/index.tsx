import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/services/api';

interface DashboardStats {
  totalItems: number;
  availableItems: number;
  borrowedItems: number;
  overdueItems: number;
  totalPlaces: number;
}

export default function HomeScreen() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [itemsRes, placesRes] = await Promise.all([
        api.get('/items'),
        api.get('/places'),
      ]);
      const items = itemsRes.data;
      setStats({
        totalItems: items.length,
        availableItems: items.filter((i: any) => i.status === 'available').length,
        borrowedItems: items.filter((i: any) => i.status === 'borrowed').length,
        overdueItems: items.filter((i: any) => i.status === 'overdue').length,
        totalPlaces: placesRes.data.length,
      });
      setRecentItems(items.slice(0, 5));
    } catch {
      // API not connected yet — show empty state
    }
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
        </View>
        <Badge label={user?.role ?? 'student'} status={user?.role === 'admin' ? 'approved' : 'available'} />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard label="Total Items" value={stats?.totalItems ?? 0} icon="cube-outline" color={theme.colors.primary} />
        <StatCard label="Available" value={stats?.availableItems ?? 0} icon="checkmark-circle-outline" color={theme.colors.available} />
        <StatCard label="Borrowed" value={stats?.borrowedItems ?? 0} icon="arrow-forward-circle-outline" color={theme.colors.borrowed} />
        <StatCard label="Places" value={stats?.totalPlaces ?? 0} icon="location-outline" color={theme.colors.info} />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <ActionButton icon="camera-outline" label="Add Item" onPress={() => router.push('/(tabs)/add')} />
        <ActionButton icon="search-outline" label="Search" onPress={() => router.push('/(tabs)/search')} />
        <ActionButton icon="grid-outline" label="Explore" onPress={() => router.push('/(tabs)/explore')} />
      </View>

      {/* Recent Items */}
      <Text style={styles.sectionTitle}>Recent Items</Text>
      {recentItems.length === 0 ? (
        <Card><Text style={styles.emptyText}>No items yet. Tap "Add Item" to get started.</Text></Card>
      ) : (
        recentItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/item/${item.id}`)}
          >
            <Card style={styles.itemCard}>
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemLocation}>{item.placeName ?? 'No location'}</Text>
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

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function ActionButton({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { color: theme.colors.textMuted, fontSize: theme.fontSize.md },
  name: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, minWidth: '45%', alignItems: 'center', gap: 4, padding: 14 },
  statValue: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold },
  statLabel: { fontSize: theme.fontSize.xs, color: theme.colors.textMuted },
  sectionTitle: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionLabel: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium },
  itemCard: { marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemName: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold },
  itemLocation: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginTop: 2 },
  emptyText: { color: theme.colors.textMuted, textAlign: 'center', fontSize: theme.fontSize.sm },
});
