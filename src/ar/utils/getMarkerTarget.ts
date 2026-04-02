import {markerTargets} from '../config/markerTargets';
import {START_MARKER_TARGET_ID} from '../constants/marker.constants';
import {MarkerTargetDefinition} from '../types/marker.types';

export const getMarkerTargetById = (
  id: string,
): MarkerTargetDefinition | undefined =>
  markerTargets.find(marker => marker.id === id);

export const getDefaultStartMarker = (): MarkerTargetDefinition =>
  getMarkerTargetById(START_MARKER_TARGET_ID) ?? markerTargets[0];
