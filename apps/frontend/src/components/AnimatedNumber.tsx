import { useEffect, useRef, useState } from 'react';
import { Text, Animated, StyleProp, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

/** Counts up from 0 to value over duration ms */
export function AnimatedNumber({ value, duration = 800, style }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    const listener = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(anim, { toValue: value, duration, useNativeDriver: false }).start();
    return () => anim.removeListener(listener);
  }, [value]);

  return <Text style={style}>{display}</Text>;
}
