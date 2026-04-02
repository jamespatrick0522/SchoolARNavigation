export type CalibrationScanState =
  | 'IDLE'
  | 'WAITING_FOR_MARKER'
  | 'MARKER_FOUND'
  | 'MARKER_LOCKING'
  | 'MARKER_LOCKED'
  | 'TRACKING_WEAK'
  | 'TRACKING_LOST'
  | 'ERROR';

export type MarkerTrackingQuality = 'NORMAL' | 'LIMITED' | 'TRACKING_LOST';

export interface MarkerDetectionPayload {
  markerId: string;
  anchorId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  trackingMethod?: string;
  detectedAt: number;
  updatedAt: number;
}

export interface MarkerLockControllerConfig {
  targetMarkerId: string;
  lockDelayMs: number;
  lostTrackingTimeoutMs: number;
}
