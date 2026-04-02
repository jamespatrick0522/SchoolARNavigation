import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../../constants/theme';

export const NavigationHintCard: React.FC<{
  label?: string | null;
  helperText?: string | null;
  approximateDistanceMeters?: number | null;
}> = ({label, helperText, approximateDistanceMeters}) => (
  <View style={styles.card}>
    <Text style={styles.title}>{label || 'Navigation Preview'}</Text>
    <Text style={styles.distance}>
      Approximate Distance: {approximateDistanceMeters ? `${approximateDistanceMeters}m` : 'Nearby'}
    </Text>
    <Text style={styles.helper}>{helperText || 'Follow the highlighted direction cues.'}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: '#112033', borderRadius: 16, padding: spacing.md, gap: spacing.xs},
  title: {color: colors.text, fontSize: 18, fontWeight: '900'},
  distance: {color: colors.primary, fontWeight: '700'},
  helper: {color: colors.subtext, lineHeight: 20},
});
