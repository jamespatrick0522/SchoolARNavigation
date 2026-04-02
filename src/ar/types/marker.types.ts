export type MarkerOrientation = 'Up' | 'Down' | 'Horizontal';

export interface MarkerTargetDefinition {
  id: string;
  name: string;
  assetName: string;
  physicalWidthMeters: number;
  orientation: MarkerOrientation;
}
