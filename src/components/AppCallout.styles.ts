import { StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '../constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 4,
    borderWidth: 1,
    marginVertical: SPACING.sm,
  },
  iconBox: {
    marginRight: 12,
    marginTop: 1,
  },
  contentBox: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});
