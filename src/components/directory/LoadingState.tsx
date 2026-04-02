import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../../constants/theme';

export const LoadingState: React.FC<{label?: string}> = ({label}) => (
  <View style={styles.wrapper}>
    <ActivityIndicator color={colors.primary} />
    <Text style={styles.label}>{label ?? 'Loading...'}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {padding: spacing.lg, alignItems: 'center', gap: spacing.sm},
  label: {color: colors.subtext},
});
