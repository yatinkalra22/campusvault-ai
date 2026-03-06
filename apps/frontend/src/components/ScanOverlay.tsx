import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

/** Animated scanning overlay shown while Nova AI analyzes an image */
export function ScanOverlay() {
  const scanLine = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Scan line moving top to bottom
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Pulsing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = scanLine.interpolate({ inputRange: [0, 1], outputRange: [0, 180] });

  return (
    <View style={styles.container}>
      {/* Semi-transparent overlay */}
      <View style={styles.overlay} />

      {/* Scanning line */}
      <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />

      {/* Corner brackets */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      {/* Pulsing label */}
      <Animated.View style={[styles.labelContainer, { opacity: pulse }]}>
        <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
        <Text style={styles.label}>Nova AI Analyzing...</Text>
      </Animated.View>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primary + '15',
  },
  scanLine: {
    position: 'absolute', left: 8, right: 8,
    height: 2,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE, height: CORNER_SIZE,
    borderColor: theme.colors.primary,
  },
  topLeft: { top: 8, left: 8, borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH },
  topRight: { top: 8, right: 8, borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH },
  bottomLeft: { bottom: 8, left: 8, borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH },
  bottomRight: { bottom: 8, right: 8, borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH },
  labelContainer: {
    position: 'absolute', bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: theme.colors.surface + 'DD',
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20,
  },
  label: { color: theme.colors.primary, fontSize: 13, fontWeight: '700' },
});
