import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../constants/theme';

interface Props {
  label: string;
  active?: boolean;
  onPress: () => void;
  colorHex?: string | null;
}

export const CategoryChip: React.FC<Props> = ({label, active, onPress, colorHex}) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.chip,
      active && styles.active,
      colorHex ? {borderColor: colorHex} : null,
    ]}>
    <Text style={styles.text}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: '#134E4A',
  },
  text: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
});
