import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationsStore } from '@/stores/notifications.store';
import { NovaBadge } from '@/components/NovaBadge';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { SkeletonStats, SkeletonList } from '@/components/SkeletonList';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { DEMO_MODE } from '@/lib/demo';
import { MOCK_ITEMS, MOCK_PLACES } from '@/mock';
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
  const { unreadCount, markAllRead } = useNotificationsStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (DEMO_MODE) {
      const items = MOCK_ITEMS;
      setStats({
        totalItems: items.length,
        availableItems: items.filter((i) => i.status === 'available').length,
        borrowedItems: items.filter((i) => i.status === 'borrowed').length,
        overdueItems: 0,
        totalPlaces: MOCK_PLACES.length,
      });
      setRecentItems(items.slice(0, 5));
      return;
    }
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
    <ResponsiveContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Notification bell */}
          <TouchableOpacity style={styles.bellBtn} onPress={markAllRead}>
            <Ionicons name="notifications-outline" size={22} color={theme.colors.text} />
            {unreadCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Admin link */}
          {user?.role === 'admin' && (
            <TouchableOpacity onPress={() => router.push('/admin')}>
              <Ionicons name="settings-outline" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
          <Badge label={user?.role ?? 'student'} status={user?.role === 'admin' ? 'approved' : 'available'} />
        </View>
      </View>

      {/* Stats Grid */}
      {!stats ? <SkeletonStats /> : (
        <View style={styles.statsGrid}>
          <StatCard label="Total Items" value={stats.totalItems} icon="cube-outline" color={theme.colors.primary} />
          <StatCard label="Available" value={stats.availableItems} icon="checkmark-circle-outline" color={theme.colors.available} />
          <StatCard label="Borrowed" value={stats.borrowedItems} icon="arrow-forward-circle-outline" color={theme.colors.borrowed} />
          <StatCard label="Places" value={stats.totalPlaces} icon="location-outline" color={theme.colors.info} />
        </View>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <ActionButton icon="camera-outline" label="Add Item" onPress={() => router.push('/(tabs)/add')} />
        <ActionButton icon="search-outline" label="Search" onPress={() => router.push('/(tabs)/search')} />
        <ActionButton icon="grid-outline" label="Explore" onPress={() => router.push('/(tabs)/explore')} />
      </View>

      <NovaBadge />

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
    </ResponsiveContainer>
    </ScrollView>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon as any} size={22} color={color} />
      <AnimatedNumber value={value} style={[styles.statValue, { color }]} />
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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellBtn: { position: 'relative' },
  bellBadge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: theme.colors.error, borderRadius: 8,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  bellBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
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
