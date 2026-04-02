export type TrackingStatus =
  | 'UNKNOWN'
  | 'NORMAL'
  | 'LIMITED'
  | 'NOT_AVAILABLE'
  | 'TRACKING_LOST';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Pose {
  position: Vector3;
  rotation?: Vector3;
}

export interface MarkerOrigin {
  id: string;
  name: string;
  markerId: string;
  physicalWidthMeters: number;
  assetName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Waypoint {
  id: string;
  routeId: string;
  order: number;
  position: Vector3;
  rotation?: Vector3;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  category: string;
  description: string;
  markerOriginId: string;
  destinationPosition: Vector3;
  waypointIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RouteCalibration {
  id: string;
  destinationId: string;
  markerOriginId: string;
  waypoints: Waypoint[];
  destinationPose: Pose;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationSession {
  id: string;
  destinationId: string;
  markerOriginId: string;
  startedAt: string;
  endedAt?: string;
  currentWaypointIndex: number;
  status:
    | 'WAITING_FOR_MARKER'
    | 'MARKER_DETECTED'
    | 'DESTINATION_SELECTED'
    | 'ROUTE_RENDERING'
    | 'TRACKING_WEAK'
    | 'TRACKING_LOST'
    | 'RECOVERING'
    | 'ARRIVED';
}

export interface AppStorageSchema {
  markerOrigins: MarkerOrigin[];
  destinations: Destination[];
  routeCalibrations: RouteCalibration[];
  demoMode: boolean;
  lastUpdatedAt: string;
}

export type CalibrationState =
  | 'IDLE'
  | 'WAITING_FOR_MARKER'
  | 'MARKER_LOCKED'
  | 'ENTERING_DESTINATION_DETAILS'
  | 'PLACING_WAYPOINTS'
  | 'PLACING_DESTINATION'
  | 'REVIEWING_ROUTE'
  | 'SAVING'
  | 'SAVED'
  | 'ERROR';

export type NavigationState =
  | 'WAITING_FOR_MARKER'
  | 'MARKER_DETECTED'
  | 'DESTINATION_SELECTED'
  | 'ROUTE_RENDERING'
  | 'TRACKING_WEAK'
  | 'TRACKING_LOST'
  | 'RECOVERING'
  | 'ARRIVED';
