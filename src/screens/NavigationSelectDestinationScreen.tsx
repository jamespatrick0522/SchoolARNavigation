import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {ScreenContainer} from '../components/ScreenContainer';
import {SearchInput} from '../components/SearchInput';
import {Card} from '../components/Card';
import {AppButton} from '../components/AppButton';
import {StatusChip} from '../components/StatusChip';
import {useAppData} from '../state/AppDataContext';
import {distance3d, toMetersLabel} from '../utils/math';

type Props = NativeStackScreenProps<RootStackParamList, 'NavigationSelectDestination'>;

export const NavigationSelectDestinationScreen: React.FC<Props> = ({navigation}) => {
  const {schema} = useAppData();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return schema.destinations;
    }
    return schema.destinations.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
    );
  }, [schema.destinations, query]);

  return (
    <ScreenContainer>
      <SearchInput value={query} onChangeText={setQuery} placeholder="Search rooms, offices, categories..." />
      {!filtered.length ? (
        <Card title="No Destinations Yet" subtitle="Create calibration routes first, then come back to navigate." />
      ) : null}

      {filtered.map(destination => {
        const route = schema.routeCalibrations.find(r => r.destinationId === destination.id);
        const waypoints = route?.waypoints ?? [];
        const pathDistance = waypoints.reduce((acc, waypoint, index) => {
          const previous = index === 0 ? {x: 0, y: 0, z: 0} : waypoints[index - 1].position;
          return acc + distance3d(previous, waypoint.position);
        }, 0);
        const totalDistance =
          pathDistance +
          (route?.destinationPose
            ? distance3d(waypoints[waypoints.length - 1]?.position ?? {x: 0, y: 0, z: 0}, route.destinationPose.position)
            : 0);

        return (
          <Card key={destination.id} title={destination.name} subtitle={destination.description}>
            <View style={styles.row}>
              <StatusChip label={destination.category} tone="info" />
              <StatusChip label={`${waypoints.length} waypoints`} tone="success" />
              <StatusChip label={toMetersLabel(totalDistance)} tone="warning" />
            </View>
            <AppButton
              label="Start AR Navigation"
              onPress={() => navigation.navigate('NavigationAR', {destinationId: destination.id})}
            />
          </Card>
        );
      })}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
});
