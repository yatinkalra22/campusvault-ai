import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '@/hooks/useResponsive';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

/** Centers content with a max-width on tablet/desktop, full-width on mobile */
export function ResponsiveContainer({ children, style }: Props) {
  const { contentMaxWidth, isMobile } = useResponsive();

  if (isMobile) {
    return <View style={style}>{children}</View>;
  }

  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, alignItems: 'center' },
  inner: { flex: 1, width: '100%' },
});
