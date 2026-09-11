import { StyleSheet } from 'react-native';
import { ThemeColors } from '../constants/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    inlineContainer: {
      paddingVertical: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    loaderStage: {
      width: 280,
      height: 280,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    orbitContainer: {
      width: 280,
      height: 280,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    bubbleWrapper: {
      position: 'absolute',
      width: 54,
      height: 54,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bubble: {
      width: 54,
      height: 54,
      borderRadius: 27,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    bubbleCenterGlow: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 18,
      elevation: 12,
    },
    textContainer: {
      marginTop: 24,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    loadingText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    subText: {
      fontSize: 12,
      color: colors.onSurfaceVariant,
      marginTop: 4,
      textAlign: 'center',
    },
  });
