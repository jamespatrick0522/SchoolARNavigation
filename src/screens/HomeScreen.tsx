import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {ScreenContainer} from '../components/ScreenContainer';
import {Card} from '../components/Card';
import {AppButton} from '../components/AppButton';
import {StatusChip} from '../components/StatusChip';
import {colors, spacing} from '../constants/theme';
import {useAppData} from '../state/AppDataContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {schema, resetAllData} = useAppData();

  return (
    <ScreenContainer>
      <Card>
        <Text style={styles.title}>AR Progress Hub</Text>
        <Text style={styles.subtitle}>
          The thesis MVP now prioritizes QR-based room discovery and navigation preview. AR calibration and marker-based navigation remain visible here as ongoing project progress.
        </Text>
        <View style={styles.row}>
          <StatusChip label={`${schema.destinations.length} saved AR destinations`} tone="info" />
          <StatusChip label={schema.demoMode ? 'Demo Seed Ready' : 'Demo Seed Off'} tone="success" />
        </View>
      </Card>

      <AppButton label="Calibration Intro" onPress={() => navigation.navigate('CalibrationIntro')} />
      <AppButton label="AR Navigation Intro" onPress={() => navigation.navigate('NavigationIntro')} />
      <AppButton label="Saved AR Destinations" variant="secondary" onPress={() => navigation.navigate('SavedDestinations')} />
      <AppButton label="Utilities" variant="secondary" onPress={() => navigation.navigate('Utility')} />
      <AppButton label="Back to QR MVP" variant="secondary" onPress={() => navigation.navigate('Welcome')} />
      <AppButton
        label="Reset Local AR Data"
        variant="danger"
        onPress={async () => {
          await resetAllData();
          Alert.alert('Reset Complete', 'All local data has been cleared.');
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    color: colors.subtext,
    lineHeight: 21,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
});
