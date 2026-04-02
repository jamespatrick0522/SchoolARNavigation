import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../../constants/theme';

interface Props {
  title?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({title, value, onChangeText, placeholder}) => {
  const {TextInput} = require('react-native');
  return (
    <View style={styles.wrapper}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search room'}
        placeholderTextColor={colors.subtext}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {gap: spacing.xs},
  title: {color: colors.subtext, fontSize: 13, fontWeight: '700'},
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#0F172A',
    color: colors.text,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
});
