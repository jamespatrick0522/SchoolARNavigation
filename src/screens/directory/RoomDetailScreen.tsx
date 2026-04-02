import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../../components/ScreenContainer';
import {RootStackParamList} from '../../navigation/types';
import {publicApi} from '../../services/api/publicApi';
import {RoomDetail} from '../../types/publicApi';
import {HeroHeader} from '../../components/directory/HeroHeader';
import {SectionHeader} from '../../components/directory/SectionHeader';
import {LoadingState} from '../../components/directory/LoadingState';
import {EmptyState} from '../../components/directory/EmptyState';
import {InfoRow} from '../../components/directory/InfoRow';
import {ContactCard} from '../../components/directory/ContactCard';
import {AppButton} from '../../components/AppButton';
import {colors, spacing} from '../../constants/theme';

export const RoomDetailScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'RoomDetail'>> = ({route, navigation}) => {
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await publicApi.getRoomById(route.params.roomId);
        setRoom(detail);
      } catch {
        setError('Could not load room details.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [route.params.roomId]);

  if (loading) {
    return <ScreenContainer><LoadingState label="Loading room details..." /></ScreenContainer>;
  }

  if (error || !room) {
    return <ScreenContainer><EmptyState title="Room Not Available" description={error || 'Room details are missing.'} /></ScreenContainer>;
  }

  return (
    <ScreenContainer>
      <HeroHeader title={room.roomName} subtitle={`${room.categoryName} ? ${room.buildingName} ? ${room.floorName}`} imageUrl={room.coverImageUrl} />
      <SectionHeader title="Room Information" subtitle={room.description || 'Public room directory detail.'} />
      <InfoRow label="Room Number" value={room.roomNumber} />
      <InfoRow label="Nearest Landmark" value={room.nearestLandmark} />
      <InfoRow label="Operating Hours" value={room.operatingHours} />
      <InfoRow label="Location Note" value={room.locationNote} />
      <InfoRow label="Contact Email" value={room.contactEmail} />
      <InfoRow label="Contact Phone" value={room.contactPhone} />
      <InfoRow label="Demo Navigation" value={room.demoNavigationNote} />

      <SectionHeader title="People In Charge" />
      {room.people.length ? room.people.map(person => <ContactCard key={person.id} person={person} />) : <EmptyState title="No Assigned Staff" description="No room personnel were attached yet." />}

      <SectionHeader title="Gallery" subtitle="Helpful room visuals for panel presentation." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
        {room.gallery.map(image => (
          <View key={image.id} style={styles.galleryCard}>
            <Image source={{uri: image.imageUrl}} style={styles.galleryImage} />
            <Text style={styles.galleryCaption}>{image.caption || room.roomName}</Text>
          </View>
        ))}
      </ScrollView>

      <AppButton label="Preview Navigation" onPress={() => navigation.navigate('NavigationPreview', {roomId: room.id, roomName: room.roomName})} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  galleryRow: {gap: spacing.md},
  galleryCard: {width: 220, gap: spacing.xs},
  galleryImage: {width: 220, height: 140, borderRadius: 16, backgroundColor: colors.cardAlt},
  galleryCaption: {color: colors.subtext, fontSize: 12},
});
