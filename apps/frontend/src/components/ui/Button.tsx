import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  outline: { borderWidth: 1.5, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  ghost: { backgroundColor: 'transparent' },
  size_sm: { paddingVertical: 8, paddingHorizontal: 16 },
  size_md: { paddingVertical: 14, paddingHorizontal: 24 },
  size_lg: { paddingVertical: 18, paddingHorizontal: 32 },
  disabled: { opacity: 0.5 },
  text: { fontWeight: theme.fontWeight.bold },
  text_primary: { color: '#fff' },
  text_secondary: { color: '#fff' },
  text_outline: { color: theme.colors.primary },
  text_ghost: { color: theme.colors.primary },
  textSize_sm: { fontSize: theme.fontSize.sm },
  textSize_md: { fontSize: theme.fontSize.md },
  textSize_lg: { fontSize: theme.fontSize.lg },
});
