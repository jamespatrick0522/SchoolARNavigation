import React, {useMemo, useRef} from 'react';
import {
  ViroARImageMarker,
  ViroARScene,
  ViroAmbientLight,
  ViroMaterials,
  ViroNode,
  ViroSphere,
  ViroText,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';
import {RouteArrows} from '../components/RouteArrows';
import {RouteCalibration, Vector3} from '../../types/models';
import {initializeTrackingTargets} from '../utils/viroTargets';
import {distance3d} from '../../utils/math';
import {START_MARKER_TARGET_ID} from '../constants/marker.constants';

interface SceneProps {
  sceneNavigator: {
    viroAppProps: {
      route: RouteCalibration;
      destinationName: string;
      onMarkerDetected: () => void;
      onTrackingChanged: (status: 'NORMAL' | 'LIMITED' | 'TRACKING_LOST') => void;
      onProgressUpdate: (
        distance: number,
        activeWaypointIndex: number,
        arrived: boolean,
      ) => void;
    };
  };
}

ViroMaterials.createMaterials({
  arrowMaterialActive: {diffuseColor: '#1EE3CF'},
  arrowMaterialFuture: {diffuseColor: '#4B5563'},
  destinationMaterial: {diffuseColor: '#F59E0B'},
});

export const NavigationARScene: React.FC<SceneProps> = props => {
  initializeTrackingTargets();
  const markerPosition = useRef<Vector3 | null>(null);
  const appProps = useMemo(
    () => props.sceneNavigator.viroAppProps,
    [props.sceneNavigator.viroAppProps],
  );
  const points: Vector3[] = [
    {x: 0, y: 0, z: 0},
    ...appProps.route.waypoints.map(w => w.position),
    appProps.route.destinationPose.position,
  ];

  return (
    <ViroARScene
      onCameraTransformUpdate={cameraTransform => {
        if (!markerPosition.current) {
          return;
        }
        const relativeCamera: Vector3 = {
          x: cameraTransform.position[0] - markerPosition.current.x,
          y: cameraTransform.position[1] - markerPosition.current.y,
          z: cameraTransform.position[2] - markerPosition.current.z,
        };
        const destinationPoint = appProps.route.destinationPose.position;
        const distance = distance3d(relativeCamera, destinationPoint);
        const pointsToCheck = [
          ...appProps.route.waypoints.map(w => w.position),
          destinationPoint,
        ];
        const nearestIndex = pointsToCheck.reduce(
          (best, point, index) => {
            const currentDistance = distance3d(relativeCamera, point);
            if (currentDistance < best.distance) {
              return {index, distance: currentDistance};
            }
            return best;
          },
          {index: 0, distance: Number.MAX_SAFE_INTEGER},
        );
        appProps.onProgressUpdate(distance, nearestIndex.index + 1, distance <= 0.9);
      }}
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
        target={START_MARKER_TARGET_ID}
        onAnchorFound={anchor => {
          markerPosition.current = {
            x: anchor.position[0],
            y: anchor.position[1],
            z: anchor.position[2],
          };
          appProps.onMarkerDetected();
        }}>
        <ViroNode>
          <RouteArrows points={points} />
          <ViroNode
            position={[
              appProps.route.destinationPose.position.x,
              appProps.route.destinationPose.position.y + 0.08,
              appProps.route.destinationPose.position.z,
            ]}>
            <ViroSphere radius={0.09} materials={['destinationMaterial']} />
            <ViroText
              text={appProps.destinationName}
              position={[0, 0.18, 0]}
              scale={[0.2, 0.2, 0.2]}
              style={destinationNameStyle}
            />
          </ViroNode>
        </ViroNode>
      </ViroARImageMarker>
    </ViroARScene>
  );
};

const destinationNameStyle = {
  fontSize: 24,
  color: '#FFFFFF',
  textAlign: 'center',
} as const;
