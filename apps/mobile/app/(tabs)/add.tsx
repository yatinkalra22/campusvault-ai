import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import api from '@/services/api';

export default function AddItemScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Form fields
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const capturePhoto = async () => {
    if (Platform.OS === 'web') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets[0]) {
        handleCapture(result.assets[0].uri, result.assets[0].base64!);
      }
    } else {
      const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.8 });
      if (photo) handleCapture(photo.uri, photo.base64!);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      handleCapture(result.assets[0].uri, result.assets[0].base64!);
    }
  };

  const handleCapture = async (uri: string, base64: string) => {
    setCapturedImage(uri);
    setImageBase64(base64);
    setAnalyzing(true);
    try {
      const { data } = await api.post('/items/analyze-image', { imageBase64: base64 });
      setAiResult(data);
      setName(data.name ?? '');
      setBrandName(data.brandName ?? '');
      setCategory(data.category ?? '');
      setTags(data.tags?.join(', ') ?? '');
    } catch {
      // Nova unavailable — user fills manually
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let imageKeys: string[] = [];
      if (imageBase64) {
        const { data: upload } = await api.post('/items/upload-url', { contentType: 'image/jpeg' });
        await fetch(upload.presignedUrl, {
          method: 'PUT',
          body: await (await fetch(capturedImage!)).blob(),
          headers: { 'Content-Type': 'image/jpeg' },
        });
        imageKeys = [upload.key];
      }

      await api.post('/items', {
        name, brandName, category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        placeId: placeId || undefined,
        notes: notes || undefined,
        imageKeys,
      });
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Failed to create item:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Camera not captured yet
  if (!capturedImage) {
    return (
      <View style={styles.container}>
        <View style={styles.cameraHeader}>
          <Text style={styles.title}>Add New Item</Text>
          <Text style={styles.subtitle}>Take a photo and let AI identify it</Text>
        </View>

        {Platform.OS !== 'web' && permission?.granted ? (
          <CameraView ref={cameraRef} style={styles.camera} facing="back">
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraActions}>
                <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto}>
                  <Ionicons name="camera" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        ) : (
          <View style={styles.webPicker}>
            {Platform.OS !== 'web' && !permission?.granted && (
              <Button title="Grant Camera Access" onPress={requestPermission} style={{ marginBottom: 16 }} />
            )}
            <TouchableOpacity style={styles.uploadArea} onPress={pickFromGallery}>
              <Ionicons name="cloud-upload-outline" size={48} color={theme.colors.primary} />
              <Text style={styles.uploadText}>Tap to select a photo</Text>
              <Text style={styles.uploadHint}>AI will identify the item automatically</Text>
            </TouchableOpacity>
          </View>
        )}

        {Platform.OS !== 'web' && permission?.granted && (
          <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery}>
            <Ionicons name="images-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.galleryText}>Pick from gallery</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Image captured — show AI result + form
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.formContent}>
      <Image source={{ uri: capturedImage }} style={styles.preview} />
      <TouchableOpacity style={styles.retakeBtn} onPress={() => { setCapturedImage(null); setAiResult(null); }}>
        <Ionicons name="refresh" size={16} color={theme.colors.primary} />
        <Text style={styles.retakeText}>Retake</Text>
      </TouchableOpacity>

      {/* AI Analysis Result */}
      {analyzing ? (
        <Card style={styles.aiCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.aiText}>Nova AI is analyzing your image...</Text>
        </Card>
      ) : aiResult ? (
        <Card style={styles.aiCard}>
          <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
          <Text style={styles.aiText}>
            Identified: {aiResult.name} ({Math.round((aiResult.confidence ?? 0) * 100)}% confidence)
          </Text>
        </Card>
      ) : null}

      {/* Editable Form */}
      {!analyzing && (
        <View style={styles.form}>
          <Input label="Item Name *" value={name} onChangeText={setName} placeholder="e.g. Canon EOS Rebel T7" />
          <Input label="Brand" value={brandName} onChangeText={setBrandName} placeholder="e.g. Canon" />
          <Input label="Category *" value={category} onChangeText={setCategory} placeholder="e.g. electronics" />
          <Input label="Tags (comma separated)" value={tags} onChangeText={setTags} placeholder="e.g. camera, dslr" />
          <Input label="Place ID" value={placeId} onChangeText={setPlaceId} placeholder="Select a location" />
          <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional notes" multiline />

          <Button title="Add to Inventory" onPress={handleSubmit} loading={submitting} disabled={!name || !category} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  cameraHeader: { paddingTop: 60, paddingHorizontal: theme.spacing.lg, paddingBottom: 16 },
  title: { color: theme.colors.text, fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold },
  subtitle: { color: theme.colors.textMuted, fontSize: theme.fontSize.md, marginTop: 2 },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, justifyContent: 'flex-end' },
  cameraActions: { alignItems: 'center', paddingBottom: 40 },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: '#fff',
  },
  webPicker: { flex: 1, padding: theme.spacing.lg, justifyContent: 'center' },
  uploadArea: {
    borderWidth: 2, borderColor: theme.colors.primary, borderStyle: 'dashed',
    borderRadius: theme.radius.xl, padding: 48,
    alignItems: 'center', gap: 12,
  },
  uploadText: { color: theme.colors.text, fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold },
  uploadHint: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm },
  galleryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: 16,
  },
  galleryText: { color: theme.colors.primary, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.medium },
  formContent: { padding: theme.spacing.lg, paddingTop: 60 },
  preview: { width: '100%', height: 220, borderRadius: theme.radius.lg, marginBottom: 8 },
  retakeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'center', marginBottom: 16 },
  retakeText: { color: theme.colors.primary, fontSize: theme.fontSize.sm },
  aiCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  aiText: { color: theme.colors.textSecondary, fontSize: theme.fontSize.sm, flex: 1 },
  form: { gap: 14 },
});
