import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../../components/ScreenContainer';
import {HeroHeader} from '../../components/directory/HeroHeader';
import {QRPromptCard} from '../../components/directory/QRPromptCard';
import {SectionHeader} from '../../components/directory/SectionHeader';
import {AppButton} from '../../components/AppButton';
import {RootStackParamList} from '../../navigation/types';

export const WelcomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Welcome'>> = ({navigation}) => {
  return (
    <ScreenContainer>
      <HeroHeader
        title="School AR Navigation"
        subtitle="QR-first public room directory and navigation preview for thesis demo"
      />
      <SectionHeader
        title="Start Here"
        subtitle="Scan a school QR code or browse the full room directory. AR calibration progress remains available in the app as an in-progress thesis feature."
      />
      <QRPromptCard
        title="Scan QR"
        description="Use a school QR code to jump directly into the correct directory scope."
        buttonLabel="Scan QR or Enter Code"
        onPress={() => navigation.navigate('QrScan')}
      />
      <QRPromptCard
        title="Browse Directory"
        description="Open the public directory for rooms, offices, laboratories, and facilities."
        buttonLabel="Browse Rooms"
        onPress={() => navigation.navigate('RoomDirectory', {})}
      />
      <AppButton
        label="View AR Progress"
        variant="secondary"
        onPress={() => navigation.navigate('Home')}
      />
    </ScreenContainer>
  );
};
