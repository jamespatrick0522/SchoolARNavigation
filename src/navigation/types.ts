export type RootStackParamList = {
  Welcome: undefined;
  QrScan: undefined;
  RoomDirectory: {
    qrScope?: string;
    qrLabel?: string;
    buildingId?: number;
    floorId?: number;
  } | undefined;
  RoomDetail: {roomId: number};
  NavigationPreview: {roomId: number; roomName: string};
  Home: undefined;
  CalibrationIntro: undefined;
  CalibrationAR: undefined;
  NavigationIntro: undefined;
  NavigationSelectDestination: undefined;
  NavigationAR: {destinationId: string};
  SavedDestinations: undefined;
  Utility: undefined;
};
