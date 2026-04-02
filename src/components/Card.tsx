import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../constants/theme';

interface Props {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<Props> = ({title, subtitle, children}) => {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtext,
    lineHeight: 20,
  },
});
