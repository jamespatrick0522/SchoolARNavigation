import React, {useState} from 'react';
import {Alert} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../../components/ScreenContainer';
import {InputField} from '../../components/InputField';
import {AppButton} from '../../components/AppButton';
import {RootStackParamList} from '../../navigation/types';
import {SectionHeader} from '../../components/directory/SectionHeader';
import {QRPromptCard} from '../../components/directory/QRPromptCard';
import {publicApi} from '../../services/api/publicApi';

export const QrScanScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'QrScan'>> = ({navigation}) => {
  const [qrValue, setQrValue] = useState('PHILLIPINE-ADVENT-COLLEGE-DIRECTORY');
  const [loading, setLoading] = useState(false);

  const resolveQr = async (value: string) => {
    setLoading(true);
    try {
      const entry = await publicApi.getQrEntry(value.trim());
      if (entry.scopeType === 'school_directory') {
        navigation.replace('RoomDirectory', {qrScope: entry.scopeType, qrLabel: entry.label});
        return;
      }
      if (entry.scopeType === 'building_directory') {
        navigation.replace('RoomDirectory', {
          qrScope: entry.scopeType,
          qrLabel: entry.label,
          buildingId: entry.buildingId ?? undefined,
        });
        return;
      }
      if (entry.scopeType === 'floor_directory') {
        navigation.replace('RoomDirectory', {
          qrScope: entry.scopeType,
          qrLabel: entry.label,
          floorId: entry.floorId ?? undefined,
        });
        return;
      }
      if (entry.scopeType === 'room_entry' && entry.roomId) {
        navigation.replace('RoomDetail', {roomId: entry.roomId});
      }
    } catch (error) {
      Alert.alert('QR Lookup Failed', 'Could not resolve that QR code. Try the demo QR value.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <SectionHeader
        title="QR Entry"
        subtitle="For reliability, this thesis MVP supports direct QR value entry and demo QR resolution first. A live camera QR scanner can be added next without changing the room directory backend flow."
      />
      <InputField
        label="QR Value"
        value={qrValue}
        onChangeText={setQrValue}
        placeholder="PHILLIPINE-ADVENT-COLLEGE-DIRECTORY"
      />
      <AppButton
        label={loading ? 'Loading QR...' : 'Open QR Directory'}
        onPress={() => void resolveQr(qrValue)}
        disabled={loading || !qrValue.trim()}
      />
      <QRPromptCard
        title="Demo QR"
        description="Use the seeded school-wide QR to open the full directory instantly during mock defense."
        buttonLabel="Use PHILLIPINE-ADVENT-COLLEGE-DIRECTORY"
        onPress={() => {
          setQrValue('PHILLIPINE-ADVENT-COLLEGE-DIRECTORY');
          void resolveQr('PHILLIPINE-ADVENT-COLLEGE-DIRECTORY');
        }}
      />
    </ScreenContainer>
  );
};
