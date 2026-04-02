import React, {useState} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {ScreenContainer} from '../components/ScreenContainer';
import {Card} from '../components/Card';
import {AppButton} from '../components/AppButton';
import {colors} from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CalibrationIntro'>;

export const CalibrationIntroScreen: React.FC<Props> = ({navigation}) => {
  const [showGuide, setShowGuide] = useState(true);
  return (
    <ScreenContainer>
      <Card title="Calibration Steps">
        <Text style={styles.text}>1. Scan Start Marker (printed marker image).</Text>
        <Text style={styles.text}>2. Enter destination details.</Text>
        <Text style={styles.text}>3. Tap floor to place waypoints in order.</Text>
        <Text style={styles.text}>4. Place final destination marker and save route.</Text>
      </Card>

      <Card title="Presentation Tips">
        <Text style={styles.text}>Use a flat area with clear lighting for reliable marker lock.</Text>
        <Text style={styles.text}>Keep route short for smoother demo and faster re-localization.</Text>
      </Card>

      <AppButton label="Open AR Calibration" onPress={() => navigation.navigate('CalibrationAR')} />

      <Modal visible={showGuide} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Calibration Onboarding</Text>
            <Text style={styles.modalText}>Scan the printed start marker first before placing any point.</Text>
            <Text style={styles.modalText}>Use the guided buttons for waypoint and destination placement.</Text>
            <AppButton label="Understood" onPress={() => setShowGuide(false)} />
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
