import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../../constants/theme';
import {RoomPerson} from '../../types/publicApi';

export const ContactCard: React.FC<{person: RoomPerson}> = ({person}) => (
  <View style={styles.card}>
    <Text style={styles.name}>{person.fullName}</Text>
    <Text style={styles.role}>{person.roleTitle || 'Staff'}</Text>
    {person.email ? <Text style={styles.meta}>{person.email}</Text> : null}
    {person.phone ? <Text style={styles.meta}>{person.phone}</Text> : null}
    {person.officeHours ? <Text style={styles.meta}>{person.officeHours}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: colors.cardAlt, borderRadius: 14, padding: spacing.md, gap: 4},
  name: {color: colors.text, fontSize: 16, fontWeight: '800'},
  role: {color: colors.primary, fontWeight: '700'},
  meta: {color: colors.subtext},
});
