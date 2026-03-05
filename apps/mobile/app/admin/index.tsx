import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [itemsRes, placesRes, pendingRes] = await Promise.all([
        api.get('/items'),
        api.get('/places'),
        api.get('/borrow/pending'),
      ]);
      const items = itemsRes.data;
      setStats({
        totalItems: items.length,
        available: items.filter((i: any) => i.status === 'available').length,
        borrowed: items.filter((i: any) => i.status === 'borrowed').length,
        overdue: items.filter((i: any) => i.status === 'overdue').length,
        maintenance: items.filter((i: any) => i.status === 'maintenance').length,
        places: placesRes.data.length,
        pendingCount: pendingRes.data.length,
      });
      setPending(pendingRes.data.slice(0, 5));
      setRecentItems(items.slice(0, 5));
    } catch {
      // API not connected
    }
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/borrow/${id}/approve`);
      await loadData();
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.put(`/borrow/${id}/reject`, { reason: 'Declined by admin' });
      await loadData();
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <StatTile label="Total Items" value={stats?.totalItems ?? 0} color={theme.colors.primary} icon="cube" />
        <StatTile label="Available" value={stats?.available ?? 0} color={theme.colors.available} icon="checkmark-circle" />
        <StatTile label="Borrowed" value={stats?.borrowed ?? 0} color={theme.colors.borrowed} icon="arrow-forward-circle" />
        <StatTile label="Overdue" value={stats?.overdue ?? 0} color={theme.colors.overdue} icon="alert-circle" />
        <StatTile label="Maintenance" value={stats?.maintenance ?? 0} color={theme.colors.maintenance} icon="build" />
        <StatTile label="Places" value={stats?.places ?? 0} color={theme.colors.info} icon="location" />
      </View>

      {/* Status Distribution Bar */}
      {stats && stats.totalItems > 0 && (
        <Card style={styles.distributionCard}>
          <Text style={styles.sectionTitle}>Item Status Distribution</Text>
          <View style={styles.bar}>
            <View style={[styles.barSegment, { flex: stats.available, backgroundColor: theme.colors.available }]} />
            <View style={[styles.barSegment, { flex: stats.borrowed, backgroundColor: theme.colors.borrowed }]} />
            <View style={[styles.barSegment, { flex: stats.overdue || 0.01, backgroundColor: theme.colors.overdue }]} />
            <View style={[styles.barSegment, { flex: stats.maintenance || 0.01, backgroundColor: theme.colors.maintenance }]} />
          </View>
          <View style={styles.legend}>
            <LegendDot color={theme.colors.available} label="Available" />
            <LegendDot color={theme.colors.borrowed} label="Borrowed" />
            <LegendDot color={theme.colors.overdue} label="Overdue" />
            <LegendDot color={theme.colors.maintenance} label="Maintenance" />
          </View>
        </Card>
      )}

      {/* Pending Approvals */}
      <Text style={styles.sectionTitle}>
        Pending Approvals {stats?.pendingCount ? `(${stats.pendingCount})` : ''}
      </Text>
      {pending.length === 0 ? (
        <Card><Text style={styles.emptyText}>No pending requests.</Text></Card>
      ) : (
        pending.map((borrow) => (
          <Card key={borrow.id} style={styles.pendingCard}>
            <Text style={styles.pendingItem}>{borrow.itemName ?? 'Item'}</Text>
            <Text style={styles.pendingUser}>By: {borrow.requestedByName ?? borrow.requestedBy}</Text>
            <Text style={styles.pendingPurpose}>{borrow.purpose}</Text>
            <Text style={styles.pendingDate}>Due: {new Date(borrow.dueAt).toLocaleDateString()}</Text>
            <View style={styles.pendingActions}>
              <Button title="Approve" size="sm" onPress={() => handleApprove(borrow.id)} style={{ flex: 1 }} />
              <Button title="Reject" size="sm" variant="outline" onPress={() => handleReject(borrow.id)} style={{ flex: 1 }} />
            </View>
          </Card>
        ))
      )}

      {/* Recent Items */}
      <Text style={styles.sectionTitle}>Recent Items</Text>
      {recentItems.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => router.push(`/item/${item.id}`)}>
          <Card style={styles.itemCard}>
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>{item.placeName ?? item.category}</Text>
              </View>
              <Badge label={item.status} status={item.status} />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function StatTile({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <Card style={styles.statTile}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingTop: 50 },
  backBtn: { marginBottom: 12 },
  title: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold, marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statTile: { width: '30%', flexGrow: 1, alignItems: 'center', gap: 4, padding: 12 },
  statValue: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold },
  statLabel: { fontSize: theme.fontSize.xs, color: theme.colors.textMuted },
  distributionCard: { marginBottom: 20 },
  bar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', marginVertical: 10 },
  barSegment: { height: '100%' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: theme.colors.textMuted, fontSize: theme.fontSize.xs },
  sectionTitle: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, marginBottom: 10 },
  emptyText: { color: theme.colors.textMuted, textAlign: 'center', fontSize: theme.fontSize.sm },
  pendingCard: { marginBottom: 10, gap: 4 },
  pendingItem: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold },
  pendingUser: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm },
  pendingPurpose: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  pendingDate: { color: theme.colors.textMuted, fontSize: theme.fontSize.xs },
  pendingActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  itemCard: { marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemName: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: '600' },
  itemMeta: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
});
