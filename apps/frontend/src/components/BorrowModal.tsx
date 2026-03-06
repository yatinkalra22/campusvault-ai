import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '@/constants/theme';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { showSuccess, showError } from '@/lib/toast';
import api from '@/services/api';

interface BorrowModalProps {
  visible: boolean;
  itemId: string;
  itemName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BorrowModal({ visible, itemId, itemName, onClose, onSuccess }: BorrowModalProps) {
  const [purpose, setPurpose] = useState('');
  const [daysUntilDue, setDaysUntilDue] = useState('7');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!purpose.trim()) {
      setError('Please provide a purpose');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const days = parseInt(daysUntilDue) || 7;
      await api.post('/borrow', {
        itemId,
        purpose: purpose.trim(),
        dueAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      });
      setPurpose('');
      setDaysUntilDue('7');
      showSuccess('Request Sent', 'Your borrow request is pending approval');
      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Request failed';
      setError(msg);
      showError('Borrow Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Request to Borrow</Text>
          <Text style={styles.itemName}>{itemName}</Text>

          <Input
            label="Purpose *"
            placeholder="e.g. Photography final project"
            value={purpose}
            onChangeText={setPurpose}
            multiline
            style={{ minHeight: 80 }}
          />

          <Input
            label="Borrow Duration (days)"
            placeholder="7"
            value={daysUntilDue}
            onChangeText={setDaysUntilDue}
            keyboardType="number-pad"
          />

          <Text style={styles.dueDate}>
            Due: {new Date(Date.now() + (parseInt(daysUntilDue) || 7) * 86400000).toLocaleDateString()}
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button title="Cancel" variant="ghost" onPress={onClose} style={{ flex: 1 }} />
            <Button title="Submit Request" onPress={handleSubmit} loading={submitting} style={{ flex: 2 }} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: theme.spacing.xl, paddingBottom: 40,
    gap: 14,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: theme.colors.textDim,
    alignSelf: 'center', marginBottom: 8,
  },
  title: { color: theme.colors.text, fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold },
  itemName: { color: theme.colors.primary, fontSize: theme.fontSize.md, marginBottom: 4 },
  dueDate: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  error: { color: theme.colors.error, fontSize: theme.fontSize.sm },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
});
