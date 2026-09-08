import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Reference base width (standard modern device width)
const BASE_WIDTH = 390;

// Percentage helpers
export const wp = (percent) => (SCREEN_WIDTH * percent) / 100;
export const hp = (percent) => (SCREEN_HEIGHT * percent) / 100;

// Scaling helpers
export const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;

export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const normalize = (size) => {
  const scaledSize = scale(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize)) - 2;
};

// Device characteristics
export const isSmallDevice = SCREEN_WIDTH < 360;
export const isLargeDevice = SCREEN_WIDTH >= 428;

export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

// Layout constants
export const MIN_TOUCH_SIZE = 44;
export const CARD_PADDING = isSmallDevice ? 12 : 16;
export const SCREEN_PADDING = isSmallDevice ? 14 : 16;
export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 82 : 68;
