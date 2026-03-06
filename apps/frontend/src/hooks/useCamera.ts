import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface CaptureResult {
  uri: string;
  base64: string;
}

export function useCamera() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  const capture = async (): Promise<CaptureResult | null> => {
    if (Platform.OS === 'web') {
      return pickFromGallery();
    }
    const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.8 });
    if (photo?.base64) return { uri: photo.uri, base64: photo.base64 };
    return null;
  };

  const pickFromGallery = async (): Promise<CaptureResult | null> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]?.base64) {
      return { uri: result.assets[0].uri, base64: result.assets[0].base64 };
    }
    return null;
  };

  const toggleFacing = () => setFacing((f) => (f === 'back' ? 'front' : 'back'));

  return { cameraRef, facing, capture, pickFromGallery, toggleFacing };
}
