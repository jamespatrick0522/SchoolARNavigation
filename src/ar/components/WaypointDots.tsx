import React from 'react';
import {ViroNode, ViroSphere, ViroText} from '@reactvision/react-viro';
import {Waypoint} from '../../types/models';

interface Props {
  waypoints: Waypoint[];
}

export const WaypointDots: React.FC<Props> = ({waypoints}) => {
  return (
    <>
      {waypoints.map(waypoint => (
        <ViroNode
          key={waypoint.id}
          position={[waypoint.position.x, waypoint.position.y + 0.03, waypoint.position.z]}>
          <ViroSphere radius={0.05} materials={['waypointMaterial']} />
          <ViroText
            text={`${waypoint.order}`}
            position={[0, 0.1, 0]}
            scale={[0.2, 0.2, 0.2]}
            style={viroTextStyle}
          />
        </ViroNode>
      ))}
    </>
  );
};

const viroTextStyle = {fontSize: 24, color: '#FFFFFF', textAlign: 'center'} as const;
