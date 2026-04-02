import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../../constants/theme';

export const HeroHeader: React.FC<{
  title: string;
  subtitle: string;
  imageUrl?: string | null;
}> = ({title, subtitle, imageUrl}) => (
  <ImageBackground
    source={{uri: imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1'}}
    style={styles.hero}
    imageStyle={styles.image}>
    <View style={styles.overlay}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  hero: {height: 220, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end'},
  image: {opacity: 0.9},
  overlay: {padding: spacing.lg, backgroundColor: 'rgba(12,18,32,0.45)', gap: 6},
  title: {color: colors.text, fontSize: 28, fontWeight: '900'},
  subtitle: {color: '#E2E8F0', lineHeight: 20},
});
