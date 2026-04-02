import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {colors, spacing} from '../constants/theme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<Props> = ({children, scroll = true, style}) => {
  if (!scroll) {
    return <SafeAreaView style={[styles.root, style]}>{children}</SafeAreaView>;
  }
  return (
    <SafeAreaView style={[styles.root, style]}>
      <ScrollView contentContainerStyle={styles.scroll}>{children}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 48,
  },
});
