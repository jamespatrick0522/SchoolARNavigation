import React from 'react';
import {ViroBox, ViroNode} from '@reactvision/react-viro';
import {Vector3} from '../../types/models';

interface Props {
  points: Vector3[];
}

export const RouteArrows: React.FC<Props> = ({points}) => {
  if (points.length < 2) {
    return null;
  }

  const segments = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    const mid: Vector3 = {
      x: (point.x + next.x) / 2,
      y: (point.y + next.y) / 2 + 0.05,
      z: (point.z + next.z) / 2,
    };
    return {id: `${index}`, mid};
  });

  return (
    <>
      {segments.map((segment, index) => (
        <ViroNode key={segment.id} position={[segment.mid.x, segment.mid.y, segment.mid.z]}>
          <ViroBox
            position={[0, 0, 0]}
            scale={[0.12, 0.04, 0.24]}
            materials={[index === 0 ? 'arrowMaterialActive' : 'arrowMaterialFuture']}
          />
        </ViroNode>
      ))}
    </>
  );
};
