import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../../constants/theme';

export const InfoRow: React.FC<{label: string; value?: string | null}> = ({label, value}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'Not available'}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {gap: spacing.xs},
  label: {color: colors.subtext, fontSize: 12, fontWeight: '700'},
  value: {color: colors.text, fontSize: 14, lineHeight: 20},
});
