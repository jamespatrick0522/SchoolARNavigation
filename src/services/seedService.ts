import {appRepository} from '../storage/repository';
import {START_MARKER_ASSET_NAME, START_MARKER_ID, START_MARKER_WIDTH_METERS} from '../constants/marker';
import {createId} from '../utils/id';
import {Destination, MarkerOrigin, RouteCalibration, Waypoint} from '../types/models';

export const seedDemoData = async (): Promise<void> => {
  const markerOrigin: MarkerOrigin = {
    id: 'origin-start-001',
    name: 'Main Start Marker',
    markerId: START_MARKER_ID,
    physicalWidthMeters: START_MARKER_WIDTH_METERS,
    assetName: START_MARKER_ASSET_NAME,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await appRepository.saveMarkerOrigin(markerOrigin);

  const destinationId = createId('dest');
  const routeId = createId('route');
  const waypointA: Waypoint = {
    id: createId('wp'),
    routeId,
    order: 1,
    position: {x: 0.4, y: 0, z: -0.5},
    createdAt: new Date().toISOString(),
  };
  const waypointB: Waypoint = {
    id: createId('wp'),
    routeId,
    order: 2,
    position: {x: 0.8, y: 0, z: -1.2},
    createdAt: new Date().toISOString(),
  };

  const destination: Destination = {
    id: destinationId,
    name: 'Demo Route - Living Room',
    category: 'House Demo',
    description: 'Sample route for thesis panel walkthrough.',
    markerOriginId: markerOrigin.id,
    destinationPosition: {x: 1.1, y: 0, z: -1.8},
    waypointIds: [waypointA.id, waypointB.id],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const route: RouteCalibration = {
    id: routeId,
    destinationId,
    markerOriginId: markerOrigin.id,
    waypoints: [waypointA, waypointB],
    destinationPose: {
      position: destination.destinationPosition,
      rotation: {x: 0, y: 0, z: 0},
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await appRepository.saveRouteCalibration(destination, route);
};
