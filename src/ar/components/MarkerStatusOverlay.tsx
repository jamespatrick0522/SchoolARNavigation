import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AppButton} from '../../components/AppButton';
import {colors, spacing} from '../../constants/theme';
import {
  CalibrationScanState,
  MarkerDetectionPayload,
} from '../types/markerDetection.types';

interface Props {
  scanState: CalibrationScanState;
  markerId: string | null;
  isMarkerLocked: boolean;
  latestAnchorData: MarkerDetectionPayload | null;
  onContinue: () => void;
  onReset: () => void;
}

const getInstruction = (scanState: CalibrationScanState) => {
  switch (scanState) {
    case 'MARKER_FOUND':
      return 'Marker detected';
    case 'MARKER_LOCKING':
      return 'Locking marker...';
    case 'MARKER_LOCKED':
      return 'Marker locked. You can now continue calibration';
    case 'TRACKING_WEAK':
      return 'Tracking weak';
    case 'TRACKING_LOST':
      return 'Tracking lost. Point back to the start marker';
    case 'ERROR':
      return 'Something went wrong while detecting the start marker';
    case 'IDLE':
    case 'WAITING_FOR_MARKER':
    default:
      return 'Point the camera at the printed start marker';
  }
};

const getBadgeTone = (scanState: CalibrationScanState) => {
  switch (scanState) {
    case 'MARKER_LOCKED':
      return styles.successBadge;
    case 'MARKER_FOUND':
    case 'MARKER_LOCKING':
      return styles.infoBadge;
    case 'TRACKING_WEAK':
      return styles.warningBadge;
    case 'TRACKING_LOST':
    case 'ERROR':
      return styles.dangerBadge;
    default:
      return styles.infoBadge;
  }
};

export const MarkerStatusOverlay: React.FC<Props> = ({
  scanState,
  markerId,
  isMarkerLocked,
  latestAnchorData,
  onContinue,
  onReset,
}) => {
  const positionLabel = useMemo(() => {
    if (!latestAnchorData) {
      return 'Waiting for anchor data';
    }
    return latestAnchorData.position.map(value => value.toFixed(2)).join(', ');
  }, [latestAnchorData]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.card}>
        <View style={[styles.badge, getBadgeTone(scanState)]}>
          <Text style={styles.badgeText}>{scanState.replaceAll('_', ' ')}</Text>
        </View>

        <Text style={styles.title}>Scan Start Marker</Text>
        <Text style={styles.instruction}>{getInstruction(scanState)}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Marker ID</Text>
          <Text style={styles.metaValue}>{markerId ?? 'Not detected yet'}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Lock Status</Text>
          <Text style={styles.metaValue}>
            {isMarkerLocked ? 'Locked' : 'Not locked'}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Anchor Position</Text>
          <Text style={styles.metaValue}>{positionLabel}</Text>
        </View>

        <View style={styles.actions}>
          <AppButton
            label="Continue Calibration"
            onPress={onContinue}
            disabled={!isMarkerLocked}
          />
          <AppButton
            label="Reset Marker Scan"
            variant="secondary"
            onPress={onReset}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  card: {
    backgroundColor: 'rgba(12, 18, 32, 0.92)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.md,
    gap: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  infoBadge: {
    backgroundColor: '#0F3D69',
  },
  successBadge: {
    backgroundColor: '#14532D',
  },
  warningBadge: {
    backgroundColor: '#78350F',
  },
  dangerBadge: {
    backgroundColor: '#7F1D1D',
  },
  badgeText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  instruction: {
    color: colors.subtext,
    fontSize: 15,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  metaLabel: {
    color: colors.subtext,
    fontSize: 13,
    fontWeight: '600',
  },
  metaValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
