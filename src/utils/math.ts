import {Vector3} from '../types/models';

export const distance3d = (a: Vector3, b: Vector3): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

export const toMetersLabel = (meters: number): string => `${meters.toFixed(1)} m`;
