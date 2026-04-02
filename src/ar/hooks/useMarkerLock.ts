import {useCallback, useEffect, useRef, useState} from 'react';
import {ViroAnchorFoundMap, ViroAnchorUpdatedMap} from '@reactvision/react-viro';
import {
  CalibrationScanState,
  MarkerDetectionPayload,
  MarkerLockControllerConfig,
  MarkerTrackingQuality,
} from '../types/markerDetection.types';

const defaultTrackingQuality: MarkerTrackingQuality = 'TRACKING_LOST';

export const useMarkerLock = ({
  targetMarkerId,
  lockDelayMs,
  lostTrackingTimeoutMs,
}: MarkerLockControllerConfig) => {
  const [scanState, setScanState] =
    useState<CalibrationScanState>('WAITING_FOR_MARKER');
  const [detectedMarkerId, setDetectedMarkerId] = useState<string | null>(null);
  const [latestAnchorData, setLatestAnchorData] =
    useState<MarkerDetectionPayload | null>(null);
  const [isMarkerLocked, setIsMarkerLocked] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState<number | null>(null);
  const [trackingQuality, setTrackingQuality] =
    useState<MarkerTrackingQuality>(defaultTrackingQuality);

  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lostTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanStateRef = useRef<CalibrationScanState>('WAITING_FOR_MARKER');
  const trackingQualityRef = useRef<MarkerTrackingQuality>(defaultTrackingQuality);
  const latestAnchorRef = useRef<MarkerDetectionPayload | null>(null);
  const isLockedRef = useRef(false);

  const clearLockTimer = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, []);

  const clearLostTimer = useCallback(() => {
    if (lostTimerRef.current) {
      clearTimeout(lostTimerRef.current);
      lostTimerRef.current = null;
    }
  }, []);

  const updateScanState = useCallback((nextState: CalibrationScanState) => {
    if (scanStateRef.current === nextState) {
      return;
    }
    scanStateRef.current = nextState;
    setScanState(nextState);
  }, []);

  const normalizeAnchor = useCallback(
    (
      markerId: string,
      anchor: ViroAnchorFoundMap | ViroAnchorUpdatedMap,
      detectedAt?: number,
    ): MarkerDetectionPayload => {
      const now = Date.now();
      return {
        markerId,
        anchorId: anchor.anchorId,
        position: anchor.position,
        rotation: anchor.rotation,
        scale: anchor.scale,
        trackingMethod: anchor.trackingMethod,
        detectedAt: detectedAt ?? latestAnchorRef.current?.detectedAt ?? now,
        updatedAt: now,
      };
    },
    [],
  );

  const markTrackingLost = useCallback(() => {
    clearLockTimer();
    setIsMarkerLocked(false);
    isLockedRef.current = false;
    updateScanState('TRACKING_LOST');
    console.log('[MarkerLock] marker lost');
  }, [clearLockTimer, updateScanState]);

  const scheduleLostTimeout = useCallback(() => {
    clearLostTimer();
    lostTimerRef.current = setTimeout(() => {
      markTrackingLost();
    }, lostTrackingTimeoutMs);
  }, [clearLostTimer, lostTrackingTimeoutMs, markTrackingLost]);

  const scheduleLockAttempt = useCallback(() => {
    clearLockTimer();
    lockTimerRef.current = setTimeout(() => {
      const anchor = latestAnchorRef.current;
      if (!anchor || trackingQualityRef.current === 'TRACKING_LOST') {
        return;
      }
      setIsMarkerLocked(true);
      isLockedRef.current = true;
      updateScanState('MARKER_LOCKED');
      console.log('[MarkerLock] marker locked', anchor.anchorId);
    }, lockDelayMs);
  }, [clearLockTimer, lockDelayMs, updateScanState]);

  const handleMarkerFound = useCallback(
    (markerId: string, anchor: ViroAnchorFoundMap | ViroAnchorUpdatedMap) => {
      if (markerId !== targetMarkerId) {
        return;
      }

      const normalized = normalizeAnchor(markerId, anchor);
      latestAnchorRef.current = normalized;
      setLatestAnchorData(normalized);
      setDetectedMarkerId(markerId);
      setLastSeenAt(normalized.updatedAt);
      clearLostTimer();

      if (isLockedRef.current) {
        updateScanState('MARKER_LOCKED');
      } else {
        updateScanState('MARKER_FOUND');
        scheduleLockAttempt();
      }

      scheduleLostTimeout();
      console.log('[MarkerLock] marker found', markerId, normalized.anchorId);
    },
    [
      clearLostTimer,
      normalizeAnchor,
      scheduleLockAttempt,
      scheduleLostTimeout,
      targetMarkerId,
      updateScanState,
    ],
  );

  const handleMarkerUpdated = useCallback(
    (markerId: string, anchor: ViroAnchorUpdatedMap) => {
      if (markerId !== targetMarkerId) {
        return;
      }

      const normalized = normalizeAnchor(
        markerId,
        anchor,
        latestAnchorRef.current?.detectedAt,
      );
      latestAnchorRef.current = normalized;
      setLatestAnchorData(normalized);
      setDetectedMarkerId(markerId);
      setLastSeenAt(normalized.updatedAt);
      scheduleLostTimeout();

      if (trackingQualityRef.current === 'TRACKING_LOST') {
        return;
      }

      if (isLockedRef.current) {
        updateScanState(
          trackingQualityRef.current === 'LIMITED'
            ? 'TRACKING_WEAK'
            : 'MARKER_LOCKED',
        );
      } else {
        updateScanState('MARKER_LOCKING');
        scheduleLockAttempt();
      }

      console.log('[MarkerLock] marker updated', markerId, normalized.anchorId);
    },
    [
      normalizeAnchor,
      scheduleLockAttempt,
      scheduleLostTimeout,
      targetMarkerId,
      updateScanState,
    ],
  );

  const handleMarkerRemoved = useCallback(() => {
    markTrackingLost();
  }, [markTrackingLost]);

  const handleTrackingQualityChange = useCallback(
    (quality: MarkerTrackingQuality) => {
      trackingQualityRef.current = quality;
      setTrackingQuality(quality);

      if (quality === 'TRACKING_LOST') {
        markTrackingLost();
        return;
      }

      if (quality === 'LIMITED') {
        updateScanState('TRACKING_WEAK');
        return;
      }

      if (isLockedRef.current) {
        updateScanState('MARKER_LOCKED');
      } else if (latestAnchorRef.current) {
        updateScanState('MARKER_LOCKING');
      } else {
        updateScanState('WAITING_FOR_MARKER');
      }
    },
    [markTrackingLost, updateScanState],
  );

  const resetMarkerLock = useCallback(() => {
    clearLockTimer();
    clearLostTimer();
    latestAnchorRef.current = null;
    isLockedRef.current = false;
    trackingQualityRef.current = defaultTrackingQuality;
    setLatestAnchorData(null);
    setDetectedMarkerId(null);
    setLastSeenAt(null);
    setIsMarkerLocked(false);
    setTrackingQuality(defaultTrackingQuality);
    updateScanState('WAITING_FOR_MARKER');
  }, [clearLockTimer, clearLostTimer, updateScanState]);

  const lockMarker = useCallback(() => {
    if (!latestAnchorRef.current) {
      return;
    }
    clearLockTimer();
    setIsMarkerLocked(true);
    isLockedRef.current = true;
    updateScanState('MARKER_LOCKED');
  }, [clearLockTimer, updateScanState]);

  useEffect(() => {
    return () => {
      clearLockTimer();
      clearLostTimer();
    };
  }, [clearLockTimer, clearLostTimer]);

  return {
    scanState,
    detectedMarkerId,
    latestAnchorData,
    isMarkerLocked,
    lastSeenAt,
    trackingQuality,
    lockMarker,
    resetMarkerLock,
    handleMarkerFound,
    handleMarkerUpdated,
    handleMarkerRemoved,
    handleTrackingQualityChange,
  };
};
