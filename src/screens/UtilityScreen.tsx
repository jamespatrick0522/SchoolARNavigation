import React from 'react';
import {Alert, StyleSheet, Text} from 'react-native';
import {ScreenContainer} from '../components/ScreenContainer';
import {Card} from '../components/Card';
import {AppButton} from '../components/AppButton';
import {useAppData} from '../state/AppDataContext';
import {START_MARKER_ID, START_MARKER_WIDTH_METERS} from '../constants/marker';
import {colors} from '../constants/theme';

export const UtilityScreen: React.FC = () => {
  const {resetAllData, setDemoMode, schema, seedData} = useAppData();

  return (
    <ScreenContainer>
      <Card title="Marker Information">
        <Text style={styles.text}>Marker ID: {START_MARKER_ID}</Text>
        <Text style={styles.text}>Physical Width: {START_MARKER_WIDTH_METERS} meters</Text>
        <Text style={styles.text}>Asset: start-marker.png</Text>
      </Card>

      <Card title="Presentation Utilities">
        <AppButton
          label={schema.demoMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
          variant="secondary"
          onPress={() => setDemoMode(!schema.demoMode)}
        />
        <AppButton
          label="Seed Demo Route"
          variant="secondary"
          onPress={async () => {
            await seedData();
            Alert.alert('Seed Complete', 'Demo route is now available.');
          }}
        />
        <AppButton
          label="Reset All Local Data"
          variant="danger"
          onPress={async () => {
            await resetAllData();
            Alert.alert('Reset Complete', 'All local routes and markers have been deleted.');
          }}
        />
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  text: {color: colors.subtext, lineHeight: 20},
});
