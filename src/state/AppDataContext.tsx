import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {appRepository} from '../storage/repository';
import {seedDemoData} from '../services/seedService';
import {AppStorageSchema, Destination, MarkerOrigin, RouteCalibration} from '../types/models';

interface AppDataContextValue {
  schema: AppStorageSchema;
  isLoading: boolean;
  refresh: () => Promise<void>;
  saveMarkerOrigin: (markerOrigin: MarkerOrigin) => Promise<void>;
  saveRouteCalibration: (
    destination: Destination,
    routeCalibration: RouteCalibration,
  ) => Promise<void>;
  updateDestination: (
    destinationId: string,
    updates: Pick<Destination, 'name' | 'category' | 'description'>,
  ) => Promise<void>;
  deleteDestination: (destinationId: string) => Promise<void>;
  resetAllData: () => Promise<void>;
  setDemoMode: (value: boolean) => Promise<void>;
  seedData: () => Promise<void>;
}

const defaultSchema: AppStorageSchema = {
  markerOrigins: [],
  destinations: [],
  routeCalibrations: [],
  demoMode: true,
  lastUpdatedAt: new Date().toISOString(),
};

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export const AppDataProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [schema, setSchema] = useState<AppStorageSchema>(defaultSchema);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await appRepository.getSchema();
    setSchema(next);
  }, []);

  useEffect(() => {
    refresh()
      .catch(() => {
        Alert.alert(
          'Storage Notice',
          'Data was unreadable and has been reset to protect the demo flow.',
        );
      })
      .finally(() => setIsLoading(false));
  }, [refresh]);

  const runAndRefresh = useCallback(
    async (fn: () => Promise<void>) => {
      await fn();
      await refresh();
    },
    [refresh],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      schema,
      isLoading,
      refresh,
      saveMarkerOrigin: markerOrigin =>
        runAndRefresh(() => appRepository.saveMarkerOrigin(markerOrigin)),
      saveRouteCalibration: (destination, routeCalibration) =>
        runAndRefresh(() =>
          appRepository.saveRouteCalibration(destination, routeCalibration),
        ),
      updateDestination: (destinationId, updates) =>
        runAndRefresh(() => appRepository.updateDestination(destinationId, updates)),
      deleteDestination: destinationId =>
        runAndRefresh(() => appRepository.deleteDestination(destinationId)),
      resetAllData: () => runAndRefresh(() => appRepository.resetAllData()),
      setDemoMode: demoModeValue =>
        runAndRefresh(() => appRepository.setDemoMode(demoModeValue)),
      seedData: () => runAndRefresh(() => seedDemoData()),
    }),
    [schema, isLoading, refresh, runAndRefresh],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = (): AppDataContextValue => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return ctx;
};
