import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppButton} from '../AppButton';
import {colors, spacing} from '../../constants/theme';

export const QRPromptCard: React.FC<{
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
}> = ({title, description, buttonLabel, onPress}) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    <AppButton label={buttonLabel} onPress={onPress} />
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: colors.card, borderRadius: 18, padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.border},
  title: {color: colors.text, fontSize: 18, fontWeight: '900'},
  description: {color: colors.subtext, lineHeight: 20},
});
