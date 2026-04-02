import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../../constants/theme';

interface Props {
  title: string;
  description: string;
}

export const EmptyState: React.FC<Props> = ({title, description}) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {color: colors.text, fontSize: 18, fontWeight: '800'},
  description: {color: colors.subtext, lineHeight: 20},
});
