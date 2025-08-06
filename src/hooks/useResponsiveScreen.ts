// src/hooks/useTheme.ts
import { useWindowDimensions, PixelRatio } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * useResponsiveFontSize - replicates RFVALUE and RFPERCENTAGE functionality
 */
export const useResponsiveFontSize = () => {
  const { height: HEIGHT, width: WIDTH } = useWindowDimensions();
  const { top: TOP, bottom: BOTTOM } = useSafeAreaInsets();

  // Base dimensions — same as react-native-responsive-fontsize
  const baseHeight = 667; // iPhone 6/7/8
  const baseWidth = 375;

  /**
   * RFVALUE - scales font size based on device height
   * @param fontSize - the base font size you want to scale
   * @param standardScreenHeight - optional custom base height (default: 667)
   */
  const RFVALUE = (fontSize: number, standardScreenHeight: number = baseHeight): number => {
    const heightPercent = (fontSize * HEIGHT) / standardScreenHeight;
    return Math.round(PixelRatio.roundToNearestPixel(heightPercent));
  };

  /**
   * RFPERCENTAGE - gets font size as percentage of current screen height
   * @param percent - number between 0 and 100
   */
  const RFPERCENTAGE = (percent: number): number => {
    const heightPercent = (percent * HEIGHT) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(heightPercent));
  };

  return { RFVALUE, RFPERCENTAGE, HEIGHT, WIDTH, BOTTOM, TOP };
};
