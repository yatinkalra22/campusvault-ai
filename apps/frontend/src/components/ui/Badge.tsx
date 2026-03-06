import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

const STATUS_COLORS: Record<string, string> = {
  available: theme.colors.available,
  borrowed: theme.colors.borrowed,
  overdue: theme.colors.overdue,
  maintenance: theme.colors.maintenance,
  missing: theme.colors.missing,
  pending: theme.colors.warning,
  approved: theme.colors.success,
  rejected: theme.colors.error,
  returned: theme.colors.info,
};

interface BadgeProps {
  label: string;
  status?: string;
  color?: string;
}

export function Badge({ label, status, color }: BadgeProps) {
  const bg = color ?? STATUS_COLORS[status ?? ''] ?? theme.colors.surfaceAlt;

  return (
    <View style={[styles.badge, { backgroundColor: bg + '22', borderColor: bg }]}>
      <Text style={[styles.text, { color: bg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    textTransform: 'capitalize',
  },
});
