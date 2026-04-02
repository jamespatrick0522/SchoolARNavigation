import React from 'react';
import {
  ViroARImageMarker,
  ViroARScene,
  ViroAmbientLight,
  ViroNode,
  ViroText,
} from '@reactvision/react-viro';
import {START_MARKER_TARGET_ID} from '../constants/marker.constants';
import {initializeTrackingTargets} from '../utils/viroTargets';

interface MarkerDetectionDemoSceneProps {
  sceneNavigator: {
    viroAppProps?: {
      onStartMarkerFound?: () => void;
    };
  };
}

export const MarkerDetectionDemoScene: React.FC<
  MarkerDetectionDemoSceneProps
> = props => {
  initializeTrackingTargets();

  return (
    <ViroARScene>
      <ViroAmbientLight color="#FFFFFF" />
      <ViroARImageMarker
        target={START_MARKER_TARGET_ID}
        onAnchorFound={() =>
          props.sceneNavigator.viroAppProps?.onStartMarkerFound?.()
        }>
        <ViroNode>
          <ViroText
            text="START_001 detected"
            position={[0, 0.16, 0]}
            scale={[0.2, 0.2, 0.2]}
            style={demoLabelStyle}
          />
        </ViroNode>
      </ViroARImageMarker>
    </ViroARScene>
  );
};

const demoLabelStyle = {
  fontSize: 24,
  color: '#FFFFFF',
  textAlign: 'center',
} as const;
