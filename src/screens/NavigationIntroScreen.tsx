import React, {useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {ScreenContainer} from '../components/ScreenContainer';
import {Card} from '../components/Card';
import {AppButton} from '../components/AppButton';
import {colors} from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NavigationIntro'>;

export const NavigationIntroScreen: React.FC<Props> = ({navigation}) => {
  const [showGuide, setShowGuide] = useState(true);
  return (
    <ScreenContainer>
      <Card title="How Navigation Works">
        <Text style={styles.text}>1. Scan the same printed start marker again.</Text>
        <Text style={styles.text}>2. Pick a saved destination.</Text>
        <Text style={styles.text}>3. Follow AR arrows from waypoint to waypoint.</Text>
        <Text style={styles.text}>4. If tracking is lost, point back to the start marker.</Text>
      </Card>

      <AppButton label="Select Destination" onPress={() => navigation.navigate('NavigationSelectDestination')} />

      <Modal visible={showGuide} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Navigation Onboarding</Text>
            <Text style={styles.modalText}>Keep the start marker visible at the beginning of each run.</Text>
            <Text style={styles.modalText}>This prototype uses marker-relative positioning for repeatable demos.</Text>
            <AppButton label="Continue" onPress={() => setShowGuide(false)} />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  text: {color: colors.subtext, lineHeight: 20},
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {color: colors.text, fontSize: 18, fontWeight: '800'},
  modalText: {color: colors.subtext, lineHeight: 20},
});
