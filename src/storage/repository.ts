import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from './keys';
import {
  AppStorageSchema,
  Destination,
  MarkerOrigin,
  RouteCalibration,
} from '../types/models';

const defaultSchema = (): AppStorageSchema => ({
  markerOrigins: [],
  destinations: [],
  routeCalibrations: [],
  demoMode: true,
  lastUpdatedAt: new Date().toISOString(),
});

const safeParse = (value: string | null): AppStorageSchema => {
  if (!value) {
    return defaultSchema();
  }
  try {
    const parsed = JSON.parse(value) as AppStorageSchema;
    return {
      markerOrigins: parsed.markerOrigins ?? [],
      destinations: parsed.destinations ?? [],
      routeCalibrations: parsed.routeCalibrations ?? [],
      demoMode: parsed.demoMode ?? true,
      lastUpdatedAt: parsed.lastUpdatedAt ?? new Date().toISOString(),
    };
  } catch {
    return defaultSchema();
  }
};

const saveSchema = async (schema: AppStorageSchema): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({...schema, lastUpdatedAt: new Date().toISOString()}),
  );
};

export const appRepository = {
  async getSchema(): Promise<AppStorageSchema> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return safeParse(raw);
  },

  async saveMarkerOrigin(markerOrigin: MarkerOrigin): Promise<void> {
    const schema = await this.getSchema();
    const existing = schema.markerOrigins.find(m => m.id === markerOrigin.id);
    if (existing) {
      schema.markerOrigins = schema.markerOrigins.map(m =>
        m.id === markerOrigin.id ? markerOrigin : m,
      );
    } else {
      schema.markerOrigins.push(markerOrigin);
    }
    await saveSchema(schema);
  },

  async getMarkerOrigins(): Promise<MarkerOrigin[]> {
    const schema = await this.getSchema();
    return schema.markerOrigins;
  },

  async saveRouteCalibration(
    destination: Destination,
    routeCalibration: RouteCalibration,
  ): Promise<void> {
    const schema = await this.getSchema();
    const duplicateName = schema.destinations.find(
      d =>
        d.markerOriginId === destination.markerOriginId &&
        d.name.trim().toLowerCase() === destination.name.trim().toLowerCase() &&
        d.id !== destination.id,
    );
    if (duplicateName) {
      throw new Error('Destination name already exists for this marker origin.');
    }

    const destinationIndex = schema.destinations.findIndex(
      d => d.id === destination.id,
    );
    if (destinationIndex >= 0) {
      schema.destinations[destinationIndex] = destination;
    } else {
      schema.destinations.push(destination);
    }

    const routeIndex = schema.routeCalibrations.findIndex(
      r => r.id === routeCalibration.id || r.destinationId === destination.id,
    );
    if (routeIndex >= 0) {
      schema.routeCalibrations[routeIndex] = routeCalibration;
    } else {
      schema.routeCalibrations.push(routeCalibration);
    }
    await saveSchema(schema);
  },

  async getAllDestinations(): Promise<Destination[]> {
    const schema = await this.getSchema();
    return schema.destinations;
  },

  async getRouteByDestinationId(
    destinationId: string,
  ): Promise<RouteCalibration | undefined> {
    const schema = await this.getSchema();
    return schema.routeCalibrations.find(r => r.destinationId === destinationId);
  },

  async updateDestination(
    destinationId: string,
    updates: Pick<Destination, 'name' | 'category' | 'description'>,
  ): Promise<void> {
    const schema = await this.getSchema();
    const destination = schema.destinations.find(d => d.id === destinationId);
    if (!destination) {
      throw new Error('Destination not found.');
    }
    const duplicateName = schema.destinations.find(
      d =>
        d.id !== destinationId &&
        d.markerOriginId === destination.markerOriginId &&
        d.name.trim().toLowerCase() === updates.name.trim().toLowerCase(),
    );
    if (duplicateName) {
      throw new Error('Another destination already uses that name.');
    }
    destination.name = updates.name.trim();
    destination.category = updates.category.trim();
    destination.description = updates.description.trim();
    destination.updatedAt = new Date().toISOString();
    await saveSchema(schema);
  },

  async deleteDestination(destinationId: string): Promise<void> {
    const schema = await this.getSchema();
    schema.destinations = schema.destinations.filter(d => d.id !== destinationId);
    schema.routeCalibrations = schema.routeCalibrations.filter(
      r => r.destinationId !== destinationId,
    );
    await saveSchema(schema);
  },

  async setDemoMode(value: boolean): Promise<void> {
    const schema = await this.getSchema();
    schema.demoMode = value;
    await saveSchema(schema);
  },

  async resetAllData(): Promise<void> {
    await saveSchema(defaultSchema());
  },
};
