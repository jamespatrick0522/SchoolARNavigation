import {ViroARTrackingTargets} from '@reactvision/react-viro';
import {createViroTrackingTargets} from '../config/markerTargets';

let initialized = false;

export const initializeTrackingTargets = () => {
  if (initialized) {
    return;
  }
  // Register all configured image targets once before any AR scene uses them.
  ViroARTrackingTargets.createTargets(createViroTrackingTargets());
  initialized = true;
};
