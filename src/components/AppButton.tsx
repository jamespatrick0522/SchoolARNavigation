import React from 'react';
import {Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import {colors, spacing} from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

export const AppButton: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}) => {
  return (
    <Pressable
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primary: {
    backgroundColor: colors.primaryDark,
  },
  secondary: {
    backgroundColor: colors.cardAlt,
  },
  danger: {
    backgroundColor: '#7F1D1D',
    borderColor: '#B91C1C',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
