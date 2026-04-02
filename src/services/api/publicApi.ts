import {API_BASE_URL} from '../../config/api';
import {
  DirectoryBuilding,
  DirectoryCategory,
  PaginatedRooms,
  PublicQrEntry,
  RoomDetail,
  NavigationPreviewConfig,
} from '../../types/publicApi';

const toQueryString = (params: Record<string, string | number | boolean | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const publicApi = {
  getQrEntry(qrCodeValue: string) {
    return request<PublicQrEntry>(`/public/qr/${encodeURIComponent(qrCodeValue)}`);
  },
  getRooms(params: {
    search?: string;
    category?: string;
    buildingId?: number;
    floorId?: number;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    return request<PaginatedRooms>(`/public/rooms${toQueryString(params)}`);
  },
  getRoomById(id: number) {
    return request<RoomDetail>(`/public/rooms/${id}`);
  },
  getNavigationPreview(roomId: number) {
    return request<NavigationPreviewConfig>(`/public/rooms/${roomId}/navigation-preview`);
  },
  getCategories() {
    return request<DirectoryCategory[]>('/public/categories');
  },
  getBuildings() {
    return request<DirectoryBuilding[]>('/public/buildings');
  },
};
