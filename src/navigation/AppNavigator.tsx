import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {colors} from '../constants/theme';
import {WelcomeScreen} from '../screens/directory/WelcomeScreen';
import {QrScanScreen} from '../screens/directory/QrScanScreen';
import {RoomDirectoryScreen} from '../screens/directory/RoomDirectoryScreen';
import {RoomDetailScreen} from '../screens/directory/RoomDetailScreen';
import {NavigationPreviewScreen} from '../screens/directory/NavigationPreviewScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {CalibrationIntroScreen} from '../screens/CalibrationIntroScreen';
import {CalibrationARScreen} from '../screens/CalibrationARScreen';
import {NavigationIntroScreen} from '../screens/NavigationIntroScreen';
import {NavigationSelectDestinationScreen} from '../screens/NavigationSelectDestinationScreen';
import {NavigationARScreen} from '../screens/NavigationARScreen';
import {SavedDestinationsScreen} from '../screens/SavedDestinationsScreen';
import {UtilityScreen} from '../screens/UtilityScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {backgroundColor: colors.card},
        headerTintColor: colors.text,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{title: 'School AR Navigation'}} />
      <Stack.Screen name="QrScan" component={QrScanScreen} options={{title: 'Scan QR'}} />
      <Stack.Screen name="RoomDirectory" component={RoomDirectoryScreen} options={{title: 'Room Directory'}} />
      <Stack.Screen name="RoomDetail" component={RoomDetailScreen} options={{title: 'Room Details'}} />
      <Stack.Screen name="NavigationPreview" component={NavigationPreviewScreen} options={{title: 'Navigation Preview'}} />
      <Stack.Screen name="Home" component={HomeScreen} options={{title: 'AR Progress'}} />
      <Stack.Screen name="CalibrationIntro" component={CalibrationIntroScreen} options={{title: 'Calibration Guide'}} />
      <Stack.Screen name="CalibrationAR" component={CalibrationARScreen} options={{title: 'Calibration AR'}} />
      <Stack.Screen name="NavigationIntro" component={NavigationIntroScreen} options={{title: 'Navigation Guide'}} />
      <Stack.Screen name="NavigationSelectDestination" component={NavigationSelectDestinationScreen} options={{title: 'Saved AR Routes'}} />
      <Stack.Screen name="NavigationAR" component={NavigationARScreen} options={{title: 'AR Route'}} />
      <Stack.Screen name="SavedDestinations" component={SavedDestinationsScreen} options={{title: 'Saved Destinations'}} />
      <Stack.Screen name="Utility" component={UtilityScreen} options={{title: 'Utilities'}} />
    </Stack.Navigator>
  );
};
