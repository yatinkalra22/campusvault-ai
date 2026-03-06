import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import type { BaseToastProps } from 'react-native-toast-message';

function ToastCard({ text1, text2, icon, color }: BaseToastProps & { icon: string; color: string }) {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <Ionicons name={icon as any} size={20} color={color} />
      <View style={styles.textWrap}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      </View>
    </View>
  );
}

export const toastConfig = {
  success: (props: BaseToastProps) => <ToastCard {...props} icon="checkmark-circle" color={theme.colors.available} />,
  error: (props: BaseToastProps) => <ToastCard {...props} icon="alert-circle" color={theme.colors.error} />,
  info: (props: BaseToastProps) => <ToastCard {...props} icon="information-circle" color={theme.colors.info} />,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderLeftWidth: 4,
    paddingHorizontal: 16, paddingVertical: 12,
    marginHorizontal: 16, marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
    elevation: 6,
  },
  textWrap: { flex: 1 },
  title: { color: theme.colors.text, fontSize: theme.fontSize.sm, fontWeight: '700' },
  message: { color: theme.colors.textMuted, fontSize: theme.fontSize.xs, marginTop: 2 },
});
