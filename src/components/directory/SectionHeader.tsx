import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../../constants/theme';

export const SectionHeader: React.FC<{title: string; subtitle?: string}> = ({title, subtitle}) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {gap: 4},
  title: {color: colors.text, fontSize: 20, fontWeight: '900'},
  subtitle: {color: colors.subtext, lineHeight: 20},
});
