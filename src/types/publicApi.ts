export interface PublicQrEntry {
  id: number;
  qrCodeValue: string;
  label: string;
  description?: string | null;
  buildingId?: number | null;
  floorId?: number | null;
  roomId?: number | null;
  scopeType: 'school_directory' | 'building_directory' | 'floor_directory' | 'room_entry';
  imageUrl?: string | null;
}

export interface DirectoryCategory {
  id: number;
  code: string;
  name: string;
  colorHex?: string | null;
}

export interface DirectoryBuilding {
  id: number;
  code: string;
  name: string;
  imageUrl?: string | null;
  campusName?: string | null;
}

export interface DirectoryRoomListItem {
  id: number;
  roomCode: string;
  roomName: string;
  shortName?: string | null;
  description?: string | null;
  roomNumber?: string | null;
  imageUrl?: string | null;
  coverImageUrl?: string | null;
  nearestLandmark?: string | null;
  staticDistanceNote?: string | null;
  demoNavigationNote?: string | null;
  isFeatured: boolean;
  category: string;
  categoryCode: string;
  categoryColor?: string | null;
  buildingName: string;
  floorName: string;
}

export interface PaginatedRooms {
  items: DirectoryRoomListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RoomPerson {
  id: number;
  fullName: string;
  roleTitle?: string | null;
  email?: string | null;
  phone?: string | null;
  officeHours?: string | null;
  notes?: string | null;
  isPrimary: boolean;
}

export interface RoomGalleryItem {
  id: number;
  imageUrl: string;
  imageType?: string | null;
  caption?: string | null;
}

export interface NavigationPreviewConfig {
  id: number;
  roomId: number;
  arrowDirection: string;
  approximateDistanceMeters?: number | null;
  overlayLabel?: string | null;
  helperText?: string | null;
  mockStepsJson: string[];
}

export interface RoomDetail extends DirectoryRoomListItem {
  buildingId: number;
  floorId: number;
  categoryId: number;
  categoryName: string;
  operatingHours?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  locationNote?: string | null;
  capacity?: number | null;
  tagsJson: string[];
  people: RoomPerson[];
  gallery: RoomGalleryItem[];
  navigationPreview?: NavigationPreviewConfig | null;
}
