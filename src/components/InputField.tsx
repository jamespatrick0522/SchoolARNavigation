import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, spacing} from '../constants/theme';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export const InputField: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, multiline && styles.multiline]}
      multiline={multiline}
      placeholder={placeholder}
      placeholderTextColor={colors.subtext}
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    color: colors.subtext,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  multiline: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
});
