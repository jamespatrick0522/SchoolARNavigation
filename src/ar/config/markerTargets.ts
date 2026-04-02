import {MarkerTargetDefinition} from '../types/marker.types';
import {
  DEFAULT_START_MARKER_PHYSICAL_WIDTH_METERS,
  START_MARKER_FILE_NAME,
  START_MARKER_NAME,
  START_MARKER_TARGET_ID,
} from '../constants/marker.constants';

const markerAssetSources: Record<string, number> = {
  [START_MARKER_FILE_NAME]: require('../../assets/markers/start-marker.png'),
};

export const markerTargets: MarkerTargetDefinition[] = [
  {
    id: START_MARKER_TARGET_ID,
    name: START_MARKER_NAME,
    assetName: START_MARKER_FILE_NAME,
    physicalWidthMeters: DEFAULT_START_MARKER_PHYSICAL_WIDTH_METERS,
    orientation: 'Up',
  },
];

export const createViroTrackingTargets = () =>
  Object.fromEntries(
    markerTargets.map(marker => [
      marker.id,
      {
        source: markerAssetSources[marker.assetName],
        physicalWidth: marker.physicalWidthMeters,
        orientation: marker.orientation,
      },
    ]),
  );
