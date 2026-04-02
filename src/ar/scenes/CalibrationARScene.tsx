import React, {useMemo} from 'react';
import {
  ViroAnchorFoundMap,
  ViroAnchorUpdatedMap,
  ViroARImageMarker,
  ViroARScene,
  ViroAmbientLight,
  ViroNode,
  ViroText,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';
import {initializeTrackingTargets} from '../utils/viroTargets';
import {START_MARKER_TARGET_ID} from '../constants/marker.constants';
import {MarkerTrackingQuality} from '../types/markerDetection.types';

export interface CalibrationARSceneProps {
  sceneNavigator: {
    viroAppProps: {
      targetMarkerId?: string;
      onMarkerFound: (markerId: string, anchor: ViroAnchorFoundMap) => void;
      onMarkerUpdated: (markerId: string, anchor: ViroAnchorUpdatedMap) => void;
      onMarkerRemoved: (markerId: string) => void;
      onTrackingChanged: (status: MarkerTrackingQuality) => void;
    };
  };
}

export const CalibrationARScene: React.FC<CalibrationARSceneProps> = props => {
  initializeTrackingTargets();

  const appProps = useMemo(
    () => props.sceneNavigator.viroAppProps,
    [props.sceneNavigator.viroAppProps],
  );
  const targetMarkerId = appProps.targetMarkerId ?? START_MARKER_TARGET_ID;

  return (
    <ViroARScene
      onTrackingUpdated={state => {
        if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
          appProps.onTrackingChanged('NORMAL');
        } else if (state === ViroTrackingStateConstants.TRACKING_LIMITED) {
          appProps.onTrackingChanged('LIMITED');
        } else {
          appProps.onTrackingChanged('TRACKING_LOST');
        }
      }}>
      <ViroAmbientLight color="#FFFFFF" />
      <ViroARImageMarker
        target={targetMarkerId}
        onAnchorFound={anchor => {
          appProps.onMarkerFound(targetMarkerId, anchor);
        }}
        onAnchorUpdated={anchor => {
          appProps.onMarkerUpdated(targetMarkerId, anchor);
        }}
        onAnchorRemoved={() => {
          appProps.onMarkerRemoved(targetMarkerId);
        }}>
        <ViroNode>
          <ViroText
            text="Start Marker"
            position={[0, 0.2, 0]}
            scale={[0.2, 0.2, 0.2]}
            style={markerLabelStyle}
          />
        </ViroNode>
      </ViroARImageMarker>
    </ViroARScene>
  );
};

const markerLabelStyle = {
  fontSize: 24,
  color: '#FFFFFF',
  textAlign: 'center',
} as const;
