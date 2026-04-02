import React, {useEffect} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {ViroARSceneNavigator} from '@reactvision/react-viro';
import {ScreenContainer} from '../components/ScreenContainer';
import {Card} from '../components/Card';
import {AppButton} from '../components/AppButton';
import {CalibrationARScene} from '../ar/scenes/CalibrationARScene';
import {colors, spacing} from '../constants/theme';
import {useCameraPermission} from '../ar/hooks/useCameraPermission';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useARSupport} from '../ar/hooks/useARSupport';
import {MarkerStatusOverlay} from '../ar/components/MarkerStatusOverlay';
import {useMarkerLock} from '../ar/hooks/useMarkerLock';
import {
  DEFAULT_MARKER_LOCK_DELAY_MS,
  DEFAULT_MARKER_LOST_TIMEOUT_MS,
  START_MARKER_TARGET_ID,
} from '../ar/constants/marker.constants';

type Props = NativeStackScreenProps<RootStackParamList, 'CalibrationAR'>;

export const CalibrationARScreen: React.FC<Props> = ({navigation}) => {
  const {granted, requestPermission} = useCameraPermission();
  const {isChecking, isSupported} = useARSupport();
  const {
    scanState,
    detectedMarkerId,
    latestAnchorData,
    isMarkerLocked,
    resetMarkerLock,
    handleMarkerFound,
    handleMarkerUpdated,
    handleMarkerRemoved,
    handleTrackingQualityChange,
  } = useMarkerLock({
    targetMarkerId: START_MARKER_TARGET_ID,
    lockDelayMs: DEFAULT_MARKER_LOCK_DELAY_MS,
    lostTrackingTimeoutMs: DEFAULT_MARKER_LOST_TIMEOUT_MS,
  });

  useEffect(() => {
    requestPermission().catch(() => {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed for AR calibration.',
      );
    });
  }, [requestPermission]);

  if (isChecking) {
    return (
      <ScreenContainer>
        <Card title="Checking AR Support">
          <Text style={styles.subtext}>
            Validating ARCore support on this Android device...
          </Text>
        </Card>
      </ScreenContainer>
    );
  }

  if (!isSupported) {
    return (
      <ScreenContainer>
        <Card title="AR Unsupported Device">
          <Text style={styles.subtext}>
            This device does not currently support ARCore. Use an ARCore-capable Android phone for the demo.
          </Text>
        </Card>
      </ScreenContainer>
    );
  }

  if (!granted) {
    return (
      <ScreenContainer>
        <Card title="Camera Permission Needed">
          <Text style={styles.subtext}>
            AR calibration requires camera access on Android.
          </Text>
          <AppButton
            label="Grant Camera Permission"
            onPress={() => {
              requestPermission().catch(() => {
                Alert.alert(
                  'Permission Required',
                  'Camera permission is needed for AR calibration.',
                );
              });
            }}
          />
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.root}>
        <View style={styles.arContainer}>
          <ViroARSceneNavigator
            autofocus
            initialScene={{scene: CalibrationARScene as unknown as () => React.JSX.Element}}
            viroAppProps={{
              targetMarkerId: START_MARKER_TARGET_ID,
              onMarkerFound: handleMarkerFound,
              onMarkerUpdated: handleMarkerUpdated,
              onMarkerRemoved: handleMarkerRemoved,
              onTrackingChanged: handleTrackingQualityChange,
            }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <MarkerStatusOverlay
          scanState={scanState}
          markerId={detectedMarkerId}
          isMarkerLocked={isMarkerLocked}
          latestAnchorData={latestAnchorData}
          onContinue={() => {
            Alert.alert(
              'Start Marker Ready',
              'The marker is locked and its latest anchor pose is ready for waypoint placement in Step 5.',
            );
          }}
          onReset={resetMarkerLock}
        />

        <View style={styles.footer}>
          <Card
            title="Calibration Status"
            subtitle="This step only scans and locks the printed start marker.">
            <Text style={styles.subtext}>
              Locked marker data will be reused as the calibration origin in the next step.
            </Text>
            <AppButton
              label="Back"
              variant="secondary"
              onPress={() => navigation.goBack()}
            />
          </Card>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
  arContainer: {flex: 1, minHeight: 280},
  footer: {
    padding: spacing.md,
    backgroundColor: '#0B1324',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  subtext: {color: colors.subtext, fontSize: 13},
});
