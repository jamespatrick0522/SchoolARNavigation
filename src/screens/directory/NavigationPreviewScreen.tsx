import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../../components/ScreenContainer';
import {RootStackParamList} from '../../navigation/types';
import {publicApi} from '../../services/api/publicApi';
import {NavigationPreviewConfig} from '../../types/publicApi';
import {LoadingState} from '../../components/directory/LoadingState';
import {EmptyState} from '../../components/directory/EmptyState';
import {NavigationHintCard} from '../../components/directory/NavigationHintCard';
import {SectionHeader} from '../../components/directory/SectionHeader';
import {colors, spacing} from '../../constants/theme';

const getArrow = (direction: string) => {
  if (direction.includes('left')) return '<';
  if (direction.includes('right')) return '>';
  if (direction.includes('back')) return 'v';
  return '^';
};

export const NavigationPreviewScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'NavigationPreview'>> = ({route}) => {
  const [preview, setPreview] = useState<NavigationPreviewConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const config = await publicApi.getNavigationPreview(route.params.roomId);
        setPreview(config);
      } catch {
        setError('Navigation preview is not available yet.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [route.params.roomId]);

  const arrowGlyph = useMemo(() => getArrow(preview?.arrowDirection || 'forward'), [preview]);

  if (loading) return <ScreenContainer><LoadingState label="Loading navigation preview..." /></ScreenContainer>;
  if (error || !preview) return <ScreenContainer><EmptyState title="Preview Unavailable" description={error || 'Missing preview configuration.'} /></ScreenContainer>;

  return (
    <ScreenContainer>
      <SectionHeader title={route.params.roomName} subtitle="Static navigation preview for thesis demonstration" />
      <View style={styles.previewStage}>
        <View style={styles.fakeCameraFrame}>
          <Text style={styles.overlayLabel}>{preview.overlayLabel || route.params.roomName}</Text>
          <Text style={styles.arrow}>{arrowGlyph}</Text>
          <Text style={styles.distance}>{preview.approximateDistanceMeters || 0}m ahead</Text>
          <Text style={styles.helper}>{preview.helperText}</Text>
        </View>
      </View>
      <NavigationHintCard
        label={preview.overlayLabel}
        helperText={preview.helperText}
        approximateDistanceMeters={preview.approximateDistanceMeters}
      />
      <SectionHeader title="Mock Steps" subtitle="Easy-to-explain flow for the panel" />
      {preview.mockStepsJson.map((step, index) => (
        <View key={`${index}-${step}`} style={styles.stepCard}>
          <Text style={styles.stepIndex}>{index + 1}</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  previewStage: {paddingVertical: spacing.md},
  fakeCameraFrame: {
    minHeight: 320,
    borderRadius: 24,
    backgroundColor: '#0B0F1A',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overlayLabel: {color: colors.text, fontWeight: '800', fontSize: 18},
  arrow: {color: colors.primary, fontWeight: '900', fontSize: 110, lineHeight: 120},
  distance: {color: colors.text, fontSize: 22, fontWeight: '900'},
  helper: {color: colors.subtext, textAlign: 'center', lineHeight: 22},
  stepCard: {flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', backgroundColor: colors.card, padding: spacing.md, borderRadius: 16, borderWidth: 1, borderColor: colors.border},
  stepIndex: {color: colors.primary, fontSize: 18, fontWeight: '900'},
  stepText: {color: colors.text, flex: 1, lineHeight: 20},
});
