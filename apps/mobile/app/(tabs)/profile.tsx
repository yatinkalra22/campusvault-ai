import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/services/api';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [borrows, setBorrows] = useState<any[]>([]);

  useEffect(() => {
    api.get('/borrow/my').then(({ data }) => setBorrows(data)).catch(() => {});
  }, []);

  const activeBorrows = borrows.filter((b) => b.status === 'approved');
  const pendingBorrows = borrows.filter((b) => b.status === 'pending');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={theme.colors.primary} />
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Badge label={user?.role ?? 'student'} status="available" />
      </View>

      {/* Borrow Stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNum}>{activeBorrows.length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNum}>{pendingBorrows.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNum}>{borrows.filter((b) => b.status === 'returned').length}</Text>
          <Text style={styles.statLabel}>Returned</Text>
        </Card>
      </View>

      {/* My Borrows */}
      <Text style={styles.sectionTitle}>My Borrows</Text>
      {borrows.length === 0 ? (
        <Card><Text style={styles.emptyText}>No borrow history yet.</Text></Card>
      ) : (
        borrows.slice(0, 10).map((borrow) => (
          <Card key={borrow.id} style={styles.borrowCard}>
            <View style={styles.borrowRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.borrowItem}>{borrow.itemName ?? 'Item'}</Text>
                <Text style={styles.borrowDate}>
                  Due: {new Date(borrow.dueAt).toLocaleDateString()}
                </Text>
              </View>
              <Badge label={borrow.status} status={borrow.status} />
            </View>
          </Card>
        ))
      )}

      {/* Logout */}
      <Button title="Sign Out" variant="outline" onPress={logout} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingTop: 60 },
  profileHeader: { alignItems: 'center', marginBottom: 24, gap: 8 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: theme.colors.primary,
  },
  name: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold },
  email: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', padding: 12 },
  statNum: { color: theme.colors.primary, fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold },
  statLabel: { color: theme.colors.textMuted, fontSize: theme.fontSize.xs, marginTop: 2 },
  sectionTitle: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, marginBottom: 12 },
  borrowCard: { marginBottom: 8 },
  borrowRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  borrowItem: { color: theme.colors.text, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold },
  borrowDate: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginTop: 2 },
  emptyText: { color: theme.colors.textMuted, textAlign: 'center', fontSize: theme.fontSize.sm },
});
