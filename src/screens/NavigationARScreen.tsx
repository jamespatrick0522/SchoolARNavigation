import React, {useEffect, useMemo, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ViroARSceneNavigator} from '@reactvision/react-viro';
import {RootStackParamList} from '../navigation/types';
import {ScreenContainer} from '../components/ScreenContainer';
import {Card} from '../components/Card';
import {StatusChip} from '../components/StatusChip';
import {AppButton} from '../components/AppButton';
import {NavigationARScene} from '../ar/scenes/NavigationARScene';
import {NavigationState} from '../types/models';
import {useAppData} from '../state/AppDataContext';
import {distance3d, toMetersLabel} from '../utils/math';
import {colors, spacing} from '../constants/theme';
import {useCameraPermission} from '../ar/hooks/useCameraPermission';
import {useARSupport} from '../ar/hooks/useARSupport';

type Props = NativeStackScreenProps<RootStackParamList, 'NavigationAR'>;

export const NavigationARScreen: React.FC<Props> = ({route, navigation}) => {
  const destinationId = route.params.destinationId;
  const {schema} = useAppData();
  const destination = schema.destinations.find(d => d.id === destinationId);
  const routeData = schema.routeCalibrations.find(r => r.destinationId === destinationId);
  const [navState, setNavState] = useState<NavigationState>('WAITING_FOR_MARKER');
  const [trackingStatus, setTrackingStatus] = useState<'NORMAL' | 'LIMITED' | 'TRACKING_LOST'>('TRACKING_LOST');
  const [markerDetected, setMarkerDetected] = useState(false);
  const [distanceToDestination, setDistanceToDestination] = useState<number>(0);
  const [activeWaypoint, setActiveWaypoint] = useState<number>(1);
  const {granted, requestPermission} = useCameraPermission();
  const {isChecking, isSupported} = useARSupport();

  useEffect(() => {
    requestPermission().catch(() => {
      Alert.alert('Permission Required', 'Camera permission is needed for AR navigation.');
    });
  }, [requestPermission]);

  const distanceEstimate = useMemo(() => {
    if (!routeData) {
      return 0;
    }
    const points = [{x: 0, y: 0, z: 0}, ...routeData.waypoints.map(w => w.position), routeData.destinationPose.position];
    return points.slice(0, -1).reduce((acc, point, index) => acc + distance3d(point, points[index + 1]), 0);
  }, [routeData]);

  useEffect(() => {
    if (navState === 'ARRIVED') {
      return;
    }
    if (trackingStatus === 'TRACKING_LOST') {
      setNavState('TRACKING_LOST');
      return;
    }
    if (trackingStatus === 'LIMITED') {
      setNavState('TRACKING_WEAK');
      return;
    }
    if (trackingStatus === 'NORMAL' && markerDetected) {
      setNavState('ROUTE_RENDERING');
    }
  }, [trackingStatus, markerDetected, navState]);

  useEffect(() => {
    if (distanceToDestination > 0 && distanceToDestination <= 0.9) {
      setNavState('ARRIVED');
    }
  }, [distanceToDestination]);

  if (!destination || !routeData) {
    return (
      <ScreenContainer>
        <Card title="Destination Not Found" subtitle="The selected route is missing or was deleted." />
        <AppButton label="Back to Destinations" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  if (isChecking) {
    return (
      <ScreenContainer>
        <Card title="Checking AR Support">
          <Text style={styles.subtext}>Validating ARCore support on this Android device...</Text>
        </Card>
      </ScreenContainer>
    );
  }

  if (!isSupported) {
    return (
      <ScreenContainer>
        <Card title="AR Unsupported Device">
          <Text style={styles.subtext}>
            This device does not currently support ARCore. Use an ARCore-capable Android phone for navigation demo.
          </Text>
        </Card>
      </ScreenContainer>
    );
  }

  if (!granted) {
    return (
      <ScreenContainer>
        <Card title="Camera Permission Needed">
          <Text style={styles.subtext}>AR navigation requires camera access.</Text>
          <AppButton label="Grant Camera Permission" onPress={() => requestPermission()} />
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
            initialScene={{scene: NavigationARScene as unknown as () => React.JSX.Element}}
            viroAppProps={{
              route: routeData,
              destinationName: destination.name,
              onMarkerDetected: () => {
                setMarkerDetected(true);
                setNavState('MARKER_DETECTED');
              },
              onTrackingChanged: setTrackingStatus,
              onProgressUpdate: (distance: number, activeIndex: number, arrived: boolean) => {
                setDistanceToDestination(distance);
                setActiveWaypoint(activeIndex);
                if (arrived) {
                  setNavState('ARRIVED');
                }
              },
            }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.panel}>
          <View style={styles.row}>
            <StatusChip label={`State: ${navState}`} tone="info" />
            <StatusChip
              label={trackingStatus === 'TRACKING_LOST' ? 'Tracking Lost - Re-scan Start Marker' : `Tracking: ${trackingStatus}`}
              tone={trackingStatus === 'NORMAL' ? 'success' : trackingStatus === 'LIMITED' ? 'warning' : 'danger'}
            />
          </View>
          <Card title={destination.name} subtitle={destination.description}>
            <Text style={styles.subtext}>Category: {destination.category}</Text>
            <Text style={styles.subtext}>Waypoints: {routeData.waypoints.length}</Text>
            <Text style={styles.subtext}>Estimated distance: {toMetersLabel(distanceEstimate)}</Text>
            <Text style={styles.subtext}>
              Progress: waypoint {Math.min(activeWaypoint, routeData.waypoints.length + 1)} of{' '}
              {Math.max(routeData.waypoints.length + 1, 1)}
            </Text>
            <Text style={styles.subtext}>
              Live distance to destination: {toMetersLabel(distanceToDestination)}
            </Text>
          </Card>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
  arContainer: {flex: 1, minHeight: 280},
  panel: {
    backgroundColor: '#0B1324',
    borderTopWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap'},
  subtext: {color: colors.subtext, fontSize: 14},
});
