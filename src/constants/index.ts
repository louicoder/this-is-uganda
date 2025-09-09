import { MMKV } from 'react-native-mmkv';
import { PixelRatio, Dimensions } from 'react-native';

export const RADIO_BASE_URL = 'https://radio.garden/api';

export const SAMPLE_MP3_AUDIO = 'https://software-mansion.github.io/react-native-audio-api/audio/music/example-music-02.mp3';

// This is a sample URL for aradio station to test with audio stream
export const SAMPLE_RADIO_URL = `${RADIO_BASE_URL}/ara/content/listen/ZWgOxrRv/channel.mp3`;

export const MMKV_STORAGE = new MMKV({ id: 'default' });

export const { height: HEIGHT, width: WIDTH } = Dimensions.get('window');
// Base dimensions — same as react-native-responsive-fontsize
const baseHeight = 667; // iPhone 6/7/8

/**
 * RFVALUE - scales font size based on device height
 * @param fontSize - the base font size you want to scale
 * @param standardScreenHeight - optional custom base height (default: 667)
 */
export const RFVALUE = (fontSize: number, standardScreenHeight: number = baseHeight): number => {
  const heightPercent = (fontSize * HEIGHT) / standardScreenHeight;
  return Math.round(PixelRatio.roundToNearestPixel(heightPercent));
};

/**
 * RFPERCENTAGE - gets font size as percentage of current screen height
 * @param percent - number between 0 and 100
 */
export const RFPERCENTAGE = (percent: number): number => {
  const heightPercent = (percent * HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(heightPercent));
};
