import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/** Returns current breakpoint and dimensions for responsive layouts */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const breakpoint: Breakpoint =
    width >= 1024 ? 'desktop' :
    width >= 768 ? 'tablet' :
    'mobile';

  return {
    width,
    height,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isWide: breakpoint !== 'mobile',
    // Max content width — prevents stretched layouts on wide screens
    contentMaxWidth: breakpoint === 'desktop' ? 960 : breakpoint === 'tablet' ? 720 : width,
  };
}
