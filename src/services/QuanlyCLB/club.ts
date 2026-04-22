import axios from '@/utils/axios';
import type { IClub } from '@/pages/QuanlyCLB/types';

// Mock API base URL - replace with actual API endpoint
const API_BASE = '/api/clubs';

/**
 * Get paginated list of clubs
 */
export async function getClubs(params: {
  page: number;
  limit: number;
  keyword?: string;
  sort?: any;
}) {
  return axios.get(`${API_BASE}/page`, { params });
}

/**
 * Get club by ID
 */
export async function getClubById(id: string) {
  return axios.get(`${API_BASE}/${id}`);
}

/**
 * Create new club
 */
export async function createClub(payload: Omit<IClub, 'id'>) {
  return axios.post(`${API_BASE}`, payload);
}

/**
 * Update club
 */
export async function updateClub(id: string, payload: Partial<IClub>) {
  return axios.put(`${API_BASE}/${id}`, payload);
}

/**
 * Delete club
 */
export async function deleteClub(id: string) {
  return axios.delete(`${API_BASE}/${id}`);
}

/**
 * Get members of a club
 */
export async function getClubMembers(
  clubId: string,
  params: {
    page: number;
    limit: number;
    keyword?: string;
  }
) {
  return axios.get(`${API_BASE}/${clubId}/members`, { params });
}

/**
 * Upload club avatar
 */
export async function uploadClubAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE}/upload-avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
