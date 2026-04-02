import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../constants/theme';

interface Props {
  label: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
}

export const StatusChip: React.FC<Props> = ({label, tone = 'info'}) => {
  return (
    <View
      style={[
        styles.base,
        tone === 'info' && styles.info,
        tone === 'success' && styles.success,
        tone === 'warning' && styles.warning,
        tone === 'danger' && styles.danger,
      ]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  info: {backgroundColor: '#0F3D69'},
  success: {backgroundColor: '#14532D'},
  warning: {backgroundColor: '#78350F'},
  danger: {backgroundColor: '#7F1D1D'},
  text: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
});
