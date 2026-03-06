import { View, StyleSheet } from 'react-native';
import { Skeleton } from './ui/Skeleton';
import { Card } from './ui/Card';
import { theme } from '@/constants/theme';

/** Skeleton placeholder for a list of cards — shown while data loads */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} style={styles.card}>
          <View style={styles.row}>
            <Skeleton width={44} height={44} borderRadius={theme.radius.md} />
            <View style={styles.lines}>
              <Skeleton width="70%" height={14} />
              <Skeleton width="40%" height={10} />
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
}

/** Skeleton for the stats grid on home/admin */
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.statsGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} style={styles.statCard}>
          <Skeleton width={22} height={22} borderRadius={11} />
          <Skeleton width={32} height={20} />
          <Skeleton width={48} height={10} />
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  card: { marginBottom: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lines: { flex: 1, gap: 6 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, minWidth: '45%', alignItems: 'center', gap: 6, padding: 14 },
});
