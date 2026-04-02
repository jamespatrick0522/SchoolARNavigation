import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../../components/ScreenContainer';
import {RootStackParamList} from '../../navigation/types';
import {SectionHeader} from '../../components/directory/SectionHeader';
import {SearchBar} from '../../components/directory/SearchBar';
import {CategoryChip} from '../../components/directory/CategoryChip';
import {RoomCard} from '../../components/directory/RoomCard';
import {EmptyState} from '../../components/directory/EmptyState';
import {LoadingState} from '../../components/directory/LoadingState';
import {publicApi} from '../../services/api/publicApi';
import {DirectoryBuilding, DirectoryCategory, DirectoryRoomListItem} from '../../types/publicApi';
import {spacing} from '../../constants/theme';

export const RoomDirectoryScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'RoomDirectory'>> = ({navigation, route}) => {
  const [search, setSearch] = useState('');
  const [rooms, setRooms] = useState<DirectoryRoomListItem[]>([]);
  const [categories, setCategories] = useState<DirectoryCategory[]>([]);
  const [buildings, setBuildings] = useState<DirectoryBuilding[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedBuilding, setSelectedBuilding] = useState<number | undefined>(route.params?.buildingId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scopeTitle = useMemo(() => route.params?.qrLabel || 'School Directory', [route.params]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [roomResponse, categoryResponse, buildingResponse] = await Promise.all([
          publicApi.getRooms({
            search,
            category: selectedCategory,
            buildingId: selectedBuilding,
            floorId: route.params?.floorId,
            page: 1,
            limit: 30,
          }),
          publicApi.getCategories(),
          publicApi.getBuildings(),
        ]);
        setRooms(roomResponse.items);
        setCategories(categoryResponse);
        setBuildings(buildingResponse);
      } catch {
        setError('Could not load the room directory. Check backend connection and seed data.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [search, selectedCategory, selectedBuilding, route.params?.floorId]);

  return (
    <ScreenContainer>
      <SectionHeader title={scopeTitle} subtitle="Search rooms, offices, laboratories, and school facilities." />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search Registrar, Library, IT Lab..." />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        <CategoryChip label="All" active={!selectedCategory} onPress={() => setSelectedCategory(undefined)} />
        {categories.map(category => (
          <CategoryChip
            key={category.id}
            label={category.name}
            active={selectedCategory === category.code}
            onPress={() => setSelectedCategory(selectedCategory === category.code ? undefined : category.code)}
            colorHex={category.colorHex}
          />
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        <CategoryChip label="All Buildings" active={!selectedBuilding} onPress={() => setSelectedBuilding(undefined)} />
        {buildings.map(building => (
          <CategoryChip
            key={building.id}
            label={building.name}
            active={selectedBuilding === building.id}
            onPress={() => setSelectedBuilding(selectedBuilding === building.id ? undefined : building.id)}
          />
        ))}
      </ScrollView>

      {loading ? <LoadingState label="Loading room directory..." /> : null}
      {error ? <EmptyState title="Directory Error" description={error} /> : null}
      {!loading && !error && !rooms.length ? (
        <EmptyState title="No Rooms Found" description="Try a broader search or clear the current filters." />
      ) : null}

      {!loading && !error
        ? rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={() => navigation.navigate('RoomDetail', {roomId: room.id})}
            />
          ))
        : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  chipsRow: {gap: spacing.sm, paddingBottom: spacing.xs},
});
