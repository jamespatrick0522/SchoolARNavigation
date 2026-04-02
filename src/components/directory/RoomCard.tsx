import React from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../../constants/theme';
import {DirectoryRoomListItem} from '../../types/publicApi';

interface Props {
  room: DirectoryRoomListItem;
  onPress: () => void;
}

export const RoomCard: React.FC<Props> = ({room, onPress}) => (
  <Pressable onPress={onPress} style={styles.card}>
    <ImageBackground
      source={{uri: room.coverImageUrl || room.imageUrl || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72'}}
      style={styles.cover}
      imageStyle={styles.coverImage}>
      {room.isFeatured ? <Text style={styles.badge}>Featured</Text> : null}
    </ImageBackground>
    <View style={styles.content}>
      <Text style={styles.title}>{room.roomName}</Text>
      <Text style={styles.meta}>{room.category} ? {room.buildingName} ? {room.floorName}</Text>
      <Text style={styles.description} numberOfLines={2}>{room.description || room.staticDistanceNote || 'Public room directory entry'}</Text>
      <Text style={styles.note}>{room.staticDistanceNote || room.nearestLandmark || 'Approximate navigation available'}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cover: {height: 140, justifyContent: 'flex-start', padding: spacing.sm},
  coverImage: {opacity: 0.86},
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(12,18,32,0.88)',
    color: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '800',
  },
  content: {padding: spacing.md, gap: spacing.xs},
  title: {color: colors.text, fontSize: 18, fontWeight: '900'},
  meta: {color: colors.subtext, fontSize: 13},
  description: {color: colors.text, fontSize: 14, lineHeight: 20},
  note: {color: colors.primary, fontWeight: '700', fontSize: 13},
});
