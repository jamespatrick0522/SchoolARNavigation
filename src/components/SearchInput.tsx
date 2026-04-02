import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {colors} from '../constants/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<Props> = ({value, onChangeText, placeholder}) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    style={styles.input}
    placeholder={placeholder ?? 'Search'}
    placeholderTextColor={colors.subtext}
  />
);

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#0F172A',
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
