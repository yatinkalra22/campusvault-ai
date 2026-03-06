import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={theme.colors.textDim}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  input: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.radius.md,
    padding: 14,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputError: { borderColor: theme.colors.error },
  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.xs,
  },
});
