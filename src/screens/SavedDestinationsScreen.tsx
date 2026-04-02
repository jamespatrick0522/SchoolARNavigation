import React, {useMemo, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {ScreenContainer} from '../components/ScreenContainer';
import {SearchInput} from '../components/SearchInput';
import {Card} from '../components/Card';
import {StatusChip} from '../components/StatusChip';
import {InputField} from '../components/InputField';
import {AppButton} from '../components/AppButton';
import {useAppData} from '../state/AppDataContext';
import {spacing} from '../constants/theme';

export const SavedDestinationsScreen: React.FC = () => {
  const {schema, updateDestination, deleteDestination} = useAppData();
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

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
  }, [query, schema.destinations]);

  return (
    <ScreenContainer>
      <SearchInput value={query} onChangeText={setQuery} placeholder="Search destination..." />
      {!filtered.length ? (
        <Card title="No Saved Destinations" subtitle="Routes saved in calibration will appear here." />
      ) : null}

      {filtered.map(destination => {
        const route = schema.routeCalibrations.find(r => r.destinationId === destination.id);
        const isEditing = editingId === destination.id;
        return (
          <Card key={destination.id} title={destination.name} subtitle={destination.description}>
            <View style={styles.row}>
              <StatusChip label={destination.category} tone="info" />
              <StatusChip label={`${route?.waypoints.length ?? 0} waypoints`} tone="success" />
              <StatusChip
                label={`Updated ${new Date(destination.updatedAt).toLocaleDateString()}`}
                tone="warning"
              />
            </View>

            {isEditing ? (
              <>
                <InputField label="Name" value={name} onChangeText={setName} />
                <InputField label="Category" value={category} onChangeText={setCategory} />
                <InputField label="Description" value={description} onChangeText={setDescription} multiline />
                <AppButton
                  label="Save Changes"
                  onPress={async () => {
                    try {
                      await updateDestination(destination.id, {name, category, description});
                      setEditingId(null);
                    } catch (error) {
                      const message = error instanceof Error ? error.message : 'Update failed.';
                      Alert.alert('Edit Failed', message);
                    }
                  }}
                />
                <AppButton label="Cancel Edit" variant="secondary" onPress={() => setEditingId(null)} />
              </>
            ) : (
              <>
                <AppButton
                  label="Edit Metadata"
                  variant="secondary"
                  onPress={() => {
                    setEditingId(destination.id);
                    setName(destination.name);
                    setCategory(destination.category);
                    setDescription(destination.description);
                  }}
                />
                <AppButton
                  label="Delete Route"
                  variant="danger"
                  onPress={async () => {
                    await deleteDestination(destination.id);
                  }}
                />
              </>
            )}
          </Card>
        );
      })}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
