import { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { DEMO_MODE } from '@/lib/demo';
import { useAuthStore } from '@/stores/auth.store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'camera' as const,
    title: 'Snap',
    subtitle: 'Photograph any item',
    description: 'Point your camera at any asset. Amazon Nova AI instantly identifies the item name, brand, category, and tags.',
    color: theme.colors.primary,
  },
  {
    icon: 'location' as const,
    title: 'Place',
    subtitle: 'Assign a location',
    description: 'Organize items into Places, Shelves, and Sections. Every asset knows exactly where it lives.',
    color: theme.colors.info,
  },
  {
    icon: 'search' as const,
    title: 'Find',
    subtitle: 'Search by voice or text',
    description: '"Find a camera in the Media Lab" — Nova understands intent, not just keywords. Voice search works hands-free.',
    color: theme.colors.available,
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    if (DEMO_MODE) {
      // Skip login entirely in demo mode
      useAuthStore.getState().initialize();
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleNext = async () => {
    if (step < SLIDES.length - 1) {
      setStep(step + 1);
    } else {
      await finishOnboarding();
    }
  };

  const handleSkip = async () => {
    await finishOnboarding();
  };

  const slide = SLIDES[step];

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: slide.color + '18' }]}>
        <Ionicons name={slide.icon} size={64} color={slide.color} />
      </View>

      {/* Content */}
      <Text style={[styles.title, { color: slide.color }]}>{slide.title}</Text>
      <Text style={styles.subtitle}>{slide.subtitle}</Text>
      <Text style={styles.description}>{slide.description}</Text>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && { backgroundColor: slide.color, width: 24 }]} />
        ))}
      </View>

      {/* Action */}
      <TouchableOpacity style={[styles.nextBtn, { backgroundColor: slide.color }]} onPress={handleNext}>
        <Text style={styles.nextText}>{step === SLIDES.length - 1 ? 'Get Started' : 'Next'}</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Brand */}
      <Text style={styles.brand}>CampusVault AI</Text>
      <Text style={styles.powered}>Powered by Amazon Nova</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: theme.colors.background,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32,
  },
  skipBtn: { position: 'absolute', top: 60, right: 24 },
  skipText: { color: theme.colors.textMuted, fontSize: theme.fontSize.md },
  iconCircle: {
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 32,
  },
  title: { fontSize: 42, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: theme.colors.text, fontSize: theme.fontSize.xl, fontWeight: '600', marginBottom: 16 },
  description: {
    color: theme.colors.textSecondary, fontSize: theme.fontSize.md,
    textAlign: 'center', lineHeight: 24, maxWidth: width * 0.8,
  },
  dots: { flexDirection: 'row', gap: 8, marginTop: 40, marginBottom: 32 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: theme.colors.textDim,
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 32, paddingVertical: 16,
    borderRadius: theme.radius.full,
  },
  nextText: { color: '#fff', fontSize: theme.fontSize.lg, fontWeight: '700' },
  brand: { color: theme.colors.textMuted, fontSize: theme.fontSize.sm, marginTop: 32, fontWeight: '600' },
  powered: { color: theme.colors.textDim, fontSize: theme.fontSize.xs, marginTop: 2 },
});
