import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import api from '@/services/api';

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recordingRef = useRef<Audio.Recording | null>(null);

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    recordingRef.current = recording;
    setIsRecording(true);
  };

  const stopAndSearch = async (): Promise<any[]> => {
    if (!recordingRef.current) return [];

    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    setIsRecording(false);
    recordingRef.current = null;

    if (!uri) return [];

    // Convert to base64 and send to backend
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] ?? '');
      };
      reader.readAsDataURL(blob);
    });

    const { data } = await api.post('/search/voice', { audioBase64: base64 });
    setTranscript(data.transcript ?? '');
    return data.results ?? [];
  };

  return { isRecording, transcript, startRecording, stopAndSearch };
}
